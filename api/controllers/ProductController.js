/**
* ProductController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/

const q = require('q');

module.exports = {
    getAll: (req, res) => {
		Product.find({}).exec(function(err, products) {
			if (err) {
				res.serverError(err);
			} else {
				res.send(products);
			}
		});
	},
    getTwoRandom: (req, res) => {
        // q.all([
        //     Product.count().then(count => Product.find().limit(1).skip(Math.floor(Math.random() * count))),
        //     Product.count().then(count => Product.find().limit(1).skip(Math.floor(Math.random() * count)))
        // ]).then(products => {
        //     res.send([products[0][0], products[1][0]]);
        // }).catch((err) => {
        //     res.serverError(err);
        // });

        Product.count().then(count => Product.find().limit(1).skip(Math.floor(Math.random() * count))).then(function(products) {
            Product.count().then(count => Product.find().limit(1).skip(Math.floor(Math.random() * count))).then(function(products2) {
    				res.send([products[0][0], products2[1][0]]);
    		}).catch((err) => {
                sails.log(3, err);
                res.serverError(err);
            });
		}).catch((err) => {
            sails.log(4, err);
            res.serverError(err);
        });
	},
    image: (req, res) => {
        res.send();
	}
};
