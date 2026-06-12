/**
 * Auth Controller
 * Handles Admin and Guest login flows, signing JWT tokens securely.
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * @desc    Login as Admin using access password + secret key
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginAdmin = (req, res) => {
  try {
    const { accessPassword, secretKey } = req.body;

    // 1. Validate presence of both required fields
    if (!accessPassword || !secretKey || typeof accessPassword !== 'string' || typeof secretKey !== 'string') {
      return res.status(400).json({ success: false, message: 'accessPassword and secretKey are required.' });
    }

    const storedPassword = process.env.ADMIN_ACCESS_PASSWORD;
    const storedSecret = process.env.ADMIN_SECRET_KEY;

    if (!storedPassword || !storedSecret) {
      console.error('[AuthController] ADMIN_ACCESS_PASSWORD or ADMIN_SECRET_KEY not set in .env');
      return res.status(500).json({ success: false, message: 'Server misconfiguration.' });
    }

    // 2. Constant-time comparison to prevent timing attacks
    const passwordBuffer = Buffer.from(accessPassword);
    const storedPasswordBuffer = Buffer.from(storedPassword);
    const secretBuffer = Buffer.from(secretKey);
    const storedSecretBuffer = Buffer.from(storedSecret);

    const passwordMatch =
      passwordBuffer.length === storedPasswordBuffer.length &&
      crypto.timingSafeEqual(passwordBuffer, storedPasswordBuffer);

    const secretMatch =
      secretBuffer.length === storedSecretBuffer.length &&
      crypto.timingSafeEqual(secretBuffer, storedSecretBuffer);

    if (!passwordMatch || !secretMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    // 3. Sign JWT
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ success: true, token, role: 'admin' });

  } catch (error) {
    console.error('[AuthController] loginAdmin error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
};

/**
 * @desc    Login as Guest — no credentials required
 * @route   POST /api/auth/guest
 * @access  Public
 */
const loginGuest = (req, res) => {
  try {
    // Sign a short-lived guest JWT (1 day)
    const token = jwt.sign({ role: 'guest' }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ success: true, token, role: 'guest' });

  } catch (error) {
    console.error('[AuthController] loginGuest error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during guest login.' });
  }
};

module.exports = { loginAdmin, loginGuest };
