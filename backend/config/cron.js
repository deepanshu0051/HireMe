/**
 * cron.js — DEPRECATED / DISABLED
 * ──────────────────────────────────────────────────────────────────────────
 * The in-process node-cron scheduler has been REMOVED because it was
 * unreliable on Render Free Tier. When the container sleeps after 15 minutes
 * of inactivity, all in-memory cron ticks stop firing.
 *
 * REPLACEMENT APPROACH (external trigger):
 *   • POST /api/cron/trigger (secured with X-Cron-Secret header)
 *   • Schedule this via cron-job.org targeting your Render URL
 *   • cron-job.org will both WAKE the server on each hit AND trigger the job
 *   • No timing logic lives in this file anymore — the external service
 *     handles the 10 AM–5 PM IST window instead.
 *
 * This file is kept as a no-op module to avoid import errors in server.js.
 * `startCronJob` now logs a notice and returns false (disabled).
 */

const startCronJob = () => {
  console.log('[CRON] In-process node-cron scheduler is DISABLED.');
  console.log('[CRON] Use external trigger via POST /api/cron/trigger instead.');
  return false;
};

module.exports = { startCronJob };
