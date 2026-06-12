const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    key: { 
      type: String, 
      unique: true, 
      enum: ["admin", "demo"], 
      required: true,
      trim: true
    },
    fullName: { type: String, trim: true, maxlength: 50 },
    email: { type: String, trim: true, lowercase: true, maxlength: 100 },
    mobile: { type: String, trim: true, maxlength: 15 },
    address: { type: String, trim: true, maxlength: 200 },
    role: { type: String, trim: true, maxlength: 50 },
    jobType: { 
      type: String, 
      enum: ["Full Time", "Remote", "Hybrid", "Internship"],
      trim: true
    },
    expectedSalaryMinLpa: { type: Number },
    expectedSalaryMaxLpa: { type: Number },
    availability: { 
      type: String, 
      enum: ["Immediately Available", "15 Days", "30 Days", "45 Days", "60 Days", "90 Days"],
      trim: true
    },
    avatar: { type: String, trim: true },
    languages: [{ type: String, trim: true, maxlength: 30 }],
    skills: [{ type: String, trim: true, maxlength: 30 }],
    prefLocations: [{ type: String, trim: true, maxlength: 40 }],
    linkedin: { type: String, trim: true, maxlength: 200 },
    github: { type: String, trim: true, maxlength: 200 }
  },
  {
    timestamps: true,
    collection: 'profiles'
  }
);

module.exports = mongoose.model('Profile', ProfileSchema);
