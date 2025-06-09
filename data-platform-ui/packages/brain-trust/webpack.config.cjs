const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
/**
 *
 * @type {import('webpack').Configuration}
 */
module.exports = {
  context: __dirname,
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    clean: true,
    library: {
      type: 'module',
    },
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/i, /.+\.spec\.ts$/i],
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: '3.21',
                  },
                ],
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, 'tsconfig.build.json'),
            },
          },
        ],
      },
    ],
  },
  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 400000,
  },
  plugins: [new NodePolyfillPlugin()],
};
