// controllers/serviceController.js — Services CRUD operations
const Service = require('../models/Service');

// ─── @route   GET /api/services ─────────────────────────────────────────────
// ─── @access  Public
const getAllServices = async (req, res, next) => {
  try {
    const { location, active } = req.query;
    const filter = {};

    if (location) filter.location = location;
    if (active !== undefined) filter.isActive = active === 'true';

    const services = await Service.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/services/:id ─────────────────────────────────────────
// ─── @access  Public
const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('createdBy', 'name email');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/services ────────────────────────────────────────────
// ─── @access  Admin + FullAdmin
const createService = async (req, res, next) => {
  try {
    const { title, description, location, icon } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const service = await Service.create({
      title,
      description,
      location: location || 'services',
      icon: icon || 'zap',
      createdBy: req.user._id,
    });

    await service.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/services/:id ─────────────────────────────────────────
// ─── @access  Admin + FullAdmin
const updateService = async (req, res, next) => {
  try {
    const { title, description, location, icon, isActive } = req.body;

    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    // Update only provided fields
    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (location !== undefined) service.location = location;
    if (icon !== undefined) service.icon = icon;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();
    await service.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/services/:id ──────────────────────────────────────
// ─── @access  FullAdmin only
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    await service.deleteOne();

    res.status(200).json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllServices, getService, createService, updateService, deleteService };
