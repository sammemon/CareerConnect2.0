import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaFacebook, FaGithub, FaTwitter, FaBriefcase, FaMapMarkerAlt, FaClock, FaEnvelope } from 'react-icons/fa';
import api from '../api/axios';

const ensureProtocol = (url) => {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

export default function PublicProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const profile = state?.profile || {};

  const name = profile.name || profile.companyName || 'Profile';
  const role = profile.role || profile.title || '';
  const about = profile.about || profile.description || '';
  const avatar = profile.avatar || '';
  const employerId = profile.employerId || profile.userId || null;
  const companyName = profile.name || profile.companyName || '';
  
  const socials = {
    linkedin: ensureProtocol(profile.linkedin || ''),
    facebook: ensureProtocol(profile.facebook || ''),
    github: ensureProtocol(profile.github || ''),
    twitter: ensureProtocol(profile.twitter || ''),
    website: ensureProtocol(profile.website || ''),
  };

  // Fetch jobs posted by this employer
  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        if (employerId) {
          // Prefer backend filtering by employer_id for accuracy and performance
          const response = await api.get('/jobs', { params: { employer_id: employerId } });
          setJobs(response.data.data || []);
        } else {
          // Fallback: fetch all and filter by company name
          const response = await api.get('/jobs');
          const allJobs = response.data.data || [];
          const employerJobs = allJobs.filter(job => job.company_name === companyName);
          setJobs(employerJobs);
        }
      } catch (error) {
        console.error('Error fetching employer jobs:', error);
      } finally {
        setLoadingJobs(false);
      }
    };

    if (role === 'Employer' || profile.title === 'Employer') {
      fetchEmployerJobs();
    } else {
      setLoadingJobs(false);
    }
  }, [companyName, employerId, role, profile.title]);

  return (
  <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 transition-colors">
      <div className="container mx-auto px-4">
        <button onClick={() => navigate(-1)} className="mb-6 text-primary-600 hover:text-primary-700">← Back</button>

  <div className="max-w-3xl mx-auto p-8 rounded-xl shadow-xl bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt={name} className="object-cover w-full h-full" />
              ) : (
                <span className="text-neutral-500">{name?.charAt(0) || 'P'}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{name}</h1>
              {role && <p className="text-neutral-600 dark:text-neutral-300">{role}</p>}
            </div>
            </div>
            {employerId && (
              <button
                onClick={() => navigate(`/messages/${employerId}`, { state: { name } })}
                className="btn btn-accent flex items-center gap-2"
                title="Send Message"
              >
                <FaEnvelope /> Message
              </button>
            )}
          </div>

          {about && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">About</h2>
              <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">{about}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">Follow Us</h2>
            <div className="flex space-x-6">
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="link-primary flex items-center space-x-1">
                  <FaLinkedin /> <span>LinkedIn</span>
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="link-primary flex items-center space-x-1">
                  <FaFacebook /> <span>Facebook</span>
                </a>
              )}
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-200 hover:underline flex items-center space-x-1">
                  <FaGithub /> <span>GitHub</span>
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="link-primary flex items-center space-x-1">
                  <FaTwitter /> <span>X</span>
                </a>
              )}
              {socials.website && (
                <a href={socials.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  Website →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Jobs/Internships Posted by Employer */}
        {(role === 'Employer' || profile.title === 'Employer') && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="p-8 rounded-xl shadow-xl bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Jobs & Internships Posted
              </h2>
              
              {loadingJobs ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-600 dark:text-neutral-400">No jobs posted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white/80 dark:bg-neutral-800/80"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-primary-500" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaBriefcase className="text-primary-500" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-primary-500" />
                              {job.experience_level}
                            </span>
                          </div>
                          {job.description && (
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
                              {job.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          <span
                            className={`badge ${
                              job.status === 'Active' ? 'badge-success' : 'badge-warning'
                            }`}
                          >
                            {job.status}
                          </span>
                          {job.salary && (
                            <p className="text-green-600 dark:text-green-400 font-semibold mt-2 text-sm">
                              {job.salary}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
