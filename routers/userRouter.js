require('../config/passport');

const UserController = require('../controllers/user.controller'),
    AuthController = require('../controllers/auth.controller'),
    ROLES = require('../constants').ROLES,
    PERMISSIONS = require('../constants').PERMISSIONS,
    express = require('express'),
    passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = () => {
    const userRoutes = express.Router();

    // Get users route
    userRoutes.get('/', requireAuth, AuthController.hasAuthorization(ROLES.ADMIN, PERMISSIONS.READ_USERS), UserController.get);

    return userRoutes;
};