require('../config/passport');

const UserController = require('../controllers/user');
const AuthController = require('../controllers/auth');
const express = require('express');
const passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = () => {
    const userRoutes = express.Router();

    // Get users route
    userRoutes.get('/', requireAuth, AuthController.roleAuthorization(['Admin']), UserController.get);

    return userRoutes;
};