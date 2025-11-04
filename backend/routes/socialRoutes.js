const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/socialController');

const router = express.Router();

// Follow
router.post('/follow/:userId', verifyToken, ctrl.follow);
router.delete('/follow/:userId', verifyToken, ctrl.unfollow);
router.get('/me/followers', verifyToken, ctrl.myFollowers);
router.get('/me/following', verifyToken, ctrl.myFollowing);

// Connections
router.post('/connect/:userId', verifyToken, ctrl.requestConnection);
router.patch('/connect/:id', verifyToken, ctrl.respondConnection);
router.get('/me/connections', verifyToken, ctrl.myConnections);
router.get('/me/connections/pending', verifyToken, ctrl.myPendingConnections);

// Messages
router.post('/messages/:userId', verifyToken, ctrl.sendMessage);
router.get('/messages/conversation/:userId', verifyToken, ctrl.getConversation);
router.get('/messages/inbox', verifyToken, ctrl.getInbox);
router.get('/messages/suggestions', verifyToken, ctrl.getMessageSuggestions);

module.exports = router;
