const nodemailer = require('nodemailer');
const dns = require('dns');

// Belt-and-suspenders: also set Node.js resolver order to prefer IPv4
dns.setDefaultResultOrder('ipv4first');

// Debug: confirm credentials are loaded from environment
console.log('EMAIL_USER loaded:', process.env.EMAIL_USER ? 'YES' : 'NO - MISSING!');
console.log('EMAIL_PASS loaded:', process.env.EMAIL_PASS ? 'YES' : 'NO - MISSING!');

/**
 * Build a Nodemailer transporter.
 * When `host` is an IPv4 address we also set tls.servername so that
 * TLS certificate validation still checks against 'smtp.gmail.com'.
 */
function buildTransporter(host) {
  const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(host);
  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false, // STARTTLS
    family: 4,     // restrict socket to IPv4
    tls: {
      servername: 'smtp.gmail.com', // required when host is a bare IP
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Thin proxy exported to callers (cronController, sendEmailController).
 * The proxy delegates every method call to `_inner` so that when we
 * recreate `_inner` after the async DNS lookup the callers are unaffected.
 */
const transporterProxy = {
  _inner: buildTransporter('smtp.gmail.com'), // safe fallback while resolving

  sendMail(...args) {
    return this._inner.sendMail(...args);
  },

  verify(...args) {
    return this._inner.verify(...args);
  },
};

// Pre-resolve smtp.gmail.com → IPv4 A record (dns.resolve4 never returns AAAA)
// This bypasses libuv's getaddrinfo which ignores setDefaultResultOrder and
// picks IPv6 on dual-stack hosts like Render — causing ENETUNREACH errors.
dns.resolve4('smtp.gmail.com', (err, addresses) => {
  if (!err && addresses && addresses.length > 0) {
    const ipv4 = addresses[0];
    console.log('[MAILER] Resolved smtp.gmail.com to IPv4:', ipv4);
    transporterProxy._inner = buildTransporter(ipv4);
  } else {
    console.warn('[MAILER] IPv4 resolve failed, falling back to hostname:', err ? err.message : 'no addresses');
    // _inner is already set to the hostname-based transporter above
  }

  // Verify whichever transporter we ended up with
  transporterProxy._inner.verify((error) => {
    if (error) {
      console.error('SMTP Connection Error:', error.message);
    } else {
      console.log('SMTP Configured: Server is ready to take our messages');
    }
  });
});

module.exports = transporterProxy;
