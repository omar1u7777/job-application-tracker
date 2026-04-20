const express = require('express');
const router = express.Router();
const {
  getApplicationSummary,
  getCompanyStats
} = require('../controllers/statsController');

router.route('/application-summary').get(getApplicationSummary);
router.route('/company-stats').get(getCompanyStats);

module.exports = router;
