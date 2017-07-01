const User = require('../models/user');

exports.get = function(req, res) {
        User.find({}, (err, users) => {
            if (err)
                res.status(500).send(err);
            else {
                res.json(users);
            }
        });
};
