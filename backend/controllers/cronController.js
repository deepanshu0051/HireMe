const Company  = require('../models/Company');
const EmailLog  = require('../models/EmailLog');
const AppSetting = require('../models/AppSetting');
const transporter = require('../config/mailer');

// ─── Daily limit constant ──────────────────────────────────────────────────────
const DAILY_LIMIT = 5;

/**
 * sendPendingEmails
 * ─────────────────────────────────────────────────────────────────────────────
 * Called on every cron tick (hourly, 10 AM–5 PM IST).
 *
 * Logic flow:
 *  1. Env kill-switch check  (CRON_ENABLED)
 *  2. DB setting check       (AppSetting: autoSendEnabled)
 *  3. Count emails sent TODAY from EmailLog → enforce 5/day cap
 *  4. Query only "Pending" companies (status === "Pending" — never contacted)
 *  5. Send up to (DAILY_LIMIT - alreadySentToday) emails this run
 *  6. Update Company status to "Sent" + create EmailLog entry per email
 *
 * @returns {Object} summary — { emailsSent, companiesList, errors }
 */
const sendPendingEmails = async () => {
  const summary = { emailsSent: 0, companiesList: [], errors: [] };

  const runTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`\n[CronController] ── Run started at ${runTimestamp} IST ──`);

  // ── GUARD 1: Environment kill-switch ─────────────────────────────────────────
  // If CRON_ENABLED is "false" in .env, skip entirely.
  if (process.env.CRON_ENABLED === 'false') {
    console.log('[CronController] CRON_ENABLED=false. Skipping run.');
    return summary;
  }

  // ── GUARD 2: Database-level toggle ────────────────────────────────────────────
  // Admin can flip this on/off via Settings page without touching .env.
  // Default: if the key does not exist yet in DB, treat as ENABLED (true).
  try {
    const autoSendSetting = await AppSetting.findOne({ key: 'autoSendEnabled' });
    const autoSendEnabled = autoSendSetting ? Boolean(autoSendSetting.value) : true;

    if (!autoSendEnabled) {
      console.log('[CronController] autoSendEnabled=false in DB. Skipping run.');
      return summary;
    }
  } catch (err) {
    console.error('[CronController] Could not read AppSetting. Aborting run.', err.message);
    return summary;
  }

  try {
    // ── STEP 3: Count how many emails have already been sent TODAY ───────────────
    // "Today" is defined as midnight 00:00:00 IST → 23:59:59 IST.
    // We build a UTC range that corresponds to that IST window.
    const nowIST = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );
    const startOfTodayIST = new Date(nowIST);
    startOfTodayIST.setHours(0, 0, 0, 0);

    const endOfTodayIST = new Date(nowIST);
    endOfTodayIST.setHours(23, 59, 59, 999);

    // Offset back to UTC for the actual MongoDB query
    // IST = UTC+5:30, so subtract 5h30m to convert IST midnight → UTC
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const startUTC = new Date(startOfTodayIST.getTime() - IST_OFFSET_MS);
    const endUTC   = new Date(endOfTodayIST.getTime() - IST_OFFSET_MS);

    const alreadySentToday = await EmailLog.countDocuments({
      status: 'Sent',
      sentAt: { $gte: startUTC, $lte: endUTC },
    });

    console.log(`[CronController] Emails sent today so far: ${alreadySentToday} / ${DAILY_LIMIT}`);

    // ── STEP 3b: Enforce daily cap ────────────────────────────────────────────────
    if (alreadySentToday >= DAILY_LIMIT) {
      console.log(`[CronController] Daily limit of ${DAILY_LIMIT} reached. Skipping this run.`);
      return summary;
    }

    const allowedThisRun = DAILY_LIMIT - alreadySentToday;
    console.log(`[CronController] Slots remaining today: ${allowedThisRun}. Will send up to ${allowedThisRun} this run.`);

    // ── STEP 4: Query ONLY "Pending" companies (never contacted before) ───────────
    // Strict filter: status must be exactly "Pending".
    // Companies with status "Sent" or "Failed" are NEVER re-contacted.
    const pendingCompanies = await Company.find({
      status: 'Pending',   // Only truly virgin contacts
    }).limit(allowedThisRun);

    if (pendingCompanies.length === 0) {
      console.log('[CronController] No pending companies available. Nothing to send.');
      return summary;
    }

    console.log(`[CronController] Found ${pendingCompanies.length} pending compan${pendingCompanies.length === 1 ? 'y' : 'ies'} to contact this run.`);

    // ── STEP 5: Send emails ────────────────────────────────────────────────────────
    for (const company of pendingCompanies) {
      try {
        const subject = `Job Application — ${company.jobRole} Position`;
        const body =
`Hi ${company.companyName} Team,

I hope this message finds you well. I am writing to express my sincere interest in the ${company.jobRole} role at ${company.companyName}.

I am a passionate developer with hands-on experience in building full-stack web applications. I would love the opportunity to contribute to your team and bring value to your organization.

Please find my resume attached. I would greatly appreciate the chance to discuss this further at your earliest convenience.

Thank you for your time and consideration.

Best regards,
HireMe Applicant`;

        // Send via Nodemailer
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: company.hrEmail,
          subject,
          text: body,
        });

        const sentAt = new Date();

        // Log to EmailLog collection
        const emailLog = new EmailLog({
          company: company._id,
          subject,
          body,
          status: 'Sent',
          sentAt,
        });
        await emailLog.save();

        // Mark company as "Sent" so it is never re-contacted
        company.status = 'Sent';
        company.sentAt = sentAt;
        await company.save();

        summary.emailsSent += 1;
        summary.companiesList.push({
          id: company._id,
          companyName: company.companyName,
          hrEmail: company.hrEmail,
        });

        console.log(`[CronController] ✓ Sent to ${company.companyName} <${company.hrEmail}>`);
      } catch (emailError) {
        // Per-company failure — mark as Failed but continue the batch
        console.error(`[CronController] ✗ Failed for ${company.companyName}:`, emailError.message);

        company.status = 'Failed';
        await company.save();

        summary.errors.push({ company: company.companyName, error: emailError.message });
      }
    }

    console.log(
      `[CronController] ── Run summary: sent=${summary.emailsSent}, errors=${summary.errors.length}, ` +
      `total today=${alreadySentToday + summary.emailsSent}/${DAILY_LIMIT} ──\n`
    );

  } catch (error) {
    // Top-level catch for DB query failures etc.
    console.error('[CronController] Critical batch error:', error.message);
    summary.errors.push({ company: 'SYSTEM', error: error.message });
  }

  return summary;
};

module.exports = { sendPendingEmails };
