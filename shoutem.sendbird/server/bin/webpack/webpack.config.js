const path = require('path');
const resolvePlugins = require('./plugins');
const resolveModuleRules = require('./moduleRules');
const resolveDevServer = require('./devServer');
const resolveOptimizations = require('./optimizations');
const isProduction = require('./env');

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'false' : '#source-maps',
  entry: {
    extension: './bin/main.js',
  },
  output: {
    path: path.join(__dirname, '../../build'),
    filename: '[name].[hash].js',
    publicPath: '',
  },
  module: {
    rules: resolveModuleRules(),
  },
  plugins: resolvePlugins(),
  resolve: {
    modules: [
      path.join(__dirname, '../../src'),
      './node_modules',
    ],
    extensions: ['*', '.js', '.jsx'],
  },
  optimization: resolveOptimizations(),
  devServer: resolveDevServer(),
};
