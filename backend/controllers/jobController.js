const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'Active',
      type: req.query.type,
      location: req.query.location,
      skills: req.query.skills,
      search: req.query.search,
      limit: req.query.limit,
      // Allow optional employer filter for public listing (used by PublicProfile)
      employer_id: req.query.employer_id
    };

    const jobs = await Job.getAll(filters);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    await Job.incrementViews(req.params.id);

    // Check if user has applied (if authenticated)
    let hasApplied = false;
    if (req.user && req.user.role === 'seeker') {
      hasApplied = await Application.hasApplied(req.user.id, req.params.id);
    }

    res.status(200).json({
      success: true,
      data: { ...job, hasApplied }
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

// @desc    Search jobs
// @route   GET /api/jobs/search
// @access  Public
exports.searchJobs = async (req, res) => {
  try {
    const { q, location, type, skills } = req.query;

    const filters = {
      status: 'Active',
      search: q,
      location,
      type,
      skills
    };

    const jobs = await Job.getAll(filters);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching jobs',
      error: error.message
    });
  }
};

// @desc    Get recommended jobs for seeker
// @route   GET /api/jobs/recommendations
// @access  Private (Seeker)
exports.getRecommendations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const jobs = await Job.getRecommendations(req.user.id, limit);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Seeker)
exports.applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const seekerId = req.user.id;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if already applied
    const hasApplied = await Application.hasApplied(seekerId, jobId);
    if (hasApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    const { resume, cover_letter } = req.body;

    const applicationId = await Application.create({
      job_id: jobId,
      seeker_id: seekerId,
      resume,
      cover_letter
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { id: applicationId }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting application',
      error: error.message
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Public
exports.getJobStats = async (req, res) => {
  try {
    const stats = await Job.getStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job statistics',
      error: error.message
    });
  }
};

// @desc    Get seeker's applications
// @route   GET /api/jobs/my-applications
// @access  Private (Seeker)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.getBySeekerIdWithDetails(req.user.id);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};
