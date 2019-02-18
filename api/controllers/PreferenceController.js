/**
* PreferenceController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/

var sails = require('sails');

module.exports = {
    getAll: (req, res) => {
		var promise = Preference.find({}).exec(function(err, preferences) {
			if (err) {
				res.serverError(err);
			} else {
				res.send(preferences);
			}
		});
	},
    savePreference: (req, res) => {
		Preference.create({ ...req.body, userId: req.user.id }).exec(function(err, preference) {
			if (err) {
				res.serverError(err);
			} else {
				res.send(preference);
			}
		});
	}
};
