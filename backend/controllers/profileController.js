const User = require('../models/User');
const Certificate = require('../models/Certificate');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
const Connection = require('../models/Connection');

const sanitizeProfileInput = (body) => {
  const allowed = [
    'name',
    'phone',
    'location',
    'skills',
    'experience',
    'education',
    'resume',
    'profile_info',
    'profile_picture',
  ];
  const data = {};
  allowed.forEach((k) => {
    if (body[k] !== undefined) data[k] = body[k];
  });
  return data;
};

exports.getPublicProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const [certs, posts, followers, following, connections] = await Promise.all([
      Certificate.getByUser(userId),
      Post.getByUser(userId),
      Follow.getFollowers(userId),
      Follow.getFollowing(userId),
      Connection.getConnections(userId),
    ]);

    return res.json({
      success: true,
      data: {
        user,
        stats: {
          posts: posts.length,
          followers: followers.length,
          following: following.length,
          connections: connections.length,
        },
        certificates: certs,
        recentPosts: posts,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load profile', error: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const certs = await Certificate.getByUser(req.user.id);
    return res.json({ success: true, data: { user, certificates: certs } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load profile', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const fields = sanitizeProfileInput(req.body || {});
    const updated = await User.updateProfile(req.user.id, fields);
    if (!updated) return res.status(400).json({ success: false, message: 'No valid fields to update' });
    const user = await User.findById(req.user.id);
    return res.json({ success: true, message: 'Profile updated', data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update profile', error: err.message });
  }
};

// Certificates
exports.listCertificates = async (req, res) => {
  try {
    const certs = await Certificate.getByUser(req.params.userId || req.user.id);
    return res.json({ success: true, data: certs });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to list certificates', error: err.message });
  }
};

exports.addCertificate = async (req, res) => {
  try {
    const { title, file_url, issued_by, issued_date } = req.body || {};
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    const id = await Certificate.create({ user_id: req.user.id, title, file_url, issued_by, issued_date });
    return res.status(201).json({ success: true, message: 'Certificate added', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add certificate', error: err.message });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const ok = await Certificate.delete(parseInt(req.params.id, 10), req.user.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Certificate not found' });
    return res.json({ success: true, message: 'Certificate deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete certificate', error: err.message });
  }
};

// Posts
exports.createPost = async (req, res) => {
  try {
    const { content, image_url } = req.body || {};
    if (!content || !content.trim()) return res.status(400).json({ success: false, message: 'Content is required' });
    const id = await Post.create({ user_id: req.user.id, content: content.trim(), image_url });
    return res.status(201).json({ success: true, message: 'Post created', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create post', error: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId ? parseInt(req.params.userId, 10) : req.user.id;
    const posts = await Post.getByUser(userId);
    return res.json({ success: true, data: posts });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load posts', error: err.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const limit = req.query.limit ? Math.min(parseInt(req.query.limit, 10) || 20, 100) : 20;
    const feed = await Post.getFeed(limit);
    return res.json({ success: true, data: feed });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load feed', error: err.message });
  }
};
