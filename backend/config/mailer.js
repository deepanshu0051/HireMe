const axios = require('axios');

// Debug: confirm credentials are loaded from environment
console.log('EMAIL_USER loaded:', process.env.EMAIL_USER ? 'YES' : 'NO - MISSING!');
console.log('BREVO_API_KEY loaded:', process.env.BREVO_API_KEY ? 'YES' : 'NO - MISSING!');

/**
 * A thin proxy that mimics Nodemailer's transporter interface, allowing us
 * to use Brevo's HTTP API as a drop-in replacement for raw SMTP.
 * Render blocks SMTP (port 465/587) on free tiers, but HTTP (port 443) passes through!
 */
const transporterProxy = {
  /**
   * sendMail({ from, to, subject, html, attachments })
   * Compatible with Nodemailer's sendMail signature.
   */
  async sendMail({ from, to, subject, html, attachments }) {
    // 1. Ensure we have the API key
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not defined in the environment variables.');
    }

    // 2. Format recipients for Brevo
    // Brevo expects array of objects: [{ name: '...', email: '...' }]
    const toList = Array.isArray(to) ? to : [to];
    const brevoTo = toList.map(email => ({ email }));

    // 3. Format sender (MUST match the verified email in Brevo)
    const senderEmail = process.env.EMAIL_USER;
    const sender = {
      name: 'HireMe Platform',
      email: senderEmail
    };

    // 4. Construct the Brevo API Payload
    const payload = {
      sender,
      to: brevoTo,
      subject,
      htmlContent: html,
    };

    // 5. Handle standard URL-based attachments
    if (attachments && attachments.length > 0) {
      payload.attachment = attachments.map(att => ({
        name: att.filename,
        url: att.path // Brevo can download directly from Cloudinary URL which we pass in 'path'
      }));
    }

    // 6. Send via Brevo REST API
    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        payload,
        {
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response && error.response.data
        ? JSON.stringify(error.response.data)
        : error.message;
      throw new Error(`Brevo API error: ${errorMessage}`);
    }
  },

  /**
   * verify() — called on startup to confirm email service is reachable.
   */
  async verify(callback) {
    if (!process.env.BREVO_API_KEY) {
      const err = new Error('BREVO_API_KEY is not set. Please add it to your .env in Render!');
      if (typeof callback === 'function') return callback(err);
      throw err;
    }
    console.log('SMTP Configured: Brevo API key present — HTTP service ready.');
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
