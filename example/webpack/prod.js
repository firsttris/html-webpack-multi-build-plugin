const base = require('./base'),
  merge = require('webpack-merge'),
  prodMode = process.env.build === 'prod',
  htmlWebpackMultiBuildPlugin = require('html-webpack-multi-build-plugin');

const prodConfig = {
  name: 'ProdConfig',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: prodMode ? 'tsconfig.json' : 'tsconfig.legacy.json',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new htmlWebpackMultiBuildPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

module.exports = merge(base, prodConfig);
