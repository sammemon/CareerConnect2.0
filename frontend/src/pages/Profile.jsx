import React, { useEffect, useState } from "react";
import { FaLinkedin, FaFacebook, FaGithub, FaTwitter, FaFileUpload } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const initialProfile = {
  name: "",
  email: "",
  phone: "",
  resume: null,
  profilePic: null,
  linkedin: "",
  facebook: "",
  github: "",
  twitter: "",
};

export default function Profile() {
  const { user, updateUser } = useAuth?.() || { user: null, updateUser: null };
  const [profile, setProfile] = useState(initialProfile);
  const [resumeName, setResumeName] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const storageKey = React.useMemo(() => {
    const id = user?.id || user?.email || "guest";
    return `cc_profile_${id}`;
  }, [user]);

  // Load saved profile from localStorage on mount or when user changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        setProfile((prev) => ({
          ...prev,
          name: saved.name || user?.name || "",
          email: saved.email || user?.email || "",
          phone: saved.phone || user?.phone || "",
          linkedin: saved.linkedin || "",
          facebook: saved.facebook || "",
          github: saved.github || "",
          twitter: saved.twitter || "",
        }));
        setResumeName(saved.resumeName || "");
        if (saved.profilePicDataUrl) {
          setProfilePicPreview(saved.profilePicDataUrl);
        }
      } else {
        // Prefill from user context
        if (user) {
          setProfile((prev) => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
          }));
        }
      }
    } catch (e) {
      console.warn("Failed to load saved profile", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type) && file.size <= 5 * 1024 * 1024) {
      setProfile((prev) => ({ ...prev, resume: file }));
      setResumeName(file.name);
    } else {
      alert("Invalid file type or size. Only PDF/DOC/DOCX up to 5MB allowed.");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024) {
      // Store file for upload
      setProfile((prev) => ({ ...prev, profilePicFile: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Invalid image type or size. Only images up to 2MB allowed.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!profile.name || profile.name.trim() === '') {
      alert("Name is required!");
      return;
    }
    
    setIsSaving(true);
    try {
      // Ensure all quick links have protocol
      const ensureProtocol = (url) => {
        if (!url) return "";
        return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      };

      // Update profile in backend database
      const profileUpdate = {
        name: profile.name || user?.name || '',
        phone: profile.phone || '',
      };
      
      console.log('Sending profile update:', profileUpdate);
      console.log('API baseURL:', api.defaults.baseURL);
      console.log('Full URL will be:', api.defaults.baseURL + '/auth/profile');
      const response = await api.put('/auth/profile', profileUpdate);
      console.log('Profile update response:', response.data);
      
      // Upload profile picture to backend if selected
      if (profile.profilePicFile) {
        const formData = new FormData();
        formData.append("profilePicture", profile.profilePicFile);
        const picResponse = await api.post("/profile/me/profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        // Update user with new profile picture path
        if (picResponse.data.success && updateUser) {
          const updatedUserData = {
            ...response.data.data,
            profile_picture: picResponse.data.data.profile_picture
          };
          updateUser(updatedUserData);
        }
      }
      
      // If a resume file is selected, upload to backend
      if (profile.resume) {
        setUploadingResume(true);
        const formData = new FormData();
        formData.append("resume", profile.resume);
        await api.post("/users/me/resume", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadingResume(false);
      }

      // Update localStorage with new data
      const toSave = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        linkedin: ensureProtocol(profile.linkedin),
        facebook: ensureProtocol(profile.facebook),
        github: ensureProtocol(profile.github),
        twitter: ensureProtocol(profile.twitter),
        resumeName, // store only the name to avoid large storage
        profilePicDataUrl: profilePicPreview || null,
      };
      localStorage.setItem(storageKey, JSON.stringify(toSave));
      
      // Update the user in localStorage to sync name
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.name = profile.name;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }

      // Update AuthContext if available (already done above if profile pic uploaded)
      if (updateUser && !profile.profilePicFile) {
        updateUser(response.data.data);
      }

      // Update AuthContext with latest user data from backend (instant navbar update)
      if (updateUser) {
        try {
          const freshUserRes = await api.get('/auth/me');
          if (freshUserRes.data.success) {
            updateUser(freshUserRes.data.data);
            // Force component re-render by reloading page
            setTimeout(() => window.location.reload(), 500);
          }
        } catch (e) {
          console.warn('Failed to fetch latest user after profile update', e);
        }
      }

      alert("Profile updated successfully! Page will refresh...");
    } catch (err) {
      console.error("Failed to save profile", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to save profile: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
  <div className="max-w-2xl mx-auto mt-10 p-8 rounded-xl shadow-xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur border border-gray-200 dark:border-gray-700">
  <h2 className="text-2xl font-bold mb-6 text-accent-600 dark:text-white">Profile Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col mb-4">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <span className="text-neutral-400 dark:text-neutral-500">No Image</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="block font-medium mb-2">Profile Picture:</label>
              <input type="file" accept="image/*" onChange={handleProfilePicChange} className="p-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 dark:text-white" />
            </div>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full p-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 dark:text-white" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full p-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 dark:text-white" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input type="tel" name="phone" value={profile.phone} onChange={handleChange} className="w-full p-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 dark:text-white" />
        </div>
        <div>
          <label className="block font-medium mb-1">CV/Resume</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full p-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 dark:text-white" />
          {resumeName && <span className="text-sm text-accent-500 dark:text-accent-400">{resumeName}</span>}
        </div>
        <div>
          <label className="block font-medium mb-1">Quick Links</label>
          <div className="flex space-x-4">
            <input type="url" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="LinkedIn" className="flex-1 p-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 dark:text-white" />
            <input type="url" name="facebook" value={profile.facebook} onChange={handleChange} placeholder="Facebook" className="flex-1 p-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 dark:text-white" />
            <input type="url" name="github" value={profile.github} onChange={handleChange} placeholder="GitHub" className="flex-1 p-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 dark:text-white" />
            <input type="url" name="twitter" value={profile.twitter} onChange={handleChange} placeholder="X (Twitter)" className="flex-1 p-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 dark:text-white" />
          </div>
        </div>
  <button type="submit" disabled={isSaving} className="btn-primary w-full">
          {isSaving ? (uploadingResume ? "Uploading resume..." : "Saving...") : "Save Profile"}
        </button>
      </form>
      <div className="mt-8">
  <h3 className="text-lg font-semibold mb-2 text-neutral-700 dark:text-neutral-300">Quick Links</h3>
        <div className="flex space-x-6">
          {profile.linkedin && (
            <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
              target="_blank" rel="noopener noreferrer"
              className="link-primary flex items-center space-x-1">
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
          )}
          {profile.facebook && (
            <a href={profile.facebook.startsWith('http') ? profile.facebook : `https://${profile.facebook}`}
              target="_blank" rel="noopener noreferrer"
              className="link-primary flex items-center space-x-1">
              <FaFacebook /> <span>Facebook</span>
            </a>
          )}
          {profile.github && (
            <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
              target="_blank" rel="noopener noreferrer"
              className="text-gray-800 dark:text-gray-200 hover:underline flex items-center space-x-1">
              <FaGithub /> <span>GitHub</span>
            </a>
          )}
          {profile.twitter && (
            <a href={profile.twitter.startsWith('http') ? profile.twitter : `https://${profile.twitter}`}
              target="_blank" rel="noopener noreferrer"
              className="link-primary flex items-center space-x-1">
              <FaTwitter /> <span>X</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
