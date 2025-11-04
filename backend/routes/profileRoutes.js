const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/profileController');

const router = express.Router();

// Public profile
router.get('/:id', ctrl.getPublicProfile);

// Authenticated profile actions
router.get('/me/profile', verifyToken, ctrl.getMyProfile);
router.put('/me/profile', verifyToken, ctrl.updateProfile);

// Certificates
router.get('/me/certificates', verifyToken, ctrl.listCertificates);
router.post('/me/certificates', verifyToken, ctrl.addCertificate);
router.delete('/me/certificates/:id', verifyToken, ctrl.deleteCertificate);

// Posts
router.get('/me/posts', verifyToken, ctrl.getUserPosts);
router.get('/:userId/posts', ctrl.getUserPosts); // public posts of a user
router.post('/me/posts', verifyToken, ctrl.createPost);
router.get('/feed/global', ctrl.getFeed);

module.exports = router;
