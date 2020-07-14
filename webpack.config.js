import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as path from 'path';
import webpack from 'webpack';

export const WEBPACK_CONFIG = {
  mode: 'development',
  entry: {
    'jca-ui-kit.min': "./src/js/main.js",
    'custom.min': "./src/js/custom.js"
  },
  output: {
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
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
        test: /\.(js|jsx|esm)$/,
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
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      Popper: "@popperjs/core/dist/umd/popper.js"
    })
  ],
  resolve: {
    alias: {
      "popper.js": path.resolve('', 'node_modules/@popperjs/core'),
      "datatables.net": path.resolve('', 'node_modules/datatables.net/js/jquery.dataTables.js'),
      "./clipboard": path.resolve('', 'node_modules/clipboard/dist/clipboard.min.js')
    }
  }
};