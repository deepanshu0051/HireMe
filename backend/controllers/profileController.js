const Profile = require('../models/Profile');

// Strict sanitizer tracking < > and control chars
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').replace(/[\x00-\x1F\x7F]/g, '').trim();
};

const getProfile = async (req, res) => {
  try {
    const role = (req.user && req.user.role === 'admin') ? 'admin' : 'guest';
    const key = role === 'admin' ? 'admin' : 'demo';

    let profile = await Profile.findOne({ key }).lean();

    if (!profile) {
      if (key === 'demo') {
        const demoData = {
          key: 'demo',
          fullName: 'Demo User',
          email: 'demo@hireme.com',
          mobile: '9876543210',
          address: 'Demo Address, New Delhi, India',
          role: 'Full Stack Developer',
          jobType: 'Full Time',
          expectedSalaryMinLpa: 3,
          expectedSalaryMaxLpa: 8,
          availability: 'Immediately Available',
          languages: ['JavaScript', 'Python'],
          skills: ['React', 'Node.js', 'MongoDB'],
          prefLocations: ['Noida', 'Delhi', 'Remote'],
          linkedin: 'https://linkedin.com/in/demo-user',
          github: 'https://github.com/demo-user'
        };
        const savedDemo = await Profile.create(demoData);
        return res.status(200).json(savedDemo);
      } else {
        const adminData = {
          key: 'admin',
          fullName: '', email: '', mobile: '', address: '', role: '',
          jobType: 'Full Time',
          expectedSalaryMinLpa: 1, expectedSalaryMaxLpa: 2,
          availability: 'Immediately Available',
          languages: [], skills: [], prefLocations: [],
          linkedin: '', github: ''
        };
        const savedAdmin = await Profile.create(adminData);
        return res.status(200).json(savedAdmin);
      }
    }

    return res.status(200).json(profile);
  } catch (err) {
    console.error('[Profile] getProfile Error:', err);
    return res.status(500).json({ message: 'Server Error loading profile' });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const data = req.body;

    // Silently ignore unexpected fields that we removed, e.g. portfolio
    if (data.portfolio !== undefined) {
      delete data.portfolio;
    }

    // 1) fullName
    const sFullName = sanitizeString(data.fullName);
    if (!sFullName || !/^[A-Za-z\s]+$/.test(sFullName) || sFullName.length < 2 || sFullName.length > 50) {
      return res.status(400).json({ message: "Invalid fullName: requires only letters and spaces, 2-50 chars" });
    }

    // 2) email
    const sEmail = sanitizeString(data.email).toLowerCase();
    if (!sEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sEmail)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // 3) mobile
    const sMobile = sanitizeString(data.mobile).replace(/\D/g, '');
    if (sMobile.length !== 10 || !/^[6-9]/.test(sMobile)) {
      return res.status(400).json({ message: "Invalid mobile: requires 10 digits starting with 6,7,8, or 9" });
    }

    // 4) address
    const sAddress = sanitizeString(data.address);
    if (sAddress.length < 10 || sAddress.length > 200) {
      return res.status(400).json({ message: "Invalid address: 10-200 chars" });
    }

    // 5) jobType
    const allowedJobTypes = ["Full Time", "Remote", "Hybrid", "Internship"];
    if (!allowedJobTypes.includes(data.jobType)) {
      return res.status(400).json({ message: "Invalid jobType" });
    }

    // 6) expected salary bounds
    const minLpa = parseInt(data.expectedSalaryMinLpa, 10);
    const maxLpa = parseInt(data.expectedSalaryMaxLpa, 10);
    if (isNaN(minLpa) || minLpa < 1 || minLpa > 99) return res.status(400).json({ message: "Invalid expectedSalaryMinLpa" });
    if (isNaN(maxLpa) || maxLpa < 1 || maxLpa > 99 || maxLpa < minLpa) return res.status(400).json({ message: "Invalid expectedSalaryMaxLpa" });

    // 7) availability
    const allowedAvailability = ["Immediately Available", "15 Days", "30 Days", "45 Days", "60 Days", "90 Days"];
    if (!allowedAvailability.includes(data.availability)) {
      return res.status(400).json({ message: "Invalid availability" });
    }

    // Array sanitizer helper
    const processArray = (arr, minLen, maxLen, isLocation = false) => {
      if (!Array.isArray(arr)) return [];
      const clean = [];
      for (const item of arr) {
        if (typeof item !== 'string') continue;
        const s = sanitizeString(item);
        if (s.length >= minLen && s.length <= maxLen) {
          if (!clean.map(x => x.toLowerCase()).includes(s.toLowerCase())) {
            clean.push(isLocation && s.toLowerCase() === 'remote' ? 'Remote' : s);
          }
        }
      }
      return clean.slice(0, 20); // enforce generalized 20 cap max
    };

    // 8) Arrays (allow "Remote" specially for prefLocations cap 10)
    const sLocations = processArray(data.prefLocations, 2, 40, true).slice(0, 10);
    if (sLocations.length === 0) return res.status(400).json({ message: "Requires at least 1 prefLocation" });

    // URL Validator
    const validateUrl = (urlStr, needle) => {
      let s = sanitizeString(urlStr);
      if (s.includes('javascript:') || s.includes(' ') || !s.includes(needle)) return false;
      if (!/^https?:\/\//.test(s)) s = `https://${s}`;
      const parts = s.split(needle);
      if (parts.length < 2 || !/[A-Za-z]/.test(parts[1])) return false;
      return s;
    };

    // 9) Social Links
    const sLinkedin = validateUrl(data.linkedin, "linkedin.com/in/");
    if (!sLinkedin) return res.status(400).json({ message: "Invalid linkedin URL" });

    const sGithub = validateUrl(data.github, "github.com/");
    if (!sGithub) return res.status(400).json({ message: "Invalid github URL" });

    // Build update object
    const updateDoc = {
      fullName: sFullName,
      email: sEmail,
      mobile: sMobile,
      address: sAddress,
      role: sanitizeString(data.role),
      jobType: data.jobType,
      expectedSalaryMinLpa: minLpa,
      expectedSalaryMaxLpa: maxLpa,
      availability: data.availability,
      avatar: data.avatar ? data.avatar : '',
      languages: processArray(data.languages, 2, 30),
      skills: processArray(data.skills, 2, 30),
      prefLocations: sLocations,
      linkedin: sLinkedin,
      github: sGithub
    };

    // Upsert into "admin" key namespace
    const saved = await Profile.findOneAndUpdate(
      { key: 'admin' },
      updateDoc,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json(saved);

  } catch (err) {
    console.error('[Profile] updateAdminProfile Error:', err);
    return res.status(500).json({ message: 'Server Error updating profile' });
  }
};

module.exports = {
  getProfile,
  updateAdminProfile
};
