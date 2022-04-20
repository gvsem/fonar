const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  devtool: 'source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'assets', 'js'),
  },
};