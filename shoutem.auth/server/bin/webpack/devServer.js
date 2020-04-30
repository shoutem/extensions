const isProduction = require('./env');

function resolveDevServer() {
  return {
    contentBase: isProduction ? './build' : './src',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    historyApiFallback: true,
    port: 4790,
    compress: isProduction,
    inline: !isProduction,
    disableHostCheck: true,
    hot: !isProduction,
    host: '0.0.0.0',
    https: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
    },
  };
}

exports = module.exports = resolveDevServer;
