// controllers/contactController.js — Leads/Contacts operations
const Contact = require('../models/Contact');

// ─── @route   POST /api/contacts ─────────────────────────────────────────────
// ─── @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, service, budget, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      service,
      budget,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will be in touch!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/contacts ──────────────────────────────────────────────
// ─── @access  Admin + FullAdmin
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/contacts/:id ───────────────────────────────────────
// ─── @access  FullAdmin only
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact inquiry not found.' });
    }

    await contact.deleteOne();

    res.status(200).json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/contacts/:id/status ───────────────────────────────────
// ─── @access  Admin + FullAdmin
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact inquiry not found.' });
    }

    contact.status = status;
    await contact.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}.`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, getContacts, deleteContact, updateStatus };
