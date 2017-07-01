require('../config/passport');

const UserController = require('../controllers/user.controller');
const AuthController = require('../controllers/auth.controller');
const express = require('express');
const passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = () => {
    const userRoutes = express.Router();

    // Get users route
    userRoutes.get('/', requireAuth, AuthController.hasAuthorization('admin', 'can.get.users'), UserController.get);

    return userRoutes;
};