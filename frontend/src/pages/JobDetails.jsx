import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaDollarSign,
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
} from 'react-icons/fa';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
    screeningAnswers: {},
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login');
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
      // Validate required screening questions
      if (job.screening_questions && job.screening_questions.length > 0) {
        const requiredQuestions = job.screening_questions.filter(q => q.is_required);
        for (const question of requiredQuestions) {
          if (!applicationData.screeningAnswers[question.id] || !applicationData.screeningAnswers[question.id].trim()) {
            setError('Please answer all required screening questions');
            setSubmitting(false);
            return;
          }
        }
      }

      // Prepare screening answers array
      const screening_answers = job.screening_questions?.map(q => ({
        question_id: q.id,
        answer: applicationData.screeningAnswers[q.id] || ''
      })).filter(a => a.answer.trim()) || [];

      const formData = new FormData();
      formData.append('coverLetter', applicationData.coverLetter);
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
      }

      await api.post(`/jobs/${id}/apply`, {
        cover_letter: applicationData.coverLetter,
        resume: applicationData.resume?.name || '',
        screening_answers: screening_answers,
      });

      setSuccess('Application submitted successfully!');
      setShowApplicationForm(false);
      setTimeout(() => {
        navigate('/dashboard');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <button onClick={() => navigate('/jobs')} className="btn-primary">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 transition-colors">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="mb-6 text-primary-600 hover:text-primary-700 flex items-center"
        >
          ← Back to Jobs
        </button>

        {/* Job Header */}
        <div className="card mb-6 bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{job.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center cursor-pointer"
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
                    <img src={job.company_logo} alt={job.company_name || job.employer_name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-neutral-500 text-sm">
                      {(job.company_name || job.employer_name || 'C')?.charAt(0)}
                    </span>
                  )}
                </div>
                <button
                  className="text-xl text-neutral-700 dark:text-neutral-300 hover:text-primary-600"
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
              <div className="flex flex-wrap gap-4 text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  {job.location}
                </span>
                <span className="flex items-center">
                  <FaBriefcase className="mr-2" />
                  {job.type}
                </span>
                <span className="flex items-center">
                  <FaClock className="mr-2" />
                  {job.experience_level}
                </span>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line mb-4">{job.description}</p>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">About Employer</h2>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <span className="text-neutral-500">{job.company_name?.charAt(0) || 'E'}</span>
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">How to Apply</h2>
            </div>
            <div className="text-right">
              {job.salary && (
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  <FaDollarSign className="inline" />
                  {job.salary}
                </p>
              )}
              {user && user.role === 'seeker' && (
                <button
                  onClick={handleApply}
                  className="btn-primary"
                  disabled={showApplicationForm}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Job Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center text-neutral-700 dark:text-neutral-300">
              <FaUsers className="mr-3 text-primary-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Vacancies</p>
                <p className="font-semibold">{job.vacancies || 1} Position(s)</p>
              </div>
            </div>
            <div className="flex items-center text-neutral-700 dark:text-neutral-300">
              <FaCalendarAlt className="mr-3 text-primary-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-semibold">
                  {job.application_deadline
                    ? new Date(job.application_deadline).toLocaleDateString()
                    : 'Not specified'}
                </p>
              </div>
            </div>
            <div className="flex items-center text-neutral-700 dark:text-neutral-300">
              <FaCheckCircle className="mr-3 text-primary-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold">
                  <span
                    className={`badge ${
                      job.status === 'Active' ? 'badge-success' : 'badge-warning'
                    }`}
                  >
                    {job.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Application Form */}
        {showApplicationForm && (
          <div className="card mb-6 bg-blue-50 dark:bg-blue-900 border-2 border-primary-500 dark:border-primary-700">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Submit Your Application</h2>
            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) =>
                    setApplicationData({ ...applicationData, coverLetter: e.target.value })
                  }
                  className="input-field"
                  rows="6"
                  placeholder="Tell us why you're a great fit for this position..."
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-2">
                  Resume/CV (PDF, DOC, DOCX - Max 5MB)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="input-field"
                />
                {applicationData.resume && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                    Selected: {applicationData.resume.name}
                  </p>
                )}
              </div>

              {/* Screening Questions Section */}
              {job.screening_questions && job.screening_questions.length > 0 && (
                <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-6 mt-6">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-primary-600" />
                    Screening Questions
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Please answer the following questions to help the employer evaluate your application.
                  </p>
                  <div className="space-y-5">
                    {job.screening_questions.map((question, index) => (
                      <div key={question.id} className="bg-white dark:bg-neutral-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                        <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-2">
                          {index + 1}. {question.question}
                          {question.is_required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                          value={applicationData.screeningAnswers[question.id] || ''}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              screeningAnswers: {
                                ...applicationData.screeningAnswers,
                                [question.id]: e.target.value,
                              },
                            })
                          }
                          className="input-field w-full"
                          rows="3"
                          placeholder="Type your answer here..."
                          required={question.is_required}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Job Description</h2>
              <div className="prose max-w-none text-neutral-700 dark:text-neutral-300">
                {job.description?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="card bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Requirements</h2>
                <div className="prose max-w-none text-neutral-700 dark:text-neutral-300">
                  {job.requirements.split('\n').map((req, index) => (
                    <p key={index} className="mb-2">
                      • {req}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="card bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Responsibilities</h2>
                <div className="prose max-w-none text-neutral-700 dark:text-neutral-300">
                  {job.responsibilities.split('\n').map((resp, index) => (
                    <p key={index} className="mb-2">
                      • {resp}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Skills */}
            {job.skills && (
              <div className="card mb-6 bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info */}
            <div className="card bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">About Company</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">{job.company_name || job.employer_name}</p>
              {job.company_description && (
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">{job.company_description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
