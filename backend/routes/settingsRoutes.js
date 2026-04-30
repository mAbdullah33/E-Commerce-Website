const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all active settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find().lean();
    // Transform to simple key-value object
    const config = {};
    settings.forEach(s => config[s.key] = s.value);
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Batch update settings
// @route   PUT /api/settings
// @access  Admin
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const { config } = req.body;
    
    const updates = Object.keys(config).map(async (key) => {
      return Settings.findOneAndUpdate(
        { key },
        { value: config[key] },
        { upsert: true, new: true }
      );
    });

    await Promise.all(updates);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
