const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = require('./env');

function resolvePlugins() {
  const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: '[name].css?q=[contenthash]',
    allChunks: true,
  });

  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: './bin/index.html',
    path: './build',
    filename: 'index.html',
  });

  const occurrenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();

  const hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();

  const nodeEnv = new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  });

  if (isProduction) {
    return [
      nodeEnv,
      htmlWebpackPlugin,
      occurrenceOrderPlugin,
      miniCssExtractPlugin,
    ];
  }

  return [htmlWebpackPlugin, hotModuleReplacementPlugin, occurrenceOrderPlugin];
}

module.exports = resolvePlugins;
