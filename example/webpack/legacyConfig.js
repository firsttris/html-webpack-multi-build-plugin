const path = require('path'),
  packageJson = require(path.resolve(process.cwd(), 'package.json')),
  packageName = packageJson.name.replace(/@/, '-').replace(/\//, '-'),
  devMode = process.env.build === 'dev';

const legacyConfig = {
  name: 'LegacyConfig',
  entry: {
    app: ['babel-polyfill', './src/index.tsx'],
  },
  output: {
    filename: '[name]_legacy.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  'env',
                  {
                    modules: false,
                    useBuiltIns: true,
                    targets: {
                      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie >= 11'],
                    },
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
};

module.exports = legacyConfig;
