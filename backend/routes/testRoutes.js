/**
 * testRoutes.js — TEMPORARY route for manual Resend email testing.
 * POST /api/test/send-email
 *
 * Protected by X-Admin-Key header (must match ADMIN_SECRET_KEY env var).
 * Remove this file and its server.js registration after testing is confirmed.
 */
const express = require('express');
const router  = express.Router();
const { sendPendingEmails } = require('../controllers/cronController');

router.post('/send-email', async (req, res) => {
  // ── Guard: require ADMIN_SECRET_KEY header ──────────────────────────────
  const expectedKey = process.env.ADMIN_SECRET_KEY;
  if (!expectedKey) {
    return res.status(503).json({ success: false, message: 'ADMIN_SECRET_KEY not configured on server.' });
  }

  const incomingKey = req.headers['x-admin-key'];
  if (!incomingKey || incomingKey !== expectedKey) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid or missing X-Admin-Key header.' });
  }

  // ── Run the existing sendPendingEmails logic ────────────────────────────
  try {
    console.log('[TestRoute] Manual Resend test triggered.');
    const summary = await sendPendingEmails();
    console.log(`[TestRoute] Done — sent: ${summary.emailsSent}, errors: ${summary.errors.length}`);

    return res.status(200).json({
      success: true,
      emailsSent: summary.emailsSent,
      companiesList: summary.companiesList,
      errors: summary.errors,
    });
  } catch (err) {
    console.error('[TestRoute] Unhandled error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
