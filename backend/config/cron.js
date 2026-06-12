const cron = require('node-cron');

/**
 * startCronJob
 * ─────────────────────────────────────────────────────────────────
 * Registers a cron job that runs EVERY HOUR between 10 AM and 5 PM IST.
 *
 * Cron expression: "0 10-17 * * *"
 *   - minute  = 0   (top of each hour)
 *   - hour    = 10-17  (10 AM through 5 PM inclusive)
 *   - day/month/weekday = * (every day)
 *
 * Each tick delegates to `callback` (sendPendingEmails), which handles:
 *   - DB-level autoSendEnabled guard
 *   - 5 emails/day cap (counted from EmailLog)
 *   - Only "Pending" (never-contacted) companies
 *
 * @param {Function} callback  Async function executed on each tick.
 * @returns {boolean}          true if registered, false if disabled via env.
 */
const startCronJob = (callback) => {
  // ── Env-level kill switch ──────────────────────────────────────
  // If CRON_ENABLED is explicitly set to the string "false", bail out.
  const CRON_ENABLED = process.env.CRON_ENABLED !== 'false';

  if (!CRON_ENABLED) {
    console.warn('[CRON] CRON_ENABLED=false. Cron will NOT start.');
    return false;
  }

  // ── Register hourly job (Every Hour) ────────────────────
  cron.schedule(
    '0 * * * *',      // Every hour at top of the minute
    async () => {
      const timestamp = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });

      try {
        // Fetch bounds from DB immediately before evaluating
        const AppSetting = require('../models/AppSetting');
        const startSetting = await AppSetting.findOne({ key: 'cronStartHour' });
        const endSetting = await AppSetting.findOne({ key: 'cronEndHour' });
        const startHour = startSetting ? Number(startSetting.value) : 10;
        const endHour = endSetting ? Number(endSetting.value) : 17;

        // Isolate current hour precisely parsed natively in IST bounds
        const currentHour = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getHours();

        if (currentHour >= startHour && currentHour <= endHour) {
          console.log(`[CRON] Hourly tick at: ${timestamp} IST`);
          const summary = await callback();
          console.log(
            `[CRON] Run complete — sent: ${summary.emailsSent}, errors: ${summary.errors.length}`
          );
        } else {
          console.log(`[CRON] ${currentHour}:00 is outside scheduled logic bounds (${startHour}:00 - ${endHour}:00). Skipping tick at ${timestamp} IST.`);
        }
      } catch (error) {
        console.error(`[CRON] Unhandled error during run at ${timestamp}:`, error.message);
      }
    },
    {
      timezone: 'Asia/Kolkata',   // All times interpreted as IST
    }
  );

  console.log('[CRON] Dynamic scheduling poller attached (bounds synced with AppSettings DB)');
  return true;
};

module.exports = { startCronJob };
