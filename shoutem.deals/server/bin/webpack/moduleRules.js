const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = require('./env');

function resolveModuleRules() {
  const jsRule = {
    test: /\.(js|jsx)$/,
    use: { loader: 'babel-loader' },
  };

  const styleRules = [
    {
      test: /\.css$/,
      use: [
        !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
        { loader: 'css-loader' },
      ],
    },
    {
      test: /\.scss$/,
      use: [
        !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: !isProduction,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            // eslint-disable-next-line global-require
            plugins: [require('cssnano')()],
            sourceMap: !isProduction,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: !isProduction,
          },
        },
      ],
    },
  ];

  const imgRules = [
    {
      test: /\.(png|gif|jpg|svg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
  ];

  const fontRules = [
    {
      test: /\.woff(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]',
            mimetype: 'application/font-woff',
            limit: 10000,
          },
        },
      ],
    },
    {
      test: /\.woff2(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]',
            mimetype: 'application/font-woff2',
            limit: 10000,
          },
        },
      ],
    },
    {
      test: /\.otf(\?.*)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            mimetype: 'font/opentype',
            limit: 10000,
          },
        },
      ],
    },
    {
      test: /\.ttf(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]',
            mimetype: 'application/octet-stream',
            limit: 10000,
          },
        },
      ],
    },
    {
      test: /\.eot(\?.*)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      ],
    },
  ];

  return [jsRule, ...styleRules, ...fontRules, ...imgRules];
}

module.exports = resolveModuleRules;
