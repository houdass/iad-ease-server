const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    ROLES = require('../constants').ROLES;

//================================
// User Schema
//================================
const UserSchema = new Schema({
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: { type: String },
        lastName: { type: String },
        role: {
            type: String,
            enum: [ROLES.ADMIN, ROLES.CLIENT, ROLES.MEMBER, ROLES.OWNER],
            default: ROLES.MEMBER
        },
        permissions: [String],
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }
    },
    {
        timestamps: true
    });

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
    const user = this,
        SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) { return cb(err); }

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);