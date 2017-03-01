/* jshint: node */
const path = require('path');

const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const ENV = process.env.NODE_ENV || 'development';

const plugins = [

];
if (ENV === 'production') {
  plugins.push(new UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false
    },
    mangle: {
      screw_ie8: true
    },
    output: {
      comments: false,
      screw_ie8: true
    }
  }));
}

module.exports = {
  devtool: 'source-map',
  entry: {
    app: './AdminModals.js'
  },
  devServer: {
    historyApiFallback: true,
    port: 3000
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../', 'dist/'),
    filename: (ENV === 'production' ? '[name].bundle.min.js' : '[name].bundle.js'),
    publicPath: '/'
  },
  plugins
};