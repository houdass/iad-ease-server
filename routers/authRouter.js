require('../config/passport');

const AuthenticationController = require('../controllers/auth.controller');
const express = require('express');
const passport = require('passport');

// Middleware to require login/auth
const requireLogin = passport.authenticate('local', { session: false });

module.exports = () => {
    // Initializing route groups
    const authRoutes = express.Router();

    /**
     * @api {post} auth/register Registration
     * @apiName Register
     * @apiGroup Auth
     *
     * @apiSuccess {Array} List of users.
     */

    authRoutes.post('/register', AuthenticationController.register);

    /**
     * @api {post} auth/login Login
     * @apiName Login
     * @apiGroup Auth
     * @apiParamExample {json} Raw data example
     * {
     *  "email": "youness@gmail.com",
     *  "password": "123456"
     * }
     * @apiSuccessExample {json} Success
     *  200 OK
     *  {
     * "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTU4MTEyNGE0MjVjZTA4NjI2NzgxMTIiLCJmaXJzdE5hbWUiOiJZb3VuZXNzIiwibGFzdE5hbWUiOiJIb3VkYXNzIiwiZW1haWwiOiJ5b3VuZXNzQGdtYWlsLmNvbSIsInJvbGUiOiJjbGllbnQiLCJwZXJtaXNzaW9ucyI6WyJSRUFEX1VTRVJTIiwiV1JJVEVfVVNFUlMiXSwiaWF0IjoxNDk5MDE4NjQ2LCJleHAiOjE0OTkwMjIyNDZ9.pvcU1JV5MGc8rDceq2LoE1dLPUXoNlDgLgFJs-yYQdY",
     * "user": {
     *   "_id": "59581124a425ce0862678112",
     *   "firstName": "Youness",
     *   "lastName": "Houdass",
     *   "email": "youness@gmail.com",
     *   "role": "client",
     *      "permissions": [
     *          "READ_USERS",
     *          "WRITE_USERS"
     *      ]
     *  }
     * }
     * @apiErrorExample {json} Register error
     *  400  Bad Request
     */

    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    return authRoutes;
};