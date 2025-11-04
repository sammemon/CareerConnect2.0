const Follow = require('../models/Follow');
const Connection = require('../models/Connection');
const Message = require('../models/Message');

// Follow
exports.follow = async (req, res) => {
  try {
    const following_id = parseInt(req.params.userId, 10);
    if (!following_id || following_id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Invalid user to follow' });
    }
    await Follow.follow(req.user.id, following_id);
    return res.status(201).json({ success: true, message: 'Now following user' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to follow user', error: err.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const following_id = parseInt(req.params.userId, 10);
    const ok = await Follow.unfollow(req.user.id, following_id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not following this user' });
    return res.json({ success: true, message: 'Unfollowed user' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to unfollow user', error: err.message });
  }
};

exports.myFollowers = async (req, res) => {
  try {
    const rows = await Follow.getFollowers(req.user.id);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load followers', error: err.message });
  }
};

exports.myFollowing = async (req, res) => {
  try {
    const rows = await Follow.getFollowing(req.user.id);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load following', error: err.message });
  }
};

// Connections
exports.requestConnection = async (req, res) => {
  try {
    const user2_id = parseInt(req.params.userId, 10);
    if (!user2_id || user2_id === req.user.id) return res.status(400).json({ success: false, message: 'Invalid user' });
    const id = await Connection.request(req.user.id, user2_id);
    return res.status(201).json({ success: true, message: 'Connection requested', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to request connection', error: err.message });
  }
};

exports.respondConnection = async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const ok = await Connection.respond(parseInt(req.params.id, 10), status);
    if (!ok) return res.status(404).json({ success: false, message: 'Connection not found' });
    return res.json({ success: true, message: `Connection ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to respond to connection', error: err.message });
  }
};

exports.myConnections = async (req, res) => {
  try {
    const rows = await Connection.getConnections(req.user.id);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load connections', error: err.message });
  }
};

exports.myPendingConnections = async (req, res) => {
  try {
    const rows = await Connection.getPending(req.user.id);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load pending connections', error: err.message });
  }
};

// Messages
exports.sendMessage = async (req, res) => {
  try {
    const receiver_id = parseInt(req.params.userId, 10);
    const { content } = req.body || {};
    if (!receiver_id || receiver_id === req.user.id) return res.status(400).json({ success: false, message: 'Invalid receiver' });
    if (!content || !content.trim()) return res.status(400).json({ success: false, message: 'Content is required' });
    const id = await Message.send({ sender_id: req.user.id, receiver_id, content: content.trim() });
    return res.status(201).json({ success: true, message: 'Message sent', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to send message', error: err.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const other_id = parseInt(req.params.userId, 10);
    const rows = await Message.getConversation(req.user.id, other_id);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load conversation', error: err.message });
  }
};

exports.getInbox = async (req, res) => {
  try {
    const rows = await Message.getInbox(req.user.id);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load inbox', error: err.message });
  }
};

// AI-like message suggestions (template-based, no external AI call)
exports.getMessageSuggestions = async (req, res) => {
  try {
    const type = (req.query.type || 'general').toLowerCase();
    const name = req.query.name || 'there';
    const role = req.query.role || '';

    const templates = {
      general: [
        `Hi ${name}, hope you're doing well!`,
        `Hello ${name}, I came across your profile and wanted to connect.`,
        `Hi ${name}, would love to learn more about your work.`,
      ],
      connect: [
        `Hi ${name}, I'd like to add you to my professional network on CareerConnect.`,
        `Hello ${name}, your background in ${role || 'your field'} stood out—would you be open to connecting?`,
        `Hi ${name}, let's connect and share opportunities.`,
      ],
      follow: [
        `Hi ${name}, I enjoy your posts—looking forward to more updates!`,
        `Hello ${name}, following your work with interest.`,
        `Hi ${name}, thanks for sharing valuable insights!`,
      ],
      job: [
        `Hi ${name}, I'm interested in opportunities related to [Role/Skill]. Could we chat?`,
        `Hello ${name}, I saw your posting for [Position]. I believe my experience aligns well.`,
        `Hi ${name}, I'd love to learn more about your team's work on [Topic].`,
      ],
      intro: [
        `Hi ${name}, I'm [Your Name], a [Your Role]. I'd love to connect.`,
        `Hello ${name}, I'm exploring opportunities in ${role || '[Area]'}—open to a quick chat?`,
        `Hi ${name}, I'm impressed by your experience—would you be open to sharing advice?`,
      ],
    };

    const suggestions = templates[type] || templates.general;
    return res.json({ success: true, data: suggestions });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to generate suggestions', error: err.message });
  }
};
