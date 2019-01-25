/**
* UserController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/
var sails = require('sails');

module.exports = {
	session: function(req, res) {
		sails.log(req.user.id);
		User.findOne({id: req.user.id}).exec(function(err, user) {
			if (err) {
				sails.log(err);
				res.serverError(err);
			} else {
				res.send(user);
			}
		});
	}
};
