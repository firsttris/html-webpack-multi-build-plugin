const base = require('./base'),
  merge = require('webpack-merge'),
  webpack = require('webpack'),
  forkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'),
  legacyMode = process.env.legacy === 'true';

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              plugins: ['react-hot-loader/babel'],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: legacyMode ? 'tsconfig.legacy.json' : 'tsconfig.json',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new forkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true,
    https: false,
  },
};

module.exports = merge(base, devConfig);
