const path = require('path');
const resolvePlugins = require('./plugins');
const resolveModuleRules = require('./moduleRules');
const resolveDevServer = require('./devServer');
const resolveOptimizations = require('./optimizations');
const isProduction = require('./env');

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'false' : '#source-maps',
  context: path.join(__dirname, '../../'),
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
  optimization: resolveOptimizations(),
  resolve: {
    modules: [path.join(__dirname, '../..'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css', '.sass', '.scss', '.html'],
  },
  devServer: resolveDevServer(),
};
