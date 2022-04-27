const path = require('path');

module.exports = {
  entry: { auth : './src/js/auth.js', settings: './src/js/settings.js', replique: './src/js/replique.js', main: './src/js/socialbus.js', socialbus: './src/js/socialbus.js' },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'assets', 'js'),
  }
};

// module.exports = [{
//   entry: './src/js/auth.js',
//   devtool: 'source-map',
//   output: {
//     filename: 'auth.js',
//     path: path.resolve(__dirname, 'assets', 'js'),
//   },
//   entry: './src/js/settings.js',
//   devtool: 'source-map',
//   output: {
//     filename: 'settings.js',
//     path: path.resolve(__dirname, 'assets', 'js'),
//   },
//   entry: './src/js/replique.js',
//   devtool: 'source-map',
//   output: {
//     filename: 'replique.js',
//     path: path.resolve(__dirname, 'assets', 'js'),
//   },
//   entry: './src/js/main.js',
//   devtool: 'source-map',
//   output: {
//     filename: 'main.js',
//     path: path.resolve(__dirname, 'assets', 'js'),
//   },
// };