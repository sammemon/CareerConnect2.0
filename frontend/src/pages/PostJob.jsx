import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaUsers, FaQuestionCircle, FaPlus, FaTrash } from 'react-icons/fa';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    salary: '',
    location: '',
    type: 'Full-time',
    experience_level: 'Entry Level',
    vacancies: 1,
    application_deadline: '',
  });
  const [screeningQuestions, setScreeningQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Screening Questions Management
  const addQuestion = () => {
    setScreeningQuestions([
      ...screeningQuestions,
      { question: '', is_required: true, id: Date.now() }
    ]);
  };

  const removeQuestion = (id) => {
    setScreeningQuestions(screeningQuestions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setScreeningQuestions(screeningQuestions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare data with screening questions
      const jobData = {
        ...formData,
        screening_questions: screeningQuestions.map(({ id, ...q }) => q) // Remove temporary id
      };
      
      await api.post('/employer/jobs', jobData);
      setSuccess('Job posted successfully and is now live on Browse Jobs!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Post a New Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Create a professional job posting to attract top talent
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <span className="text-xl mr-3">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <span className="text-xl mr-3">✅</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <FaBriefcase className="text-white text-2xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Basic Information</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Essential job details</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <FaBriefcase className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
              </div>

              {/* Job Type and Experience Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Location and Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <FaMapMarkerAlt className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Salary Range
                  </label>
                  <div className="relative group">
                    <FaDollarSign className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g. $80,000 - $120,000"
                    />
                  </div>
                </div>
              </div>

              {/* Vacancies and Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Number of Vacancies
                  </label>
                  <div className="relative group">
                    <FaUsers className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="number"
                      name="vacancies"
                      value={formData.vacancies}
                      onChange={handleChange}
                      min="1"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="application_deadline"
                    value={formData.application_deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g. JavaScript, React, Node.js, MongoDB"
                />
              </div>
            </div>
          </div>

          {/* Job Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <FaBriefcase className="text-white text-2xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Job Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive job information</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Describe the job role, company culture, and what makes this opportunity unique..."
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="List the qualifications, education, and experience required..."
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Describe the day-to-day responsibilities and expectations..."
                />
              </div>
            </div>
          </div>

          {/* Screening Questions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                  <FaQuestionCircle className="text-white text-2xl" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Screening Questions</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Custom questions for applicants (Optional)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaPlus /> Add Question
              </button>
            </div>

            {screeningQuestions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <FaQuestionCircle className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No screening questions added yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Add custom questions to filter candidates effectively</p>
              </div>
            ) : (
              <div className="space-y-4">
                {screeningQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          placeholder="Enter your question here..."
                          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-500 rounded-lg focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900 focus:border-green-500 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={question.is_required}
                              onChange={(e) => updateQuestion(question.id, 'is_required', e.target.checked)}
                              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                              Required question
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeQuestion(question.id)}
                            className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
                          >
                            <FaTrash className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>💡 Tip:</strong> Add specific questions about skills, experience, or availability to help you identify the best candidates quickly.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Posting Job...
                </span>
              ) : (
                'Post Job'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
