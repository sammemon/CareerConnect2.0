const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJob,
  searchJobs,
  getRecommendations,
  applyForJob,
  getJobStats,
  getMyApplications
} = require('../controllers/jobController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllJobs);
router.get('/stats', getJobStats);
router.get('/search', searchJobs);
router.get('/:id', getJob);

// Protected routes (Seeker only)
router.get('/my-applications/list', verifyToken, authorize('seeker'), getMyApplications);
router.get('/recommendations/me', verifyToken, authorize('seeker'), getRecommendations);
router.post('/:id/apply', verifyToken, authorize('seeker'), applyForJob);

module.exports = router;
