const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getAllUsers,
  getUser,
  toggleUserStatus,
  deleteUser,
  getAllJobs,
  updateJobStatus,
  deleteJob,
  getAllApplications,
  getAllCompanies,
  deleteCompany,
  getAnalytics
} = require('../controllers/adminController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// All routes are protected and admin only
router.use(verifyToken);
router.use(authorize('admin'));

// Dashboard & Analytics
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Job Management
router.get('/jobs', getAllJobs);
router.put('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJob);

// Application Management
router.get('/applications', getAllApplications);

// Company Management
router.get('/companies', getAllCompanies);
router.delete('/companies/:id', deleteCompany);

module.exports = router;
