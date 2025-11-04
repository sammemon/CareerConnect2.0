// routes/geminiRoutes.js
const express = require('express');
const router = express.Router();
const { geminiChat, getChatHistory, deleteChatSession } = require('../controllers/geminiController');

// POST → send query to Gemini + save in MySQL
router.post('/gemini-chat', geminiChat);

// GET → fetch user’s previous queries/responses
router.get('/chat-history', getChatHistory);

// DELETE → delete a session's rows (expects JSON body with session_id and user_id)
router.delete('/chat-session', deleteChatSession);

module.exports = router;
