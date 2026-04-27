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

router.route('/company/:companyId')
  .get(getApplicationsByCompany);

router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

module.exports = router;
