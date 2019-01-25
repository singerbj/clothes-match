var passport = require('passport');
var sails = require('sails');

module.exports = {
    register: function (req, res) {
        User.create({
            email: req.body.email,
            password: req.body.password
        }).exec(function(err, user) {
            if (err) {
                sails.log(err);
                res.serverError(err);
            } else {
                res.send(user);
            }
        });
    },
    login: function (req, res, next) {
        sails.log(req.body);
        passport.authenticate('local', req.body, function (err, user, response) {
            sails.log(err, user, response);
            if (err) {
                return next(err);
            }
            if (user) {
                res.json(response);
            } else {
                res.status(401);
                res.json({message: 'Bad email/password combination'});
            }
        })(req, res, next);
    },
    logout: function (req, res) {
        delete req.logout();
        res.json({success: true})
    }
}
