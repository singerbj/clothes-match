const sails = require('sails');
const q = require('q');
const brain = require("brain.js");

const getRGBPercent = (rgbVal) => {
    return rgbVal / 255;
};

const runNetworkForProducts = (network, product1, product2) => {
    let result = network.run({
        r1: getRGBPercent(product1.r1),
        g1: getRGBPercent(product1.g1),
        b1: getRGBPercent(product1.b1),
        r2: getRGBPercent(product2.r1),
        g2: getRGBPercent(product2.g1),
        b2: getRGBPercent(product2.b1)
    });

    return {
        productId1: product1.id,
        productId2: product2.id,
        matches: result.matches
    };
};

const getMatchableProducts = (category) => {
    switch(category) {
        case "shirts":
            return ['sweaters', 'denim_sm', 'pants', 'shorts'];
        case "tees_henleys":
            return ['shirts', 'sweaters', 'denim_sm', 'pants', 'shorts'];
        case "polos":
            return ['sweaters', 'denim_sm', 'pants', 'shorts'];
        case "sweaters":
            return ['shirts', 'tees_henleys', 'polos', 'denim_sm', 'pants', 'shorts'];
        case "denim_sm":
            return ['shirts', 'tees_henleys', 'polos', 'sweaters'];
        case "pants":
            return ['shirts', 'tees_henleys', 'polos', 'sweaters'];
        case "shorts":
            return ['shirts', 'tees_henleys', 'polos', 'sweaters'];
    }
};

sails.load(function(err) {
    if (err) {
        sails.log('Error occurred loading Sails app:', err);
        return;
    }

    q.all([
        Preference.find(),
        Product.find()
    ]).then(results => {
        const preferences = results[0];
        const products = results[1];
        const productsMap = {};
        const trainingData = []

        //build products map
        products.forEach((product) => {
            productsMap[product.id] = product;
        });

        //assign products to preferences based on ids
        preferences.forEach((preference) => {
            preference.product1 = productsMap[preference.productId1];
            preference.product2 = productsMap[preference.productId2];

            //create training data
            trainingData.push({
                input:{
                    r1: getRGBPercent(preference.product1.r1),
                    g1: getRGBPercent(preference.product1.g1),
                    b1: getRGBPercent(preference.product1.b1),
                    r2: getRGBPercent(preference.product2.r1),
                    g2: getRGBPercent(preference.product2.g1),
                    b2: getRGBPercent(preference.product2.b1)
                },
                output:{
                    matches: preference.matches ? 1 : 0
                }
            });
        });

        //build model
        const network = new brain.NeuralNetwork();
        if(trainingData.length === 0){
            sails.log("No training data to build neural network from...exiting.");
            //exit
            process.exit(0);
        } else {
            network.train(trainingData);

            //test all products against eachother to build suggestions
            let allSuggestions = [];
            let suggestionsDupTracker;
            let matchableProducts;
            products.forEach((product1) => {
                suggestionsDupTracker = {};
                product1.suggestions = [];
                matchableProducts = getMatchableProducts(product1.category);
                products.forEach((product2) => {
                    if(matchableProducts.indexOf(product2.category) > -1 && product1.id !== product2.id && !suggestionsDupTracker[product1.id + "_" + product2.id]){
                        let suggestion = runNetworkForProducts(network, product1, product2);
                        if(suggestion){
                            product1.suggestions.push(suggestion);
                            suggestionsDupTracker[product1.id + "_" + product2.id] = true;
                        }
                    }
                });
                //sort by match
                product1.suggestions = product1.suggestions.sort((a, b) => { //SOMETHING IS WRONG HERE
                    var aVal = a.matches;
                    var bVal = b.matches;
                    if (aVal > bVal) {
                        return -1;
                    }
                    if (aVal < bVal) {
                        return 1;
                    }
                    return 0;
                }).slice(0, 10);
                //add the top 10
                allSuggestions.push(product1.suggestions);
            });

            //save to the database
            Suggestion.destroy({ productId1: { '!=' : '_-!*!-_' } }).exec(function(err, savedProduct) {
                if (err) {
                    sails.log(err);
                } else {
                    sails.log("All suggestions deleted!");
                    allSuggestions.forEach((suggestionsSubset) => {
                        Suggestion.createEach(suggestionsSubset).exec(function(err, savedSuggestions) {
                            if (err) {
                                sails.log(err);
                            } else {
                                sails.log(savedSuggestions.length);
                            }
                        });
                    });
                }
            });
        }
    }).catch((err) => {
        sails.log(err);
    });
});
