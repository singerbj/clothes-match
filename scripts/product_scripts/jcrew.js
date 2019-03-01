const request = require('request');
const rp = require('request-promise');
const q = require('q');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
var Vibrant = require('node-vibrant');
var sails = require('sails');

var storeKey = 'jcrew';

var rootDir = __dirname + '/../../assets/';
var imagesRootDir = __dirname + '/../../assets/images/';
var dataRootDir = __dirname + '/../../assets/data/';
var imagesDir = __dirname + '/../../assets/images/' + storeKey + '/';
var resultsDir = __dirname + '/../../assets/data/' + storeKey + '/';

[rootDir, imagesRootDir, dataRootDir, imagesDir, resultsDir].forEach((dir) => {
    if (!fs.existsSync(dir)){
        console.log("creating dir: " + dir);
        fs.mkdirSync(dir);
    } else {
        console.log("already created dir: " + dir);
    }
});

var showError = (err) => {
    console.log(err);
    console.trace();
};

var getRandomInt = (min, max) => {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

var download = (uri, filename) => {
    var deferred = q.defer();
    console.log("Downloading: " + uri);
    if (!fs.existsSync(filename)){
        request.head(uri, function(err, res, body){
            if(err){
                showError(err);
            }
            request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
                console.log("Downloaded: " + uri);
                deferred.resolve();
            }).on('error', (err) => {
                deferred.reject(err);
            });
        });
    } else {
        console.log("Already Downloaded: " + uri);
        deferred.resolve();
    }
    return deferred.promise;
};

var replaceBackground = (fileName, imageFilenameP) => {
    var deferred = q.defer();
    try {
        console.log("loading image: " + fileName);
        loadImage(fileName).then((image) => {
            const canvas = createCanvas(400, 400);
            ctx = canvas.getContext("2d"),
            ctx.drawImage(image, 0, 0);
            var imgd = ctx.getImageData(0, 0, 400, 400),
            pix = imgd.data,
            newColor = {r: 0, g: 0, b: 0, a: 0};

            for (var i = 0, n = pix.length; i <n; i += 4) {
                var r = pix[i],
                g = pix[i+1],
                b = pix[i+2];

                // if(r >= 242 && g >= 242 && b >= 242){
                if((r + g + b) >= 720){
                    pix[i] = newColor.r;
                    pix[i+1] = newColor.g;
                    pix[i+2] = newColor.b;
                    pix[i+3] = newColor.a;
                }
            }
            ctx.putImageData(imgd, 0, 0);

            const out = fs.createWriteStream(imageFilenameP);
            out.on('finish', () => deferred.resolve());
            out.on('error', (error) =>  deferred.reject(error));
            const stream = canvas.createPNGStream();
            stream.pipe(out).on('close', () => {
                deferred.resolve();
            }).on('error', (err) => {
                deferred.reject(err);
            });
        }).catch((err) => {
            showError(err);
            deferred.reject(rr);
        });
    } catch (err) {
        deferred.reject();
        showError(err);
    }
    return deferred.promise;
};

var processImage = (product) => {
    var deferred = q.defer();
    replaceBackground(product.imageFilename, product.imageFilenameP).then(() => {
        Vibrant.from(product.imageFilenameP).getPalette((err, palette) => {
            var colors = [];
            if(err){
                deferred.reject(err);
            } else {
                if(palette.Vibrant){
                    colors.push(palette.Vibrant._rgb.concat(palette.Vibrant._population));
                }
                if(palette.LightVibrant){
                    colors.push(palette.LightVibrant._rgb.concat(palette.LightVibrant._population));
                }
                if(palette.DarkVibrant){
                    colors.push(palette.DarkVibrant._rgb.concat(palette.DarkVibrant._population));
                }
                if(palette.Muted){
                    colors.push(palette.Muted._rgb.concat(palette.Muted._population));
                }
                if(palette.LightMuted){
                    colors.push(palette.LightMuted._rgb.concat(palette.LightMuted._population));
                }
                if(palette.DarkMuted){
                    colors.push(palette.DarkMuted._rgb.concat(palette.DarkMuted._population));
                }
                colors = colors.sort((a, b) => a[3] < b[3]).map((a) => a.splice(0, 3));
            }
            product.colors = colors;
            product.r1 = colors && colors[0] ? parseFloat(colors[0][0]) : -1;
            product.r2 = colors && colors[1] ? parseFloat(colors[1][0]) : -1;
            product.r3 = colors && colors[2] ? parseFloat(colors[2][0]) : -1;
            product.g1 = colors && colors[0] ? parseFloat(colors[0][1]) : -1;
            product.g2 = colors && colors[1] ? parseFloat(colors[1][1]) : -1;
            product.g3 = colors && colors[2] ? parseFloat(colors[2][1]) : -1;
            product.b1 = colors && colors[0] ? parseFloat(colors[0][2]) : -1;
            product.b2 = colors && colors[1] ? parseFloat(colors[1][2]) : -1;
            product.b3 = colors && colors[2] ? parseFloat(colors[2][2]) : -1;
            deferred.resolve(colors);
        });
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

var categories = ['shirts', 'tees_henleys', 'polos', 'sweaters', 'denim_sm', 'pants', 'shorts'];
var productsObj = {};
var productPromises = [];

categories.forEach((category) => {
    productsObj[category] = [];
    var promise = rp('https://factory.jcrew.com/data/v1/US/enhance-category/mens-clothing/' + category + '?Nloc=en&Npge=1&Nrpp=999999').then((data) => {
        var parsedData = JSON.parse(data);
        var dupTracker = {};
        parsedData.productList.forEach((productSubCategory) => {
            productSubCategory.products.forEach((product) => {
                product.colors.forEach((color) => {
                    var productData = {
                        id: product.productCode + "_" + color.colorCode,
                        description: product.productDescription,
                        url: product.productDescription,
                        imageFilename: imagesDir + product.productCode + "_" + color.colorCode + ".png",
                        imageFilenameP: imagesDir + product.productCode + "_" + color.colorCode + "_p.png",
                        imageUrl: "https://factory.jcrew.com/s7-img-facade/" + product.productCode + "_" + color.colorCode + "?fmt=png&qlt=90,0&resMode=sharp&op_usm=.1,0,0,0&wid=400&hei=400",
                        price: product.listPrice.amount,
                        colors: []
                    };
                    if(!dupTracker[productData.imageFilename] && !dupTracker[productData.id]){
                        dupTracker[productData.imageFilename] = true;
                        dupTracker[productData.id] = true;
                        productsObj[category].push(productData);
                    } else {
                        console.log("Duplicate product found: " + productData.imageFilename);
                    }
                });
            });
        });
    }).catch((err) => showError(err));
    productPromises.push(promise);
});

q.all(productPromises).then(() => {
    var imageDownloadPromises = [];
    Object.keys(productsObj).forEach((category) => {
        productsObj[category].forEach((product) => {
            imageDownloadPromises.push(download(product.imageUrl, product.imageFilename));
        });
    });
    q.all(imageDownloadPromises).then(() =>{
        var imageProcessPromises = [];
        Object.keys(productsObj).forEach((category) => {
            productsObj[category].forEach((product) => {
                console.log("Processing: " + product.imageFilename);
                imageProcessPromises.push(processImage(product));
            });
        });
        q.all(imageProcessPromises).then(() => {
            sails.load(function(err) {
                if (err) {
                    console.log('Error occurred loading Sails app:', err);
                    return;
                }
                Object.keys(productsObj).forEach((category) => {
                    console.log("Writing category to db: " + category);
                    Product.createEach(productsObj[category].map((product) => {
                        return {
                            ...product,
                            category: category,
                            store: storeKey
                        };
                    })).exec(function(err, savedProduct) {
            			if (err) {
            				console.log(err);
            			} else {
            				console.log("Product saved:" + savedProduct.description);
            			}
            		});
                });
            });
            fs.writeFile(resultsDir + 'jcrew.json', JSON.stringify(productsObj), 'utf8', () => console.log("All Done!"));
        }).catch((err) => showError(err));
    }).catch((err) => showError(err));
}).catch((err) => showError(err));
