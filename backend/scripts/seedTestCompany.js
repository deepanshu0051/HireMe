/**
 * seedTestCompany.js — Temporary seed script for Resend email testing.
 * Run once: node scripts/seedTestCompany.js
 * Delete this file after testing is confirmed.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Company  = require('../models/Company');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[Seed] Connected to MongoDB');

  const existing = await Company.findOne({ companyName: 'Test Company', hrEmail: 'deepubhati000x@gmail.com' });
  if (existing) {
    console.log('[Seed] Test company already exists — skipping insert.');
    console.log('[Seed] Existing doc:', existing.toObject());
    await mongoose.disconnect();
    return;
  }

  const doc = await Company.create({
    companyName: 'Test Company',
    jobRole:     'Full Stack Developer',  // correct schema field
    hrEmail:     'deepubhati000x@gmail.com',
    status:      'Pending',
  });

  console.log('[Seed] ✅ Test company inserted:', doc.toObject());
  await mongoose.disconnect();
})();
