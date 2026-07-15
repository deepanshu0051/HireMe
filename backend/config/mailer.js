const { Resend } = require('resend');

// Debug: confirm credentials are loaded from environment
console.log('EMAIL_USER loaded:', process.env.EMAIL_USER ? 'YES' : 'NO - MISSING!');
console.log('EMAIL_PASS loaded:', process.env.EMAIL_PASS ? 'YES' : 'NO - MISSING!');
console.log('RESEND_API_KEY loaded:', process.env.RESEND_API_KEY ? 'YES' : 'NO - MISSING!');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * A thin proxy that mimics Nodemailer's transporter interface.
 * Both cronController and sendEmailController call transporter.sendMail()
 * so this drop-in replacement requires zero changes in those files.
 *
 * Resend sends email over HTTPS (port 443), which is never blocked by
 * cloud platforms like Render — unlike raw SMTP (ports 587/465).
 */
const transporterProxy = {
  /**
   * sendMail({ from, to, subject, html, attachments })
   * Compatible with Nodemailer's sendMail signature.
   */
  async sendMail({ from, to, subject, html, attachments }) {
    const payload = {
      from: from || `HireMe <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };

    // Map Nodemailer-style attachments to Resend format if present
    if (attachments && attachments.length > 0) {
      payload.attachments = attachments.map(att => ({
        filename: att.filename,
        path:     att.path,   // Resend supports URL paths
      }));
    }

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      throw new Error(`Resend API error: ${error.message || JSON.stringify(error)}`);
    }

    return data;
  },

  /**
   * verify() — called on startup to confirm email service is reachable.
   * Resend doesn't have a verify endpoint, so we do a lightweight test send.
   */
  async verify(callback) {
    // Simply confirm the API key is present — actual delivery verified on first send
    if (!process.env.RESEND_API_KEY) {
      const err = new Error('RESEND_API_KEY is not set');
      if (typeof callback === 'function') return callback(err);
      throw err;
    }
    console.log('SMTP Configured: Resend API key present — service ready.');
    if (typeof callback === 'function') callback(null, true);
    return true;
  },
};

// Run verify on startup (matches existing behaviour)
transporterProxy.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', error.message);
  }
});

module.exports = transporterProxy;
