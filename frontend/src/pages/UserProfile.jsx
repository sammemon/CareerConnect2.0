import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUserPlus, FaUserCheck, FaUserFriends, FaEnvelope, FaCertificate, FaFileAlt } from 'react-icons/fa';
import api from '../api/axios';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [followBusy, setFollowBusy] = useState(false);
  const [connectBusy, setConnectBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/profile/${id}`);
        setProfile(res.data.data);
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onFollow = async () => {
    try {
      setFollowBusy(true);
      await api.post(`/social/follow/${id}`);
      // Optimistic update
      setProfile((p) => ({
        ...p,
        stats: { ...p.stats, followers: (p.stats?.followers || 0) + 1 },
      }));
    } catch (e) {
      console.error('Follow failed', e);
      alert('Failed to follow user');
    } finally {
      setFollowBusy(false);
    }
  };

  const onConnect = async () => {
    try {
      setConnectBusy(true);
      await api.post(`/social/connect/${id}`);
      alert('Connection request sent');
    } catch (e) {
      console.error('Connect failed', e);
      alert('Failed to send connection request');
    } finally {
      setConnectBusy(false);
    }
  };

  const onMessage = () => {
    const name = profile?.user?.name || 'there';
    navigate(`/messages/${id}`, { state: { name } });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center text-neutral-600 dark:text-neutral-300">Loading profile…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center text-red-600">Profile not found</div>
      </div>
    );
  }

  const user = profile.user || {};
  const certificates = profile.certificates || [];
  const posts = profile.recentPosts || [];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-primary-600 hover:text-primary-700">← Back</button>

        <div className="p-8 rounded-xl shadow-xl bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{user.name}</h1>
              {user.location && (
                <p className="text-neutral-600 dark:text-neutral-300">{user.location}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={onFollow} disabled={followBusy} className="btn btn-primary flex items-center gap-2">
                <FaUserPlus /> Follow
              </button>
              <button onClick={onConnect} disabled={connectBusy} className="btn btn-secondary flex items-center gap-2">
                <FaUserFriends /> Connect
              </button>
              <button onClick={onMessage} className="btn btn-accent flex items-center gap-2">
                <FaEnvelope /> Message
              </button>
            </div>
          </div>

          {user.profile_info && (
            <p className="mt-4 text-neutral-700 dark:text-neutral-300 whitespace-pre-line">{user.profile_info}</p>
          )}

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{profile.stats?.followers || 0}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Followers</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{profile.stats?.following || 0}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Following</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{profile.stats?.connections || 0}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Connections</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{profile.stats?.posts || 0}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Posts</div>
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="mt-6 p-6 rounded-xl shadow bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2"><FaCertificate /> Certificates</h2>
          {certificates.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400">No certificates added yet.</p>
          ) : (
            <ul className="space-y-3">
              {certificates.map((c) => (
                <li key={c.id} className="flex justify-between items-center p-3 rounded border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">{c.title}</div>
                    {c.issued_by && (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Issued by {c.issued_by}</div>
                    )}
                  </div>
                  {c.file_url && (
                    <a className="link-primary flex items-center gap-2" href={c.file_url} target="_blank" rel="noreferrer">
                      <FaFileAlt /> View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Posts */}
        <div className="mt-6 p-6 rounded-xl shadow bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Recent Posts</h2>
          {posts.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((p) => (
                <div key={p.id} className="p-4 rounded border border-gray-200 dark:border-gray-700">
                  <div className="text-neutral-900 dark:text-white whitespace-pre-line">{p.content}</div>
                  <div className="text-xs text-neutral-500 mt-2">{new Date(p.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
