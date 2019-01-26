/**
* UserController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/
var sails = require('sails');

module.exports = {
	session: function(req, res) {
		User.findOne({id: req.user.id}).exec(function(err, user) {
			if (err) {
				res.serverError(err);
			} else {
				res.send(user);
			}
		});
	}
};
