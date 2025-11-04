import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  // Get current user from AuthContext
  const { user, isAuthenticated } = useAuth();
  let quickLinks = { facebook: '', linkedin: '', github: '', twitter: '' };
  if (isAuthenticated && user) {
    // Get profile from localStorage for this user
    const id = user.id || user.email || 'guest';
    const raw = localStorage.getItem(`cc_profile_${id}`);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        quickLinks = {
          facebook: saved.facebook || '',
          linkedin: saved.linkedin || '',
          github: saved.github || '',
          twitter: saved.twitter || '',
        };
      } catch {}
    }
  }
  // Helper to ensure protocol
  const extUrl = url => url ? (url.startsWith('http') ? url : `https://${url}`) : '#';

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">CareerConnect</h3>
            <p className="text-gray-400 text-sm">
              Your trusted platform for finding jobs and internships. Connect with top employers and kickstart your career.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-bold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/post-job" className="text-gray-400 hover:text-white">Post a Job</a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
              <li><a href="/resources" className="text-gray-400 hover:text-white">Resources</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href={isAuthenticated && quickLinks.facebook ? extUrl(quickLinks.facebook) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 hover:text-white text-xl ${!isAuthenticated || !quickLinks.facebook ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={!isAuthenticated || !quickLinks.facebook}
              >
                <FaFacebook />
              </a>
              <a
                href={isAuthenticated && quickLinks.twitter ? extUrl(quickLinks.twitter) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 hover:text-white text-xl ${!isAuthenticated || !quickLinks.twitter ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={!isAuthenticated || !quickLinks.twitter}
              >
                <FaTwitter />
              </a>
              <a
                href={isAuthenticated && quickLinks.linkedin ? extUrl(quickLinks.linkedin) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 hover:text-white text-xl ${!isAuthenticated || !quickLinks.linkedin ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={!isAuthenticated || !quickLinks.linkedin}
              >
                <FaLinkedin />
              </a>
              <a
                href={isAuthenticated && quickLinks.github ? extUrl(quickLinks.github) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 hover:text-white text-xl ${!isAuthenticated || !quickLinks.github ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={!isAuthenticated || !quickLinks.github}
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2025 CareerConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
