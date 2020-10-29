var pack = require('../package.json');
var _ = require('lodash');
var path = require('path');

var publicPath = '/server/build/';
var extensionClass = _.kebabCase(pack.name);

var webpackAppendQuery = {
  prepend: `.${extensionClass} {`,
  append: '}',
};

module.exports = {
  mode: 'production',
  entry: ['./src/index.js'],
  externals: {
    '@shoutem/redux-io': true,
    '@shoutem/react-web-ui': true,
    '@shoutem/web-core': true,
    classnames: true,
    context: true,
    environment: true,
    lodash: true,
    react: true,
    'prop-types': true,
    'react-bootstrap': true,
    'react-dom': true,
    'react-redux': true,
    redux: true,
    'redux-api-middleware': true,
    'redux-thunk': true,
    validator: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('cssnano')()],
            },
          },
          { loader: 'sass-loader' },
          {
            loader:
              '@shoutem/webpack-prepend-append?' +
              JSON.stringify(webpackAppendQuery),
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        use: [{ loader: 'url-loader' }],
      },
      {
        test: /\.svg(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name].[ext]',
              mimetype: 'image/svg+xml',
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  output: {
    libraryTarget: 'amd',
    path: path.resolve('./build'),
    filename: 'index.js',
    publicPath: publicPath,
  },
  resolve: {
    modules: [path.resolve('./src'), path.resolve('./node_modules')],
    extensions: ['*', '.js', '.jsx'],
  },
  devServer: {
    publicPath: publicPath,
    hot: false,
    historyApiFallback: true,
    https: true,
    port: 4790,
    stats: {
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      source: false,
    },
  },
};
