require('../config/passport');
const ChatController = require('../controllers/chat.controller'),
    express = require('express'),
    passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = () => {
    const chatRoutes = express.Router();

    // View messages to and from authenticated user
    chatRoutes.get('/', requireAuth, ChatController.getConversations);

    // Retrieve single conversation
    chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation);

    // Send reply in conversation
    chatRoutes.post('/:conversationId', requireAuth, ChatController.sendReply);

    // Start new conversation
    chatRoutes.post('/new/:recipient', requireAuth, ChatController.newConversation);

    return chatRoutes;
};


