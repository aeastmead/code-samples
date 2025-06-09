const path = require('path');
const { makeTsxExclude } = require('../webpack.common');

/**
 *
 * @type {import('webpack').Configuration}
 */
module.exports = {
  context: __dirname,
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    clean: true,
    library: {
      type: 'module'
    },
    libraryTarget: 'commonjs2',
    publicPath: '/cerebro/',
    assetModuleFilename: '[hash][ext][query]'
  },
  resolve: {
    mainFields: ['jsnext:main', 'module', 'browser', 'main'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css']
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    },
    'styled-components': 'styled-components',
    '@bbnpm/bb-ui-framework': '@bbnpm/bb-ui-framework',
    'react-router-dom': 'react-router-dom',
    'react-router': 'react-router',
    history: 'history',
    '@nlss/brain-trust': '@nlss/brain-trust'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: makeTsxExclude(),
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward'
            }
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, 'tsconfig.build.json')
            }
          }
        ]
      },
      {
        test: /\.(png|jpg)$/i,
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/i,
        type: 'asset/resource'
      },
      {
        test: /\.svg$/i,
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/i,
        type: 'asset/inline'
      }
    ]
  },
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000
  }
};
