const path = require('path'),
  merge = require('webpack-merge'),
  htmlWebpackPlugin = require('html-webpack-plugin'),
  cleanWebpackPlugin = require('clean-webpack-plugin'),
  devMode = process.env.build === 'dev',
  multiBuildMode = process.env.build === 'multi',
  legacyMode = process.env.legacy === 'true',
  legacyConfig = require('./legacyConfig');

const template = multiBuildMode ? require.resolve('html-webpack-multi-build-plugin/template.ejs') : require.resolve('html-webpack-plugin/default_index.ejs');

const base = {
  target: 'web',
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new htmlWebpackPlugin(
      {
        inject: !multiBuildMode,
        template
      }
    )
  ]
};


if (!devMode) {
  base.plugins.push(
    new cleanWebpackPlugin(['dist'], { root: __dirname + '/..' })
  );
}

if (legacyMode) {
  module.exports = merge(base, legacyConfig);
} else {
  module.exports = base;
}
