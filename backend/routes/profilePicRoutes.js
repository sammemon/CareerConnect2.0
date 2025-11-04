const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/profile_pics'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.user.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  }
});

// POST /api/profile/me/profile-picture
router.post('/me/profile-picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/profile_pics/${req.file.filename}`;
    await User.updateProfile(req.user.id, { profile_picture: imageUrl });
    
    res.json({ 
      success: true, 
      message: 'Profile picture updated', 
      data: { 
        profile_picture: imageUrl 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile picture', error: err.message });
  }
});

module.exports = router;
