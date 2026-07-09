const Company  = require('../models/Company');
const EmailLog  = require('../models/EmailLog');
const AppSetting = require('../models/AppSetting');
const Profile = require('../models/Profile');
const Resume = require('../models/Resume');
const transporter = require('../config/mailer');
const { generateApplicationEmail } = require('../services/aiService');



/**
 * sendPendingEmails
 * ─────────────────────────────────────────────────────────────────────────────
 * Called on every cron tick (hourly, 10 AM–5 PM IST).
 */
const sendPendingEmails = async () => {
  const summary = { emailsSent: 0, companiesList: [], errors: [] };

  const runTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`\n[CronController] ── Run started at ${runTimestamp} IST ──`);

  // ── GUARDS ───────────────────────────────────────────────────────────────────
  if (process.env.CRON_ENABLED === 'false') return summary;

  try {
    const autoSendSetting = await AppSetting.findOne({ key: 'autoSendEnabled' });
    if (autoSendSetting && !autoSendSetting.value) return summary;
  } catch (err) {
    return summary;
  }

  // ── Read per-day cap from DB (fallback 5) ────────────────────────────────────
  let DAILY_LIMIT = 5;
  try {
    const limitSetting = await AppSetting.findOne({ key: 'emailsPerDay' });
    if (limitSetting && typeof limitSetting.value === 'number' && limitSetting.value >= 1 && limitSetting.value <= 5) {
      DAILY_LIMIT = limitSetting.value;
    }
  } catch (_) { /* fallback already set */ }

  try {
    // 1. Fetch Admin Profile + Resume for high-fidelity automation
    const adminProfile = await Profile.findOne({ key: 'admin' }).lean();
    const latestResume = await Resume.findOne().sort({ createdAt: -1 }).lean();

    // 2. Count daily usage
    const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const startOfTodayIST = new Date(nowIST);
    startOfTodayIST.setHours(0, 0, 0, 0);
    const endOfTodayIST = new Date(nowIST);
    endOfTodayIST.setHours(23, 59, 59, 999);
    
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const startUTC = new Date(startOfTodayIST.getTime() - IST_OFFSET_MS);
    const endUTC   = new Date(endOfTodayIST.getTime() - IST_OFFSET_MS);

    const alreadySentToday = await EmailLog.countDocuments({
      status: 'Sent',
      sentAt: { $gte: startUTC, $lte: endUTC },
    });

    if (alreadySentToday >= DAILY_LIMIT) {
      console.log(`[CronController] Daily limit reached (${DAILY_LIMIT}).`);
      return summary;
    }

    const allowedThisRun = DAILY_LIMIT - alreadySentToday;
    const pendingCompanies = await Company.find({ status: 'Pending' }).limit(allowedThisRun);

    if (pendingCompanies.length === 0) return summary;

    // 3. Process Batch
    for (const company of pendingCompanies) {
      try {
        // Guard: skip companies with no HR email
        if (!company.hrEmail) {
          console.log(`[CronController] ⟳ Skipping ${company.companyName} — hrEmail is null.`);
          company.status = 'Skipped';
          await company.save();
          continue;
        }

        // A. Generate AI Content
        const aiResult = await generateApplicationEmail(
          company.jobTitle || 'Software Developer',
          company.companyName,
          adminProfile ? adminProfile.skills : [],
          {
            applicantName: adminProfile ? adminProfile.fullName : "Deepanshu Bhati",
            applicantRole: adminProfile ? adminProfile.role : "Full Stack Developer"
          }
        );

        let finalBody = aiResult.email;
        const attachments = [];

        // B. Handle Resume Placement
        if (latestResume && latestResume.cloudinaryUrl) {
          try {
            // Attempt standard attachment logic
            attachments.push({
              filename: latestResume.filename || 'Resume_Deepanshu_Bhati.pdf',
              path: latestResume.cloudinaryUrl
            });
          } catch (attError) {
            // Reliability Fallback: Inject link into body if attachment fails
            finalBody += `\n\n[Resume Link: ${latestResume.cloudinaryUrl}]`;
          }
        }

        // C. Dispatch
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: company.hrEmail,
          subject: `Job Application — ${company.jobTitle} Position`,
          text: finalBody,
          attachments: attachments.length > 0 ? attachments : undefined
        });

        const sentAt = new Date();
        const emailLog = new EmailLog({
          company: company._id,
          subject: `Job Application — ${company.jobTitle} Position`,
          body: finalBody,
          status: 'Sent',
          sentAt,
        });
        await emailLog.save();

        company.status = 'Sent';
        company.sentAt = sentAt;
        await company.save();

        summary.emailsSent += 1;
        summary.companiesList.push({ id: company._id, companyName: company.companyName });
        console.log(`[CronController] ✓ Sent to ${company.companyName}`);

      } catch (emailError) {
        console.error(`[CronController] ✗ Failed for ${company.companyName}:`, emailError.message);
        company.status = 'Failed';
        await company.save();
        summary.errors.push({ company: company.companyName, error: emailError.message });
      }
    }

  } catch (error) {
    console.error('[CronController] Batch error:', error.message);
  }

  return summary;
};

module.exports = { sendPendingEmails };
