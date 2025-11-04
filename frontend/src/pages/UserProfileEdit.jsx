import React, { useState } from 'react';
import { FaCamera, FaUpload, FaUserCircle } from 'react-icons/fa';

const initialProfile = {
  bio: '',
  education: '',
  qualifications: '',
  achievements: '',
  certificates: [],
  resume: null,
  banner: null,
  profilePicture: null,
};

const UserProfileEdit = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Handlers
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (field === 'certificates') {
      setProfile({ ...profile, certificates: [...profile.certificates, file] });
    } else {
      setProfile({ ...profile, [field]: file });
    }
  };

  const handleRemoveCertificate = (idx) => {
    setProfile({ ...profile, certificates: profile.certificates.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    // TODO: API call to save profile
    setTimeout(() => {
      setSaving(false);
      setSuccess('Profile updated successfully!');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-10">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-primary-400 via-primary-600 to-accent-400 bg-clip-text text-transparent dark:text-primary-200">
          Edit Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 space-y-8">
          {/* Banner Image */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-lg">Banner Image</label>
            <div className="relative w-full h-40 bg-neutral-200 dark:bg-neutral-700 rounded-xl flex items-center justify-center overflow-hidden">
              {profile.banner ? (
                <img src={URL.createObjectURL(profile.banner)} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <span className="text-neutral-400">No banner uploaded</span>
              )}
              <label className="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary-700">
                <FaCamera />
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'banner')} />
              </label>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="mb-6 flex flex-col items-center">
            <label className="block font-semibold mb-2 text-lg">Profile Picture</label>
            <div className="relative w-28 h-28 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
              {profile.profilePicture ? (
                <img src={URL.createObjectURL(profile.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle className="text-6xl text-neutral-400" />
              )}
              <label className="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary-700">
                <FaCamera />
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'profilePicture')} />
              </label>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-semibold mb-2">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="input-field min-h-[80px]"
              placeholder="Tell us about yourself..."
              required
            />
          </div>

          {/* Education */}
          <div>
            <label className="block font-semibold mb-2">Education</label>
            <input
              type="text"
              name="education"
              value={profile.education}
              onChange={handleChange}
              className="input-field"
              placeholder="Your education background"
              required
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="block font-semibold mb-2">Qualifications</label>
            <input
              type="text"
              name="qualifications"
              value={profile.qualifications}
              onChange={handleChange}
              className="input-field"
              placeholder="Your professional qualifications"
              required
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block font-semibold mb-2">Achievements</label>
            <textarea
              name="achievements"
              value={profile.achievements}
              onChange={handleChange}
              className="input-field min-h-[60px]"
              placeholder="Awards, recognitions, or major achievements"
            />
          </div>

          {/* Certificates */}
          <div>
            <label className="block font-semibold mb-2">Certificates</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple={false}
              onChange={e => handleFileChange(e, 'certificates')}
              className="input-field"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.certificates.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-lg text-primary-700 dark:text-primary-300">
                  <span>{file.name}</span>
                  <button type="button" className="text-red-500" onClick={() => handleRemoveCertificate(idx)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div>
            <label className="block font-semibold mb-2">Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => handleFileChange(e, 'resume')}
              className="input-field"
            />
            {profile.resume && (
              <div className="mt-2 text-green-600 dark:text-green-400 flex items-center gap-2">
                <FaUpload /> {profile.resume.name}
              </div>
            )}
          </div>

          {/* Save Button & Status */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full py-3 font-bold text-lg shadow-md hover:shadow-lg transition-all"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            {success && <div className="mt-3 text-green-600 dark:text-green-400 text-center font-semibold">{success}</div>}
            {error && <div className="mt-3 text-red-600 dark:text-red-400 text-center font-semibold">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileEdit;
