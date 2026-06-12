/**
 * Cloudinary Configuration
 * ------------------------
 * Initialises the Cloudinary SDK v2 with credentials from environment variables.
 * `secure: true` ensures all delivered asset URLs are HTTPS — required for CSP and iframe embeds.
 */

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,  // Force HTTPS on all URLs
});

module.exports = cloudinary;
