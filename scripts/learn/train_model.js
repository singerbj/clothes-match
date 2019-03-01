const sails = require('sails');
const q = require('q');
const brain = require("brain.js");

const getRGBPercent = (rgbVal) => {
    return rgbVal / 255;
};

sails.load(function(err) {
    if (err) {
        console.log('Error occurred loading Sails app:', err);
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
                    matches: preference.like ? 1 : 0
                }
            });
        });

        //build model
        const network = new brain.NeuralNetwork();
        network.train(trainingData);

        //test on first training data
        let result = network.run(trainingData[0].input);
        sails.log(trainingData[0].output.matches, result);

    }).catch((err) => {
        sails.log(err);
    });
});
