const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// @desc  Submit contact form
// @route POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.', contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc  Get all contact messages (Admin)
// @route GET /api/contact
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    const query = {};
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const total = await Contact.countDocuments(query);
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ success: true, total, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc  Mark message as read (Admin)
// @route PUT /api/contact/:id/read
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Marked as read', contact: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc  Delete contact message (Admin)
// @route DELETE /api/contact/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;