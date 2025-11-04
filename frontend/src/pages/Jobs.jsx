import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaFilter, FaTimes, FaDollarSign, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CATEGORY_MAP = {
  'web-development': ['web', 'web development', 'web developer', 'frontend', 'backend', 'full stack'],
  'frontend': ['frontend', 'react', 'angular', 'vue', 'ui', 'css', 'html'],
  'backend': ['backend', 'node', 'express', 'django', 'spring', 'api', 'server'],
  'fullstack': ['full stack', 'fullstack', 'frontend', 'backend'],
  'mobile': ['mobile', 'android', 'ios', 'react native', 'flutter'],
  'database-admin': ['database', 'sql', 'mysql', 'postgres', 'mongodb', 'db admin'],
  'devops': ['devops', 'ci/cd', 'jenkins', 'docker', 'kubernetes', 'cloud'],
  'cloud': ['cloud', 'aws', 'azure', 'gcp', 'cloud engineer'],
  'system-admin': ['system', 'linux', 'windows', 'server', 'admin'],
  'network': ['network', 'cisco', 'routing', 'switching', 'network engineer'],
  'ai-ml': ['ai', 'ml', 'machine learning', 'artificial intelligence', 'deep learning'],
  'data-science': ['data', 'data science', 'python', 'analytics', 'big data'],
  'software-engineering': ['software', 'engineer', 'developer', 'programming'],
  'game-development': ['game', 'unity', 'unreal', 'gaming', 'game dev'],
  'graphic-design': ['graphic', 'design', 'photoshop', 'illustrator', 'designer'],
  'ui-ux': ['ui', 'ux', 'user interface', 'user experience', 'design'],
  'digital-marketing': ['digital marketing', 'seo', 'sem', 'ppc', 'marketing'],
  'sales': ['sales', 'business development', 'account', 'revenue'],
  'content-writing': ['content', 'writer', 'copywriting', 'blog', 'article'],
  'seo': ['seo', 'search engine', 'optimization', 'google'],
  'social-media': ['social media', 'facebook', 'instagram', 'linkedin', 'twitter'],
  'business-development': ['business development', 'bd', 'partnerships', 'growth'],
  'management': ['manager', 'management', 'lead', 'project', 'product'],
  'hr': ['hr', 'human resources', 'recruitment', 'talent'],
  'finance': ['finance', 'accounting', 'accounts', 'money', 'payroll'],
  'banking': ['banking', 'bank', 'financial', 'investment'],
  'accounting': ['accounting', 'accountant', 'bookkeeping', 'audit'],
  'operations': ['operations', 'logistics', 'supply chain', 'ops'],
  'mbbs': ['mbbs', 'doctor', 'physician', 'medical'],
  'bds': ['bds', 'dentist', 'dental', 'orthodontist'],
  'pharmacy': ['pharmacy', 'pharmacist', 'pharmaceutical', 'drugs'],
  'nursing': ['nursing', 'nurse', 'healthcare', 'patient care'],
  'medical-lab': ['medical lab', 'laboratory', 'pathology', 'lab technician'],
  'physiotherapy': ['physiotherapy', 'physiotherapist', 'physical therapy', 'rehabilitation'],
  'radiology': ['radiology', 'radiologist', 'x-ray', 'imaging'],
};

const Jobs = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const typeFromUrl = searchParams.get('type'); // Get type from URL query params
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: typeFromUrl || '',
  });

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [categoryId, typeFromUrl]);

  useEffect(() => {
    // Update filters when typeFromUrl changes
    if (typeFromUrl) {
      setFilters(prev => ({ ...prev, type: typeFromUrl }));
    }
  }, [typeFromUrl]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs', { params: filters });
      let jobsData = response.data.data;
      
      // Filter by category if provided
      if (categoryId && categoryId !== 'all') {
        const keywords = CATEGORY_MAP[categoryId] || [categoryId];
        jobsData = jobsData.filter(job => {
          const title = job.title?.toLowerCase() || '';
          const desc = job.description?.toLowerCase() || '';
          const skills = job.skills?.toLowerCase() || '';
          return keywords.some(kw => title.includes(kw) || desc.includes(kw) || skills.includes(kw));
        });
      }
      
      // Filter by type (Internship) if provided from URL
      if (typeFromUrl) {
        jobsData = jobsData.filter(job => job.type === typeFromUrl);
      }
      
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(false);
    setError('');
    setSuccess('');
  };

  const handleApply = () => {
    if (!user) {
      setError('Please login to apply for jobs');
      return;
    }
    if (user.role !== 'seeker') {
      setError('Only job seekers can apply for jobs');
      return;
    }
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/jobs/${selectedJob.id}/apply`, {
        cover_letter: applicationData.coverLetter,
        resume: applicationData.resume?.name || '',
      });

      setSuccess('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationData({ coverLetter: '', resume: null });
      setTimeout(() => {
        setSelectedJob(null);
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        return;
      }
      setApplicationData({ ...applicationData, resume: file });
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
    setShowApplicationForm(false);
    setApplicationData({ coverLetter: '', resume: null });
    setError('');
    setSuccess('');
  };

  const getJobTypeBadge = (type) => {
    const badges = {
      'Full-time': 'badge-success',
      'Part-time': 'badge-info',
      'Internship': 'badge-warning',
      'Remote': 'badge-info',
      'Contract': 'badge-warning',
    };
    return badges[type] || 'badge-info';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
            alt="Jobs background"
            className="w-full h-full object-cover object-center opacity-70 dark:opacity-40"
          />
          {/* Overlay: lighter for light mode, deeper for dark mode */}
          <div className="absolute inset-0 bg-white/60 dark:bg-black/80 mix-blend-multiply"></div>
        </div>
  <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-primary-200 mb-4 drop-shadow-lg tracking-tight">
            <span className="bg-gradient-to-r from-primary-400 via-primary-600 to-accent-400 bg-clip-text text-transparent dark:text-primary-200">Browse Jobs</span>
          </h1>
          <p className="text-lg text-neutral-800 dark:text-primary-300 font-light max-w-2xl mx-auto drop-shadow">Explore thousands of opportunities and find your perfect match.</p>
        </div>

        {/* Search and Filters */}
  <div className="glass-card mb-8 shadow-2xl border border-neutral-200/40 dark:border-neutral-700/40 bg-white/80 dark:bg-neutral-800/80">
          <form onSubmit={handleSearch}>
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Job title, keywords..."
                      className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 pl-10"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      placeholder="Location"
                      className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 pl-10"
                    />
                  </div>
                </div>
                <div>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <button onClick={fetchJobs} className="btn-primary w-full md:w-auto mt-4">
                <FaFilter className="inline mr-2" />
                Apply Filters
              </button>
            </>
          </form>
        </div>

        {/* Job Listings */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {jobs.length === 0 ? (
            <div className="glass-card text-center py-12 shadow-xl border border-neutral-200/40 dark:border-neutral-700/40 bg-white/80 dark:bg-neutral-800/80">
              <p className="text-neutral-800 dark:text-primary-200 text-lg">No jobs found matching your criteria</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="glass-card hover:shadow-2xl transition-shadow border border-neutral-200/40 dark:border-neutral-700/40 p-6 flex flex-col justify-between bg-white/80 dark:bg-neutral-800/80">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center cursor-pointer border-2 border-primary-400 dark:border-primary-700 shadow-lg"
                    onClick={() => {
                      const profile = {
                        name: job.company_name || job.employer_name,
                        title: 'Employer',
                        description: job.company_description || job.description || '',
                        linkedin: job.company_linkedin || job.linkedin || '',
                        facebook: job.company_facebook || job.facebook || '',
                        github: job.company_github || job.github || '',
                        twitter: job.company_twitter || job.twitter || '',
                        website: job.company_website || job.website || '',
                        avatar: job.company_logo || '',
                        employerId: job.employer_id,
                        companyId: job.company_id,
                      };
                      navigate('/profile-view', { state: { profile } });
                    }}
                  >
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-500 text-2xl font-bold">{(job.company_name || 'C')?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-primary-200 mb-1 drop-shadow">
                      {job.title}
                    </h3>
                    <button
                      className="text-left text-primary-600 dark:text-primary-400 hover:underline text-lg font-medium"
                      onClick={() => {
                        const profile = {
                          name: job.company_name || job.employer_name,
                          title: 'Employer',
                          description: job.company_description || job.description || '',
                          linkedin: job.company_linkedin || job.linkedin || '',
                          facebook: job.company_facebook || job.facebook || '',
                          github: job.company_github || job.github || '',
                          twitter: job.company_twitter || job.twitter || '',
                          website: job.company_website || job.website || '',
                          avatar: job.company_logo || '',
                          employerId: job.employer_id,
                          companyId: job.company_id,
                        };
                        navigate('/profile-view', { state: { profile } });
                      }}
                    >
                      {job.company_name || job.employer_name}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <span className={`badge ${getJobTypeBadge(job.type)}`}>{job.type}</span>
                  <span className="flex items-center text-primary-600 dark:text-primary-400 text-sm">
                    <FaMapMarkerAlt className="mr-1" />
                    {job.location}
                  </span>
                  <span className="flex items-center text-primary-600 dark:text-primary-400 text-sm">
                    <FaBriefcase className="mr-1" />
                    {job.experience_level}
                  </span>
                </div>
                <p className="text-neutral-800 dark:text-primary-200 mb-3 line-clamp-2">
                  {job.description}
                </p>
                {job.skills && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.split(',').slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm border border-primary-200 dark:border-primary-800"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {job.salary && (
                  <p className="text-green-600 dark:text-green-400 font-semibold mb-3">
                    💰 {job.salary}
                  </p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleViewDetails(job)}
                    className="btn-primary inline-block"
                  >
                    View Details
                  </button>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    {job.application_count || 0} applications
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div 
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl max-w-2xl w-full my-8 relative max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl z-10 bg-gray-100/80 dark:bg-gray-700/80 rounded-full p-2 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all"
            >
              <FaTimes />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              {/* Header */}
              <div className="border-b border-gray-200/70 dark:border-gray-700/70 pb-5 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 pr-8">
                  {selectedJob.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
                  <span className="flex items-center gap-1.5">
                    <FaBriefcase className="text-primary-500" /> {selectedJob.company_name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-primary-500" /> {selectedJob.location}
                  </span>
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <FaDollarSign className="text-green-500 text-lg" />
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Salary</span>
                    <span className="font-semibold text-sm">{selectedJob.salary}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <FaBriefcase className="text-blue-500 text-lg" />
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Type</span>
                    <span className="font-semibold text-sm">{selectedJob.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <FaUsers className="text-purple-500 text-lg" />
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Experience</span>
                    <span className="font-semibold text-sm">{selectedJob.experience_level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <FaCalendarAlt className="text-orange-500 text-lg" />
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Deadline</span>
                    <span className="font-semibold text-sm">{new Date(selectedJob.application_deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                {selectedJob.vacancies && (
                  <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-700/30 p-3 rounded-lg col-span-2">
                    <FaUsers className="text-indigo-500 text-lg" />
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Vacancies</span>
                      <span className="font-semibold text-sm">{selectedJob.vacancies} positions available</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary-500 rounded-full"></span>
                  Job Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              {selectedJob.requirements && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary-500 rounded-full"></span>
                    Requirements
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{selectedJob.requirements}</p>
                </div>
              )}

              {/* Responsibilities */}
              {selectedJob.responsibilities && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary-500 rounded-full"></span>
                    Responsibilities
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{selectedJob.responsibilities}</p>
                </div>
              )}

              {/* Skills */}
              {selectedJob.skills && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary-500 rounded-full"></span>
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.split(',').map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium border border-primary-200 dark:border-primary-800">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {user?.role === 'seeker' && (
                  <button
                    onClick={handleApply}
                    className="btn-primary flex-1 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Apply Now
                  </button>
                )}
              </div>

              {!user && (
                <div className="bg-yellow-50/80 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 p-4 rounded-xl text-center border border-yellow-200 dark:border-yellow-800">
                  Please <Link to="/login" className="underline font-semibold hover:text-yellow-900 dark:hover:text-yellow-200">login</Link> as a job seeker to apply for this position.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setShowApplicationForm(false)}
        >
          <div 
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl max-w-lg w-full relative shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowApplicationForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl z-10 bg-gray-100/80 dark:bg-gray-700/80 rounded-full p-2 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all"
            >
              <FaTimes />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Apply for Position</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{selectedJob.title} at {selectedJob.company_name}</p>
              
              {error && (
                <div className="bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-4 border border-red-200 dark:border-red-800 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50/80 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl mb-4 border border-green-200 dark:border-green-800 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmitApplication} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, coverLetter: e.target.value })
                    }
                    className="input-field min-h-[140px] text-sm"
                    placeholder="Tell us why you're a great fit for this position..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Resume/CV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="input-field text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PDF, DOC, DOCX • Max 5MB
                  </p>
                  {applicationData.resume && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                      <FaCheckCircle /> {applicationData.resume.name}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 py-3 font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="btn-secondary flex-1 py-3 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
