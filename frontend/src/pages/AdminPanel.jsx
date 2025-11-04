import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaBuilding,
  FaCheck,
  FaTimes,
  FaClock,
} from 'react-icons/fa';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'jobs') fetchJobs();
    else if (activeTab === 'applications') fetchApplications();
  }, [activeTab]);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get('/admin/jobs');
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/admin/applications');
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleJobStatusChange = async (jobId, status) => {
    try {
      await api.put(`/admin/jobs/${jobId}/status`, { status });
      fetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 transition-colors">
  <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Admin Panel</h1>
          <p className="text-neutral-600 dark:text-neutral-300 mt-2">Manage platform users, jobs, and applications</p>
        </div>

        {/* Tabs */}
  <div className="mb-6 border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applications
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="gradient-card card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-accent-100 text-sm">Total Users</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.stats.users.total}</h3>
                    <p className="text-blue-100 text-xs mt-2">
                      Seekers: {stats.stats.users.seekers} | Employers: {stats.stats.users.employers}
                    </p>
                  </div>
                  <FaUsers className="text-4xl text-accent-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-100 text-sm">Total Jobs</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.stats.jobs.total_jobs}</h3>
                    <p className="text-green-100 text-xs mt-2">
                      Active: {stats.stats.jobs.active_jobs}
                    </p>
                  </div>
                  <FaBriefcase className="text-4xl text-green-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-100 text-sm">Applications</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {stats.stats.applications.total_applications}
                    </h3>
                    <p className="text-purple-100 text-xs mt-2">
                      Pending: {stats.stats.applications.pending}
                    </p>
                  </div>
                  <FaFileAlt className="text-4xl text-purple-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-yellow-100 text-sm">Companies</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {stats.stats.companies.total_companies}
                    </h3>
                    <p className="text-yellow-100 text-xs mt-2">
                      Industries: {stats.stats.companies.total_industries}
                    </p>
                  </div>
                  <FaBuilding className="text-4xl text-yellow-200" />
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Recent Users</h2>
                <div className="space-y-3">
                  {stats.recent.users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
                      </div>
                      <span className="badge badge-info">{user.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Recent Jobs</h2>
                <div className="space-y-3">
                  {stats.recent.jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{job.employer_name}</p>
                      </div>
                      <span
                        className={`badge ${
                          job.status === 'Active'
                            ? 'badge-success'
                            : job.status === 'Pending'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-info">{user.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`badge ${
                            user.is_active ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Job Management</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{job.title}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">{job.employer_name}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{job.location}</p>
                      <div className="flex space-x-2 mt-2">
                        <span className="badge badge-info">{job.type}</span>
                        <span
                          className={`badge ${
                            job.status === 'Active'
                              ? 'badge-success'
                              : job.status === 'Pending'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {job.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleJobStatusChange(job.id, 'Active')}
                            className="btn-primary flex items-center space-x-1"
                          >
                            <FaCheck />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleJobStatusChange(job.id, 'Closed')}
                            className="btn-danger flex items-center space-x-1"
                          >
                            <FaTimes />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {job.status === 'Active' && (
                        <button
                          onClick={() => handleJobStatusChange(job.id, 'Closed')}
                          className="btn-secondary"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">All Applications</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">{app.seeker_name}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{app.seeker_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">{app.job_title}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">{app.company_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`badge ${
                            app.status === 'Accepted'
                              ? 'badge-success'
                              : app.status === 'Rejected'
                              ? 'badge-danger'
                              : app.status === 'Pending'
                              ? 'badge-warning'
                              : 'badge-info'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
