const express = require('express');
const { getCompanies, getCompany, addExperience } = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.get('/', protect, getCompanies);
router.get('/:name', protect, getCompany);
router.post('/:name/experience', protect, addExperience);

module.exports = router;
