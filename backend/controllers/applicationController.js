const Application = require('../models/Application');
const Company = require('../models/Company');
const mongoose = require('mongoose');

const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const applications = await Application.find(filter).populate('companyId', 'name location');
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('companyId', 'name location industry website');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createApplication = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.companyId)) {
      return res.status(400).json({ success: false, message: 'Invalid companyId format' });
    }
    const company = await Company.findById(req.body.companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const application = await Application.create(req.body);
    await application.populate('companyId', 'name location');
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    if (req.body.companyId && !mongoose.Types.ObjectId.isValid(req.body.companyId)) {
      return res.status(400).json({ success: false, message: 'Invalid companyId format' });
    }

    const application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('companyId', 'name location');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApplicationsByCompany = async (req, res) => {
  try {
    const applications = await Application.find({ companyId: req.params.companyId }).populate('companyId', 'name location');
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationsByCompany
};
