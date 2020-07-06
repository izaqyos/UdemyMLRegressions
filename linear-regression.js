const tf = require('@tensorflow/tfjs'); //tensor flow node lib
const _ = require('lodash');

class LinearRegression {

    constructor (features, labels, options) {
        this.weights = tf.zeros([2,1]);
        this.features = this.processFeatures(features);
        this.labels = tf.tensor(labels);

        this.options = Object.assign({
             learningRate: 0.0001,
             iterations: 1000
            }, options);

    }

// single Gradient-Descent iteration and update m,b
    gradientDescent() {
        this.gradientDescentTF(); 
    }

    ////Slow impl. using arrays, only works when members are arrays
    //gradientDescentArrays() {
    //    const predictions = this.features.map(row => {
    //        return this.m*row[0] + this.b;
    //    });

    //    //calc b and m slopes
    //    const bDerivative = _.sum(predictions.map( (pred, i) => {
    //        return pred - this.labels[i][0]; 
    //    })) *2 / this.features.length; 

    //    const mDerivative = _.sum(predictions.map( (pred, i) => {
    //        return -1 * this.features[i][0] *( this.labels[i][0] - pred ); 
    //    })) *2 / this.features.length; 

    //    //mult by learning-rate
    //    this.m = this.m - mDerivative*this.options.learningRate;
    //    this.b = this.b - bDerivative*this.options.learningRate;
    //};

    //Fast impl. using tensorflow
    gradientDescentTF() {
        const currentGuesses = this.features.matMul(this.weights);
        const diffs = currentGuesses.sub(this.labels);

        const gradients = this.features
        .transpose()
        .matMul(diffs)
        .div(this.features.shape[0]);

        // ToDo, uncomment once issue is fixed
        this.weights = this.weights.sub(gradients.mul(this.options.learningRate));

        // // Issue demo
        // this.weights.sub(gradients.mul(this.options.learningRate)).print(); // prints "good" values
        // const newW = this.weights.sub(gradients.mul(this.options.learningRate));
        // newW.print(); //prints "good" values
        // // console.log(newW.shape);
        // // Actual issue in next line
        // // this.weights = newW; //This line when not commented changes weights to NaN [2,1] tensor
    }

// iterate gradientDescent() until optimal m,b
    train() {

        for (let index = 0; index < this.options.iterations; index++) {
            this.gradientDescent(); 
        }
    }

// use test set to evalualte the accuracy of m,b
    test( testFeatures, testLabels) {
        testFeatures = this.processFeatures(testFeatures);
        testLabels = tf.tensor(testLabels);

        const predictions = testFeatures.matMul(this.weights);
        predictions.print();

        const SSres = testLabels.sub(predictions)
        .pow(2)
        .sum()
        .get();

        const SStot = testLabels.sub(testLabels.mean())
        .pow(2)
        .sum()
        .get();

        //coefficient of determination
        const Rsquare = 1 - SSres / SStot;
        return Rsquare; 
    } 

// make a prediction using m,b
    predict(){

    } 

    processFeatures( features) {
        features = tf.tensor(features);

        if (this.mean && this.variance) {
            features = features.sub(this.mean).div(this.variance.pow(0.5));
        }
        else {
            features = this.stdandardize(features);
        }
        features = tf.ones([features.shape[0], 1]).concat(features, 1);
        return features;
    }

    stdandardize(features) {
        const {mean, variance } = tf.moments(features, 0);
        this.mean = mean;
        this.variance = variance;

        return features.sub(this.mean).div(this.variance.pow(0.5));
    }
}

module.exports = LinearRegression;
