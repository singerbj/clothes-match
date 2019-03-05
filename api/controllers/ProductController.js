/**
* ProductController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/

const q = require('q');

module.exports = {
    getAll: (req, res) => {
        q.all([
            Product.find(),
            Suggestion.find()
        ]).then(results => {
            const suggestionsMap = {};
            const productMap = {};
            results[0].forEach((product) => {
                productMap[product.id] = product;
            });
            results[1].forEach((suggestion) => {
                if(!suggestionsMap[suggestion.productId1]){
                    suggestionsMap[suggestion.productId1] = [];
                }
                if(!suggestionsMap[suggestion.productId2]){
                    suggestionsMap[suggestion.productId2] = [];
                }
                suggestionsMap[suggestion.productId1].push({ ...productMap[suggestion.productId2], matches: suggestion.matches });
                suggestionsMap[suggestion.productId2].push({ ...productMap[suggestion.productId1], matches: suggestion.matches });
            });
            results[0].forEach((product) => {
                product.suggestions = suggestionsMap[product.id] || [];
            });
            res.send({
                products: results[0]
            });
        }).catch((err) => {
            res.serverError(err);
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
	}
};
