const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboard = async (req, res) => {
  try {
    const [userStats, jobStats, applicationStats, companyStats] = await Promise.all([
      User.getStats(),
      Job.getStats(),
      Application.getStats(),
      Company.getStats()
    ]);

    // Get recent activities
    const [recentJobs, recentApplications, recentUsers] = await Promise.all([
      Job.getAll({ limit: 5 }),
      Application.getAll({ limit: 5 }),
      User.getAll({ limit: 5 })
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: userStats,
          jobs: jobStats,
          applications: applicationStats,
          companies: companyStats
        },
        recent: {
          jobs: recentJobs,
          applications: recentApplications,
          users: recentUsers
        }
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const filters = {
      role: req.query.role,
      is_active: req.query.is_active
    };

    const users = await User.getAll(filters);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional stats based on role
    let additionalData = {};

    if (user.role === 'seeker') {
      const applications = await Application.getBySeeker(user.id);
      additionalData.applications = applications;
      additionalData.applicationCount = applications.length;
    } else if (user.role === 'employer') {
      const jobs = await Job.getByEmployer(user.id);
      const companies = await Company.findByEmployer(user.id);
      additionalData.jobs = jobs;
      additionalData.companies = companies;
      additionalData.jobCount = jobs.length;
    }

    res.status(200).json({
      success: true,
      data: {
        ...user,
        ...additionalData
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deactivating themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.toggleActiveStatus(userId);

    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: `User ${updatedUser.is_active ? 'activated' : 'deactivated'} successfully`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling user status',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.delete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Get all jobs (admin view)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getAllJobs = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      type: req.query.type,
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

// @desc    Approve/Reject job posting
// @route   PUT /api/admin/jobs/:id/status
// @access  Private (Admin)
exports.updateJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const validStatuses = ['Active', 'Closed', 'Pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await Job.update(jobId, { status });

    const updatedJob = await Job.findById(jobId);

    res.status(200).json({
      success: true,
      message: `Job ${status.toLowerCase()} successfully`,
      data: updatedJob
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job status',
      error: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await Job.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private (Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      seeker_id: req.query.seeker_id,
      job_id: req.query.job_id
    };

    const applications = await Application.getAll(filters);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private (Admin)
exports.getAllCompanies = async (req, res) => {
  try {
    const filters = {
      industry: req.query.industry,
      search: req.query.search
    };

    const companies = await Company.getAll(filters);

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message
    });
  }
};

// @desc    Delete company
// @route   DELETE /api/admin/companies/:id
// @access  Private (Admin)
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    await Company.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting company',
      error: error.message
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
  try {
    // Get top companies by job postings
    const topCompanies = await Company.getTopCompanies(10);

    // Get overall stats
    const [userStats, jobStats, applicationStats] = await Promise.all([
      User.getStats(),
      Job.getStats(),
      Application.getStats()
    ]);

    res.status(200).json({
      success: true,
      data: {
        topCompanies,
        overview: {
          users: userStats,
          jobs: jobStats,
          applications: applicationStats
        }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};
