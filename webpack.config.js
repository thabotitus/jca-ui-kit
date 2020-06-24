const UglifyJsPlugin    = require('uglifyjs-webpack-plugin');
const path              = require('path');
const version  					= require('./package.json').version;

module.exports = {
  mode: 'development',
  entry: {
    'jca-ui-kit.min': "./src/js/app.js",
  },
  output: {
    filename: '[name].js',
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/,
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    })],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
              "@babel/preset-env"
          ],
        },
      },
    ],
  },
  // resolve: {
  //   alias: {
  //     jquery: path.resolve(__dirname, './src/js/jquery.js')
  //   }
  // }
};