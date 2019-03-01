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
        const firstCategories = ['shirts', 'tees_henleys', 'polos', 'sweaters'];
        const secondCategories = ['pants', 'shorts'];
        const firstCrit = {
            category: firstCategories[Math.floor(Math.random() * firstCategories.length)]
        };
        const secondCrit = {
            category: secondCategories[Math.floor(Math.random() * secondCategories.length)]
        };

        q.all([
            Product.count(firstCrit).then(count => Product.find(firstCrit).limit(1).skip(Math.floor(Math.random() * count))),
            Product.count(secondCrit).then(count => Product.find(secondCrit).limit(1).skip(Math.floor(Math.random() * count)))
        ]).then(products => {
            res.send([products[0][0], products[1][0]]);
        }).catch((err) => {
            res.serverError(err);
        });
	},
    image: (req, res) => {
        res.send();
	}
};
