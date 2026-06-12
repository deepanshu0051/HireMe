// Load environment variables FIRST before any other imports
require('dotenv').config();

// --- ENV DIAGNOSTICS LOGGING ---
console.log('--- Environment Variables Status ---');
console.log(`PORT: ${process.env.PORT ? 'YES' : 'NO'}`);
console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'YES' : 'NO'}`);
console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? 'YES' : 'NO'}`);
console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'YES' : 'NO'}`);
console.log(`RAPIDAPI_KEY: ${process.env.RAPIDAPI_KEY ? 'YES' : 'NO'}`);
console.log(`RAPIDAPI_HOST: ${process.env.RAPIDAPI_HOST ? 'YES' : 'NO'}`);
console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'YES' : 'NO'}`);
console.log(`ADMIN_ACCESS_PASSWORD: ${process.env.ADMIN_ACCESS_PASSWORD ? 'YES' : 'NO'}`);
console.log(`ADMIN_SECRET_KEY: ${process.env.ADMIN_SECRET_KEY ? 'YES' : 'NO'}`);

if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
  console.warn('⚠️ WARNING: RAPIDAPI_KEY or RAPIDAPI_HOST is missing from your .env file! API requests will fail.');
}
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ WARNING: JWT_SECRET is missing! Auth endpoints will not function.');
}
console.log('------------------------------------');

const express = require('express');

// Initialize Express APP immediately after requiring express
const app = express();

const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Route Imports
const companyRoutes = require('./routes/companyRoutes');
const emailLogRoutes = require('./routes/emailLogRoutes');
const sendEmailRoutes = require('./routes/sendEmailRoutes');
const jobRoutes = require('./routes/jobRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Auth Middleware
const { requireAuth, requireAdmin } = require('./middleware/authMiddleware');

// Cron utility imports
const { startCronJob } = require('./config/cron');
const { sendPendingEmails } = require('./controllers/cronController');

// ─────────────────────────────────────────
//  1. Security Middleware
// ─────────────────────────────────────────

// Disable X-Powered-By to stop advertising Express
app.disable('x-powered-by');

// Set security HTTP headers — allow Cloudinary iframe embeds for resume preview
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
      frameSrc: ["'self'", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://res.cloudinary.com", "http://localhost:*"],
    }
  }
}));

// CORS — allow Vite dev origin + optional FRONTEND_URL from .env
const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) and explicitly allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} is not allowed.`));
    }
  },
  credentials: true,
}));

// Global rate limiter — 100 requests per 15 minutes per IP
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(globalRateLimiter);

// Parse JSON bodies with a 10kb cap to prevent JSON-bomb attacks
app.use(express.json({ limit: '10kb' }));

// ─── Custom NoSQL Injection Protection ───────────────────────────────────
// Protects against MongoDB operator injection ($gt, $ne, $where) and dot
// notation injection by recursively removing illegal keys in-place
// (preventing the req.query reset crashes caused by express-mongo-sanitize).
const sanitizePayload = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
  
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizePayload(obj[key]);
    }
  }
};

app.use((req, res, next) => {
  if (req.body) sanitizePayload(req.body);
  if (req.query) sanitizePayload(req.query);
  if (req.params) sanitizePayload(req.params);
  next();
});

// Protect against HTTP Parameter Pollution attacks
app.use(hpp());

// ─────────────────────────────────────────
//  2. Routes
// ─────────────────────────────────────────

// ─── Public: no token required ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Authenticated (admin OR guest): valid JWT required ───────────────────────
app.use('/api/jobs', requireAuth, jobRoutes);
app.use('/api/ai', requireAuth, aiRoutes);
app.use('/api/resume', requireAuth, resumeRoutes);
app.use('/api/profile', profileRoutes);

// Cloudinary is used natively - no local uploads served

// ─── Admin-only: valid JWT + admin role required ──────────────────────────────
app.use('/api/emails/send', requireAuth, requireAdmin, sendEmailRoutes);
app.use('/api/emails', requireAuth, requireAdmin, emailLogRoutes);
app.use('/api/companies', requireAuth, requireAdmin, companyRoutes);
app.use('/api/settings', requireAuth, requireAdmin, settingsRoutes);

// Basic health-check route
app.get('/', (req, res) => {
  res.send('HireMe Backend Running');
});

// ─────────────────────────────────────────
//  3. DB + Server Startup
// ─────────────────────────────────────────

connectDB()
  .then(() => {
    const isCronStarted = startCronJob(sendPendingEmails);
    if (isCronStarted) {
      console.log('[CRON] Automated email scheduler started successfully');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('[DB] FATAL ERROR: Failed to establish MongoDB connection. Exiting process.', error.message);
    process.exit(1);
  });
