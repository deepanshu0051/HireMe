const AppSetting = require('../models/AppSetting');

/**
 * @desc    Get all public/admin app settings
 * @route   GET /api/settings
 * @access  Private/Admin
 */
const getSettings = async (req, res) => {
  try {
    const settings = await AppSetting.find({});
    
    // Convert array of docs to a key-value object map
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    // If autoSendEnabled hasn't been explicitly configured yet, default to false
    if (typeof settingsMap.autoSendEnabled === 'undefined') {
      settingsMap.autoSendEnabled = false; 
    }
    if (typeof settingsMap.cronStartHour === 'undefined') {
      settingsMap.cronStartHour = 10; 
    }
    if (typeof settingsMap.cronEndHour === 'undefined') {
      settingsMap.cronEndHour = 17; 
    }

    res.status(200).json({ success: true, data: settingsMap });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
  }
};

/**
 * @desc    Update auto-send setting
 * @route   PUT /api/settings/auto-send
 * @access  Private/Admin
 */
const updateAutoSend = async (req, res) => {
  try {
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Enabled must be a boolean' });
    }

    const updatedSetting = await AppSetting.findOneAndUpdate(
      { key: 'autoSendEnabled' },
      { value: enabled },
      { new: true, upsert: true } // upsert creates the row if it doesn't exist yet
    );

    res.status(200).json({ success: true, message: 'Auto-Send setting updated', data: updatedSetting });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update auto-send setting', error: error.message });
  }
};

/**
 * @desc    Update schedule constraints
 * @route   PUT /api/settings/schedule
 * @access  Private/Admin
 */
const updateSchedule = async (req, res) => {
  try {
    const { startHour, endHour } = req.body;
    
    if (typeof startHour !== 'number' || typeof endHour !== 'number') {
      return res.status(400).json({ success: false, message: 'Hours must be numbers' });
    }
    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23 || startHour >= endHour) {
      return res.status(400).json({ success: false, message: 'Invalid start or end hour logic constraints' });
    }

    await AppSetting.findOneAndUpdate({ key: 'cronStartHour' }, { value: startHour }, { upsert: true });
    await AppSetting.findOneAndUpdate({ key: 'cronEndHour' }, { value: endHour }, { upsert: true });

    res.status(200).json({ success: true, message: 'Schedule updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update schedule settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateAutoSend,
  updateSchedule
};
