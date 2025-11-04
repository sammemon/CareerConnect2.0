const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobApplications,
  updateApplicationStatus,
  getAllApplications,
  getMyCompanies,
  createCompany,
  updateCompany
} = require('../controllers/employerController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// All routes are protected and employer only
router.use(verifyToken);
router.use(authorize('employer'));

// Dashboard
router.get('/dashboard', getDashboard);

// Jobs
router.get('/jobs', getMyJobs);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/jobs/:id/applications', getJobApplications);

// Applications
router.get('/applications', getAllApplications);
router.put('/applications/:id', updateApplicationStatus);

// Companies
router.get('/companies', getMyCompanies);
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);

module.exports = router;
