const express = require('express');
const router = express.Router();
const { handleCronTrigger } = require('../controllers/cronController');

/**
 * POST /api/cron/trigger
 * ──────────────────────────────────────────────────────────────────────────
 * Securely trigger the email automation from an external cron service
 * (e.g. cron-job.org). This replaces the in-process node-cron schedule
 * which was unreliable on Render Free Tier due to container sleep.
 *
 * Security:
 *   Caller must include the header: X-Cron-Secret: <CRON_SECRET>
 *   The value is compared against process.env.CRON_SECRET.
 *   Any mismatch returns 401. Missing env var returns 503.
 */
router.post('/trigger', async (req, res) => {
  // ── 1. Guard: ensure CRON_SECRET is configured ─────────────────────────
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    console.error('[CRON] CRON_SECRET is not set in environment variables.');
    return res.status(503).json({
      success: false,
      message: 'Cron secret is not configured on the server.',
    });
  }

  // ── 2. Validate the incoming secret header ──────────────────────────────
  const incomingSecret = req.headers['x-cron-secret'];
  if (!incomingSecret || incomingSecret !== expectedSecret) {
    console.warn('[CRON] Unauthorized trigger attempt — invalid or missing X-Cron-Secret header.');
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Invalid or missing cron secret.',
    });
  }

  // ── 3. Authorised — run the email automation ────────────────────────────
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`[CRON] External trigger received at ${timestamp} IST`);

  try {
    const summary = await handleCronTrigger();

    console.log(
      `[CRON] Run complete — sent: ${summary.emailsSent}, errors: ${summary.errors.length}`
    );

    return res.status(200).send('OK');
  } catch (err) {
    console.error('[CRON] Unhandled error during external trigger run:', err.message);
    return res.status(500).send('ERROR');
  }
});

module.exports = router;
