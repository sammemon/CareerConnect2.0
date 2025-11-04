const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

// @desc    Get employer dashboard stats
// @route   GET /api/employer/dashboard
// @access  Private (Employer)
exports.getDashboard = async (req, res) => {
  try {
    const employerId = req.user.id;

    const [jobStats, applicationStats] = await Promise.all([
      Job.getStats(employerId),
      Application.getStats(employerId, 'employer')
    ]);

    const recentApplications = await Application.getAll({
      employer_id: employerId,
      limit: 5
    });

    res.status(200).json({
      success: true,
      data: {
        jobStats,
        applicationStats,
        recentApplications
      }
    });
  } catch (error) {
    console.error('Get employer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// @desc    Get all jobs posted by employer
// @route   GET /api/employer/jobs
// @access  Private (Employer)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.getByEmployer(req.user.id);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// @desc    Create new job posting
// @route   POST /api/employer/jobs
// @access  Private (Employer)
exports.createJob = async (req, res) => {
  try {
    const {
      company_id,
      title,
      description,
      requirements,
      responsibilities,
      skills,
      salary,
      location,
      type,
      experience_level,
      vacancies,
      application_deadline
    } = req.body;

    // Validation
    if (!title || !description || !location || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, location, and type'
      });
    }

    const jobData = {
      employer_id: req.user.id,
      company_id,
      title,
      description,
      requirements,
      responsibilities,
      skills,
      salary,
      location,
      type,
      experience_level,
      vacancies: vacancies || 1,
      application_deadline,
      status: 'Active' // Auto-approve jobs instead of pending
    };

    const jobId = await Job.create(jobData);

    const job = await Job.findById(jobId);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully and is now live!',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

// @desc    Update job posting
// @route   PUT /api/employer/jobs/:id
// @access  Private (Employer)
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check if job exists and belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const allowedFields = [
      'title', 'description', 'requirements', 'responsibilities',
      'skills', 'salary', 'location', 'type', 'experience_level',
      'vacancies', 'application_deadline', 'status'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const updated = await Job.update(jobId, updateData);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update job'
      });
    }

    const updatedJob = await Job.findById(jobId);

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

// @desc    Delete job posting
// @route   DELETE /api/employer/jobs/:id
// @access  Private (Employer)
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check if job exists and belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.delete(jobId);

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

// @desc    Get applications for a specific job
// @route   GET /api/employer/jobs/:id/applications
// @access  Private (Employer)
exports.getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check if job belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications'
      });
    }

    const applications = await Application.getByJob(jobId);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// @desc    Update application status
// @route   PUT /api/employer/applications/:id
// @access  Private (Employer)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const validStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Check if application exists and belongs to employer's job
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify ownership through job
    const job = await Job.findById(application.job_id);
    if (job.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    await Application.updateStatus(applicationId, status, notes);

    const updatedApplication = await Application.findById(applicationId);

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
};

// @desc    Get all applications for employer's jobs
// @route   GET /api/employer/applications
// @access  Private (Employer)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.getAll({
      employer_id: req.user.id,
      status: req.query.status
    });

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

// @desc    Get employer companies
// @route   GET /api/employer/companies
// @access  Private (Employer)
exports.getMyCompanies = async (req, res) => {
  try {
    const companies = await Company.findByEmployer(req.user.id);

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('Get my companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message
    });
  }
};

// @desc    Create company
// @route   POST /api/employer/companies
// @access  Private (Employer)
exports.createCompany = async (req, res) => {
  try {
    const { name, description, industry, website, location, company_size, logo } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company name'
      });
    }

    const companyId = await Company.create({
      employer_id: req.user.id,
      name,
      description,
      industry,
      website,
      location,
      company_size,
      logo
    });

    const company = await Company.findById(companyId);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating company',
      error: error.message
    });
  }
};

// @desc    Update company
// @route   PUT /api/employer/companies/:id
// @access  Private (Employer)
exports.updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    // Check if company exists and belongs to employer
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this company'
      });
    }

    const allowedFields = ['name', 'description', 'industry', 'website', 'location', 'company_size', 'logo'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    await Company.update(companyId, updateData);
    const updatedCompany = await Company.findById(companyId);

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating company',
      error: error.message
    });
  }
};
 