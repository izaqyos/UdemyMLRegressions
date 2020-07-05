require('@tensorflow/tfjs-node'); //CPU tf, GPU only supported on linux
const tf = require('@tensorflow/tfjs'); //tensor flow node lib
const linearReg = require('./linear-regression');

const loadCSV = require('./load-csv');
const LinearRegression = require('./linear-regression');

let {features, labels, testFeatures, testLabels } = loadCSV('./cars.csv', {
    shuffle: true,
    splitTest: 50,
    dataColumns: ['horsepower'],
    labelColumns: ['mpg']
});

console.log(features, labels);

const regression = new LinearRegression(features, labels, {
    learningRate: 0.001,
    iterations: 100 
});

regression.train();
const r2 = regression.test(testFeatures, testLabels);

// console.log('m: ', regression.m);
// console.log('b: ', regression.b);

//console.log('m: ', regression.weights.get(1,0));
//console.log('b: ',  regression.weights.get(0,0));

console.log('r2', r2);

// console.log('test assignment');
// const ones = tf.ones([3,1]);
// console.log('ones ');
// ones.print();
// const onescp = ones;
// console.log('ones copy ');
// onescp.print();
