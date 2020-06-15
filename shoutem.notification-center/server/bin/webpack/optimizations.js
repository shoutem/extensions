const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function resolveOptimizations() {
  return {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'app',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          }
        }
      }),
    ],
  };
}

module.exports = resolveOptimizations;
