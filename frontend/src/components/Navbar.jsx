import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import Logo from './Logo';
import {
  FaBriefcase,
  FaUserCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaEnvelope,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);
  const closeDropdown = () => setOpen(false);

  // Backend URL for profile pictures
  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Helper function to get full profile picture URL
  const getProfilePictureUrl = (profilePicPath) => {
    if (!profilePicPath) return null;
    if (profilePicPath.startsWith('http')) return profilePicPath;
    const cleanPath = profilePicPath.startsWith('/')
      ? profilePicPath.slice(1)
      : profilePicPath;
    return `${BACKEND_URL}/${cleanPath}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group relative py-2 px-3 -mx-3 rounded-xl hover:bg-primary-50/60 dark:hover:bg-primary-900/10 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="relative flex-shrink-0">
              <Logo
                to={null}
                className="transition-transform duration-200"
                heightClass="h-12 md:h-14"
                iconOnly
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-600/20 dark:from-primary-400/15 dark:to-primary-600/15 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-primary-700 to-primary-600 bg-clip-text text-transparent dark:from-white dark:via-primary-300 dark:to-primary-400 leading-none">
                CareerConnect
              </span>
              <span className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-0.5">
                Find Your Dream Job
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 ml-8">
            <Link
              to="/job-categories"
              className="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold text-base transition-all duration-300 hover:scale-105 group px-2 py-1"
            >
              Browse Jobs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
            <Link
              to="/about"
              className="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold text-base transition-all duration-300 hover:scale-105 group px-2 py-1"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
            <Link
              to="/contact"
              className="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold text-base transition-all duration-300 hover:scale-105 group px-2 py-1"
            >
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>

            <Link
              to="/career-advice"
              className="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold text-base transition-all duration-300 hover:scale-105 group px-2 py-1"
            >
              Career Advice
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
          </div>

          {/* Right Side */}
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {mobileOpen ? (
                <FaTimes className="text-xl text-gray-700 dark:text-gray-200" />
              ) : (
                <FaBars className="text-xl text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-110 active:scale-95"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400 text-xl" />
              ) : (
                <FaMoon className="text-gray-700 text-xl" />
              )}
            </button>

            {/* Authenticated User */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/messages-inbox"
                  className="relative flex items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm gap-2 transform hover:scale-105 active:scale-95"
                  aria-label="Messages"
                >
                  <FaEnvelope className="text-lg" />
                  <span className="hidden sm:inline">Messages</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-center w-11 h-11 rounded-full overflow-hidden border-2 border-primary-500 hover:border-primary-600 dark:border-primary-400 dark:hover:border-primary-300 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-95 ring-2 ring-transparent hover:ring-primary-200 dark:hover:ring-primary-800"
                  >
                    {!imgError && user?.profile_picture ? (
                      <img
                        src={getProfilePictureUrl(user.profile_picture)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <FaUserCircle className="text-4xl text-gray-600 dark:text-gray-300" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {open && (
                    <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden transition-all duration-300 ease-out animate-slideDown">
                      {/* Header */}
                      <div className="px-5 py-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          {!imgError && user?.profile_picture ? (
                            <img
                              src={getProfilePictureUrl(user.profile_picture)}
                              alt={user?.name || 'User'}
                              className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"
                              onError={() => setImgError(true)}
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md">
                              <FaUserCircle className="text-4xl text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {user?.email}
                            </p>
                            <span className="inline-block mt-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm">
                              {user?.role?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-3 px-2">
                        {/* Dashboard */}
                        {(user?.role === 'seeker' || user?.role === 'employer') && (
                          <button
                            type="button"
                            className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 flex items-center gap-3 transition-all duration-200 rounded-xl font-medium hover:scale-[1.02]"
                            onClick={() => {
                              closeDropdown();
                              navigate('/dashboard');
                            }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <FaUserCircle className="text-lg text-blue-600 dark:text-blue-400" />
                            </div>
                            <span>Dashboard</span>
                          </button>
                        )}

                        {/* Profile Settings */}
                        <button
                          type="button"
                          className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 flex items-center gap-3 transition-all duration-200 rounded-xl font-medium hover:scale-[1.02]"
                          onClick={() => {
                            closeDropdown();
                            navigate('/dashboard#profile');
                          }}
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <FaUserCircle className="text-lg text-purple-600 dark:text-purple-400" />
                          </div>
                          <span>Profile Settings</span>
                        </button>

                        {/* Employer Only: Post Job */}
                        {user?.role === 'employer' && (
                          <Link
                            to="/post-job"
                            className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 flex items-center gap-3 transition-all duration-200 rounded-xl font-medium hover:scale-[1.02]"
                            onClick={closeDropdown}
                          >
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <FaEnvelope className="text-lg text-green-600 dark:text-green-400" />
                            </div>
                            <span>Post Job</span>
                          </Link>
                        )}

                        {/* Admin Only */}
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 flex items-center gap-3 transition-all duration-200 rounded-xl font-medium hover:scale-[1.02]"
                            onClick={closeDropdown}
                          >
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                              <FaUserCircle className="text-lg text-orange-600 dark:text-orange-400" />
                            </div>
                            <span>Admin Panel</span>
                          </Link>
                        )}

                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2 mx-2"></div>

                        {/* Logout */}
                        <button
                          onClick={() => {
                            closeDropdown();
                            logout();
                            navigate('/login');
                          }}
                          className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/30 flex items-center gap-3 transition-all duration-200 rounded-xl font-medium hover:scale-[1.02]"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <FaSignOutAlt className="text-lg text-red-600 dark:text-red-400" />
                          </div>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-white dark:bg-gray-900 shadow-2xl p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Logo to={null} className="" heightClass="h-10" iconOnly />
                <div>
                  <div className="font-bold text-lg text-gray-900 dark:text-gray-100">CareerConnect</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Find Your Dream Job</div>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-2"
              >
                <FaTimes className="text-gray-700 dark:text-gray-200" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                to="/job-categories"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md font-semibold text-gray-700 dark:text-gray-200"
              >
                Browse Jobs
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md font-semibold text-gray-700 dark:text-gray-200"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md font-semibold text-gray-700 dark:text-gray-200"
              >
                Contact Us
              </Link>

              <Link
                to="/career-advice"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md font-semibold text-gray-700 dark:text-gray-200"
              >
                Career Advice
              </Link>
            </nav>

            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={toggleDarkMode}
                className="w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-gray-700 dark:text-gray-200"
              >
                {darkMode ? <FaSun /> : <FaMoon />} <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/messages-inbox"
                    onClick={() => setMobileOpen(false)}
                    className="w-full block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200"
                  >
                    Messages
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full block px-3 py-2 rounded-md bg-primary-600 text-white text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

