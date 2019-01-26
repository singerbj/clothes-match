/**
* ProductController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/

module.exports = {
    getAll: (req, res) => {
		Product.find({}).exec(function(err, products) {
			if (err) {
				res.serverError(err);
			} else {
				res.send(products);
			}
		});
	}
};
