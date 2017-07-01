require('../config/passport');

const AuthenticationController = require('../controllers/auth.controller');
const express = require('express');
const passport = require('passport');

// Middleware to require login/auth
const requireLogin = passport.authenticate('local', { session: false });

module.exports = () => {
    // Initializing route groups
    const authRoutes = express.Router();

    // Registration route
    authRoutes.post('/register', AuthenticationController.register);

    // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    return authRoutes;
};