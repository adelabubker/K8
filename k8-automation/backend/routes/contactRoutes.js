// routes/contactRoutes.js — Contacts/Leads routes
const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  deleteContact,
  updateStatus,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Public route for form submission
router.post('/', submitContact);

// Protected routes (Admin access)
router.get('/', protect, authorize('admin', 'fullAdmin'), getContacts);
router.put('/:id/status', protect, authorize('admin', 'fullAdmin'), updateStatus);

// Full Admin only
router.delete('/:id', protect, authorize('fullAdmin'), deleteContact);

module.exports = router;
