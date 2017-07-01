require('crypto');
const jwt = require('jsonwebtoken'),
    User = require('../models/user'),
    config = require('../config/main'),
    _ = require('lodash');

function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 3600 // in seconds
    });
}

// Set user info from request
function setUserInfo(request) {
    return {
        _id: request._id,
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        role: request.role,
        permissions: request.permissions
    };
}

//========================================
// Login Route
//========================================
exports.login = function(req, res, next) {

    let userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
    next();
};


//========================================
// Registration Route
//========================================
exports.register = function(req, res, next) {
    // Check for registration errors
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const role = req.body.role;
    const permissions = req.body.permissions;

    // Return error if no email provided
    if (!email) {
        return res.status(422).send({ error: 'You must enter an email address.'});
    }

    // Return error if full name not provided
    if (!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.'});
    }

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({ error: 'You must enter a password.' });
    }

    User.findOne({ email }, (err, existingUser) => {
        if (err) { return next(err); }

        // If user is not unique, return error
        if (existingUser) {
            return res.status(422).send({ error: 'That email address is already in use.' });
        }

        // If email is unique and password was provided, create account
        let user = new User({
            email,
            password,
            firstName,
            lastName,
            role,
            permissions
        });

        user.save((err, user)  => {
            if (err) { return next(err); }

            // Respond with JWT if user was created

            let userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
};

//========================================
// Authorizations Middleware
//========================================

// Role/Permissions authorization check
exports.hasAuthorization = function(roles, permissions) {

    roles = [].concat([], roles)
    permissions = [].concat([], permissions)
    return function(req, res, next) {
        let user = req.user;

        User.findById(user._id, (err, foundUser) => {

            if (err) {
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }

            if ((roles.indexOf(foundUser.role) > -1) || (_.intersection(permissions, foundUser.permissions).length > 0)) {
                return next();
            }

            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');
        });
    };
};


