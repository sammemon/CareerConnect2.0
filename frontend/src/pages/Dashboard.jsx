import React, { useEffect, useState, Suspense, lazy, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FaBriefcase, FaFileAlt, FaCheckCircle, FaClock, FaUserCircle } from 'react-icons/fa';

const Profile = lazy(() => import('./Profile'));

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const previousLocation = useRef(location.pathname);

  // Switch tab based on hash whenever it changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#profile') {
        setActiveTab('profile');
      } else {
        setActiveTab('dashboard');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // run on mount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh data when returning to dashboard from another page
  useEffect(() => {
    if (previousLocation.current !== location.pathname) {
      previousLocation.current = location.pathname;
      if (activeTab === 'dashboard') {
        fetchDashboardData();
      }
    }
  }, [location.pathname, activeTab]);

  useEffect(() => {
    // Fetch data when component mounts or when activeTab is 'dashboard'
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeTab]); // Re-fetch when returning to dashboard tab

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'admin') {
        const response = await api.get('/admin/dashboard');
          console.log('Admin Dashboard Data:', response.data.data);
        setData(response.data.data);
      } else if (user?.role === 'employer') {
        const response = await api.get('/employer/dashboard');
          console.log('Employer Dashboard Data:', response.data.data);
        setData(response.data.data);
      } else if (user?.role === 'seeker') {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          api.get('/jobs'),
          api.get('/jobs/my-applications/list').catch(() => ({ data: { data: [] } })),
        ]);
          console.log('Seeker Dashboard Data:', { jobs: jobsResponse.data.data, applications: applicationsResponse.data.data });
        setData({ jobs: jobsResponse.data.data, applications: applicationsResponse.data.data || [] });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 transition-colors">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {user?.role === 'admin' && 'Admin Dashboard'}
            {user?.role === 'employer' && 'Employer Dashboard'}
            {user?.role === 'seeker' && 'Job Seeker Dashboard'}
          </h1>
          {user?.name && (
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Welcome back, {user.name}</p>
          )}
        </div>

        {/* Tabs */}
  <div className="flex space-x-4 mb-8">
          <button
            className={`btn-primary ${activeTab === 'dashboard' ? 'bg-primary-700' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          {user?.role !== 'seeker' && (
            <button
              className={`btn-primary ${activeTab === 'jobs' ? 'bg-primary-700' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Jobs
            </button>
          )}
          {user?.role !== 'seeker' && (
            <button
              className={`btn-primary ${activeTab === 'applications' ? 'bg-primary-700' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              Applications
            </button>
          )}
          <button
            className={`btn-primary ${activeTab === 'profile' ? 'bg-primary-700' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Refresh Button */}
            <div className="mb-4 flex justify-end">
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2"
              >
                <span>🔄</span> Refresh
              </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="gradient-card card bg-white/80 dark:bg-neutral-800/80">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-accent-100 text-sm">
                      {user?.role === 'seeker' ? 'Available Jobs' : 'Total Jobs'}
                    </p>
                    <h3 className="text-3xl font-bold mt-2">
                      {data?.jobStats?.total_jobs || (data?.jobs?.length || 0)}
                    </h3>
                  </div>
                  <FaBriefcase className="text-4xl text-accent-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white bg-white/80 dark:bg-neutral-800/80">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-100 text-sm">
                      {user?.role === 'seeker' ? 'Applications' : 'Active Jobs'}
                    </p>
                    <h3 className="text-3xl font-bold mt-2">
                      {user?.role === 'seeker'
                        ? (data?.applications?.length || 0)
                        : (data?.jobStats?.active_jobs || 0)}
                    </h3>
                  </div>
                  <FaCheckCircle className="text-4xl text-green-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white bg-white/80 dark:bg-neutral-800/80">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-yellow-100 text-sm">
                      {user?.role === 'seeker' ? 'Pending' : 'Pending Approval'}
                    </p>
                    <h3 className="text-3xl font-bold mt-2">
                      {user?.role === 'seeker'
                        ? (data?.applications?.filter((a) => a.status === 'Pending').length || 0)
                        : (data?.jobStats?.pending_jobs || 0)}
                    </h3>
                  </div>
                  <FaClock className="text-4xl text-yellow-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white bg-white/80 dark:bg-neutral-800/80">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-100 text-sm">
                      {user?.role === 'seeker' ? 'Accepted' : 'Total Applications'}
                    </p>
                    <h3 className="text-3xl font-bold mt-2">
                      {user?.role === 'seeker'
                        ? (data?.applications?.filter((a) => a.status === 'Accepted').length || 0)
                        : (data?.applicationStats?.total_applications || 0)}
                    </h3>
                  </div>
                  <FaFileAlt className="text-4xl text-purple-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {user?.role === 'employer' && (
                <Link to="/post-job" className="card bg-white/80 dark:bg-neutral-800/80 hover:shadow-lg transition-shadow text-center">
                  <FaBriefcase className="text-4xl text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Post New Job</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Create a new job posting</p>
                </Link>
              )}

              <Link to="/jobs" className="card bg-white/80 dark:bg-neutral-800/80 hover:shadow-lg transition-shadow text-center">
                <FaFileAlt className="text-4xl text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Browse Jobs</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">View all job opportunities</p>
              </Link>

              {user?.role !== 'seeker' && (
                <Link to="/employer/applications" className="card bg-white/80 dark:bg-neutral-800/80 hover:shadow-lg transition-shadow text-center">
                  <FaCheckCircle className="text-4xl text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Applications</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Review job applications</p>
                </Link>
              )}
            </div>

            {/* My Applications */}
            {user?.role === 'seeker' && data?.applications && (
              <div className="card bg-white/80 dark:bg-neutral-800/80">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Applications</h2>
                {data.applications.length > 0 ? (
                  <div className="space-y-4">
                    {data.applications.map((app) => (
                      <div key={app.id} className="border-b dark:border-gray-700 pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{app.job_title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{app.company_name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                              Applied: {new Date(app.applied_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`badge ${
                                app.status === 'Pending'
                                  ? 'badge-warning'
                                  : app.status === 'Accepted'
                                  ? 'badge-success'
                                  : app.status === 'Rejected'
                                  ? 'badge-danger'
                                  : app.status === 'Shortlisted'
                                  ? 'badge-info'
                                  : 'badge-warning'
                              }`}
                            >
                              {app.status}
                            </span>
                            <Link
                              to={`/jobs/${app.job_id}`}
                              className="block mt-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm"
                            >
                              View Job →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">You haven't applied to any jobs yet</p>
                    <Link to="/jobs" className="btn-primary inline-block">
                      Browse Jobs
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && user?.role !== 'seeker' && (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Manage Jobs</h2>
            <ManageJobsList navigate={navigate} />
          </div>
        )}

        {activeTab === 'applications' && user?.role !== 'seeker' && (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Applications</h2>
            <ApplicationsList navigate={navigate} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <Suspense fallback={<div className="text-center">Loading Profile...</div>}>
              <Profile />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

// Manage Jobs List Component for Employers
const ManageJobsList = ({ navigate }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/employer/jobs');
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      await api.put(`/employer/jobs/${jobId}`, { status: newStatus });
      fetchJobs();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/employer/jobs/${jobId}`);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setFilter('all')}
        >
          All ({jobs.length})
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setFilter('active')}
        >
          Active ({jobs.filter(j => j.status === 'Active').length})
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({jobs.filter(j => j.status === 'Pending').length})
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'closed' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setFilter('closed')}
        >
          Closed ({jobs.filter(j => j.status === 'Closed').length})
        </button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No jobs found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="card dark:bg-gray-800 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FaBriefcase /> {job.type}
                    </span>
                    <span>{job.location}</span>
                    <span>{job.experience_level}</span>
                    <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                      job.status === 'Active' ? 'bg-green-500' :
                      job.status === 'Pending' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{job.application_count || 0} Applications</span>
                    <span>{job.pending_applications || 0} Pending</span>
                    <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="btn-primary text-sm"
                  >
                    View
                  </button>
                  {job.status === 'Active' && (
                    <button
                      onClick={() => handleStatusUpdate(job.id, 'Closed')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Close
                    </button>
                  )}
                  {job.status === 'Closed' && (
                    <button
                      onClick={() => handleStatusUpdate(job.id, 'Active')}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Applications List Component for Employers/Admins
const ApplicationsList = ({ navigate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/employer/applications');
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.put(`/employer/applications/${appId}`, { status: newStatus });
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'shortlisted' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setFilter('shortlisted')}
        >
          Shortlisted
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'accepted' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="card dark:bg-gray-800 text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="card dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 flex-1">
                  {/* Clickable Applicant Profile */}
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      const profile = {
                        name: app.applicant_name || app.seeker_name || 'Applicant',
                        title: 'Job Seeker',
                        description: app.cover_letter || '',
                        linkedin: app.applicant_linkedin || '',
                        facebook: app.applicant_facebook || '',
                        github: app.applicant_github || '',
                        twitter: app.applicant_twitter || '',
                        website: app.applicant_website || '',
                        avatar: app.applicant_avatar || '',
                      };
                      navigate('/profile-view', { state: { profile } });
                    }}
                  >
                    {app.applicant_avatar ? (
                      <img src={app.applicant_avatar} alt={app.applicant_name} className="w-full h-full object-cover" />
                    ) : (
                      <FaUserCircle className="text-gray-400 text-3xl" />
                    )}
                  </div>

                  <div className="flex-1">
                    <button
                      className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600"
                      onClick={() => {
                        const profile = {
                          name: app.applicant_name || app.seeker_name || 'Applicant',
                          title: 'Job Seeker',
                          description: app.cover_letter || '',
                          linkedin: app.applicant_linkedin || '',
                          facebook: app.applicant_facebook || '',
                          github: app.applicant_github || '',
                          twitter: app.applicant_twitter || '',
                          website: app.applicant_website || '',
                          avatar: app.applicant_avatar || '',
                        };
                        navigate('/profile-view', { state: { profile } });
                      }}
                    >
                      {app.applicant_name || app.seeker_name || 'Applicant'}
                    </button>
                    <p className="text-gray-600 dark:text-gray-400">Applied for: {app.job_title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Applied: {new Date(app.applied_at || app.created_at).toLocaleDateString()}
                    </p>
                    {app.cover_letter && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                        {app.cover_letter}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`badge ${
                      app.status === 'Pending'
                        ? 'badge-warning'
                        : app.status === 'Accepted'
                        ? 'badge-success'
                        : app.status === 'Rejected'
                        ? 'badge-danger'
                        : app.status === 'Shortlisted'
                        ? 'badge-info'
                        : 'badge-warning'
                    }`}
                  >
                    {app.status}
                  </span>
                  
                  {/* Status Actions */}
                  <div className="mt-3 flex flex-col gap-2">
                    {app.status !== 'Shortlisted' && app.status !== 'Accepted' && (
                      <button
                        className="badge-info text-sm px-3 py-1"
                        onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
                      >
                        Shortlist
                      </button>
                    )}
                    {app.status !== 'Accepted' && (
                      <button
                        className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={() => handleStatusUpdate(app.id, 'Accepted')}
                      >
                        Accept
                      </button>
                    )}
                    {app.status !== 'Rejected' && (
                      <button
                        className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
