const Company = require('../models/Company');
const EmailLog = require('../models/EmailLog');
const transporter = require('../config/mailer');

/**
 * @desc    Automated daily batch: finds pending companies and sends them job application emails.
 *          Called by the cron scheduler every day at 9 AM IST.
 *
 * @returns {Object} summary - { emailsSent, companiesList, errors }
 */
const sendPendingEmails = async () => {
  const summary = {
    emailsSent: 0,
    companiesList: [],
    errors: [],
  };

  try {
    // 1. Get the start of today (midnight) to exclude companies already contacted today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 2. Query: find companies that are:
    //    - status "Pending" (not yet contacted)
    //    - NOT already emailed today (sentAt is null OR sentAt is before today)
    //    - NOT replied
    //    - Limit to top 5
    const pendingCompanies = await Company.find({
      status: 'Pending',
      replied: false,
      $or: [
        { sentAt: { $exists: false } }, // never emailed
        { sentAt: null },               // explicitly null
        { sentAt: { $lt: todayStart } }, // emailed before today
      ],
    }).limit(5);

    if (pendingCompanies.length === 0) {
      console.log('[CRON] No pending companies to email today.');
      return summary;
    }

    console.log(`[CRON] Found ${pendingCompanies.length} pending companies. Sending emails...`);

    // 3. Loop through each company and send an email
    for (const company of pendingCompanies) {
      try {
        const subject = `Job Application — ${company.jobRole} Position`;
        const body = `Hi ${company.companyName} Team,

I hope this message finds you well. I am writing to express my sincere interest in the ${company.jobRole} role at ${company.companyName}.

I am a passionate developer with hands-on experience in building full-stack web applications. I would love the opportunity to contribute to your team and bring value to your organization.

Please find my portfolio and resume attached. I would greatly appreciate the chance to discuss this further at your earliest convenience.

Thank you for your time and consideration.

Best regards,
HireMe Applicant`;

        // 4. Send the email via Nodemailer
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: company.hrEmail,
          subject: subject,
          text: body,
        });

        const sentAt = new Date();

        // 5. Create an EmailLog record for this sent email
        const emailLog = new EmailLog({
          company: company._id,
          subject: subject,
          body: body,
          status: 'Sent',
          sentAt: sentAt,
        });
        await emailLog.save();

        // 6. Update the Company record: mark as "Sent" with the current timestamp
        company.status = 'Sent';
        company.sentAt = sentAt;
        await company.save();

        // 7. Track in summary
        summary.emailsSent += 1;
        summary.companiesList.push({
          id: company._id,
          companyName: company.companyName,
          hrEmail: company.hrEmail,
        });

        console.log(`[CRON] ✓ Email sent to ${company.companyName} (${company.hrEmail})`);
      } catch (emailError) {
        // Gracefully handle per-company send failures without stopping the entire batch
        console.error(`[CRON] ✗ Failed to email ${company.companyName}:`, emailError.message);

        // Update company status to "Failed" so we know it needs attention
        company.status = 'Failed';
        await company.save();

        summary.errors.push({
          company: company.companyName,
          error: emailError.message,
        });
      }
    }
  } catch (error) {
    // Catch top-level errors (e.g., MongoDB query failures)
    console.error('[CRON] Critical error during batch email run:', error.message);
    summary.errors.push({ company: 'SYSTEM', error: error.message });
  }

  return summary;
};

module.exports = { sendPendingEmails };
