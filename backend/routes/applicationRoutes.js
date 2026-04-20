const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationsByCompany
} = require('../controllers/applicationController');

router.route('/')
  .get(getAllApplications)
  .post(createApplication);

router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

router.route('/company/:companyId')
  .get(getApplicationsByCompany);

module.exports = router;
