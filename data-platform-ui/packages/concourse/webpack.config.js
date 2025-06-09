/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { mergeWithRules } = require('webpack-merge');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const { getResolveAliases, makeTsxExclude } = require('../webpack.common');

/**
 *
 * @type {import('webpack').Configuration}
 */
const commonConfig = {
  context: __dirname,
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '../../dist/concourse'),
    filename: '[name].[chunkhash].js',
    clean: true,
  },
  resolve: {
    mainFields: ['jsnext:main', 'main', 'module', 'browser'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
    fallback: {
      fs: false,
      encoding: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, 'src'),
        exclude: makeTsxExclude(),
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|jpg|svg)$/,

        type: 'asset/inline',
      },
    ],
  },
  performance: {
    maxEntrypointSize: 3000000,
    maxAssetSize: 3000000,
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      templateContent: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>NLSS | Home</title>
        </head>
        <body>
          <div id="root"></div>
        </body>
        </html>
        `,
    }),
  ],
};

commonConfig.resolve.alias = getResolveAliases(__dirname, {});

const developmentConfig = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      include: 'replace',
      use: {
        loader: 'match',
        options: 'replace',
      },
    },
  },
  resolve: {
    alias: 'merge',
  },
})(commonConfig, {
  mode: 'development',
  resolve: {
    alias: {
      '@nlss/cerebro': path.join(__dirname, '../cerebro/src/index.tsx'),
      '@nlss/brain-trust': path.join(__dirname, '../brain-trust/src/index.ts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.join(__dirname, '../brain-trust/src'),
          path.join(__dirname, '../cerebro/src'),
          path.join(__dirname, 'src'),
        ],
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
    ],
  },
  devtool: 'inline-cheap-source-map',
  devServer: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:9123',
      '/bsso': 'http://localhost:9123',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    hot: true,
    historyApiFallback: true,
    watchFiles: {
      paths: ['src/**/*', '../cerebro/src/**/*', '../brain-trust/src/**/*'],
      options: {
        ignored: /\.spec\.[tj]sx?$/i,
      },
    },
  },
});

const productionConfig = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: {
        loader: 'match',
        options: 'replace',
      },
    },
  },
})(commonConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
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
});

const isDevServer = Boolean(process.env.WEBPACK_SERVE);

if (isDevServer) {
  module.exports = developmentConfig;
} else {
  module.exports = productionConfig;
}
