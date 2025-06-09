const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { mergeWithRules } = require('webpack-merge');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { makeTsxExclude } = require('../webpack.common');

function getPlugins(devMode = false) {
  let globalNodeEnv = 'production';
  let globalBasePath = '/catalog';

  if (devMode === true) {
    globalNodeEnv = 'development';
    globalBasePath = '/';
  }

  return [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      templateContent: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>NLSS | Data Catalog</title>
        </head>
        <body>
          <div id="root"></div>
          <div id="nlss-form-modal-root"></div>
          <div id="nlss-modal-root"></div>
        </body>
        </html>
        `
    }),
    new webpack.DefinePlugin({
      ROUTER_BASE_PATH: JSON.stringify(globalBasePath),
      'process.env.NODE_ENV': JSON.stringify(globalNodeEnv)
    })
  ];
}
/**
 *
 * @type {import('webpack').Configuration}
 */
const commonConfig = {
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '../../dist/catalog'),
    filename: '[name].[chunkhash].js',
    clean: true
  },
  resolve: {
    mainFields: ['jsnext:main', 'module', 'browser', 'main'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        include: path.join(__dirname, 'src'),
        exclude: makeTsxExclude(),
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward'
            }
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000
  }
};

const developmentConfig = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      include: 'replace',
      use: {
        loader: 'match',
        options: 'replace'
      }
    }
  },
  resolve: {
    alias: 'merge'
  }
})(commonConfig, {
  mode: 'development',
  output: {
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@nlss/brain-trust': path.join(__dirname, '../brain-trust/src/index.ts')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        include: [path.join(__dirname, '../brain-trust/src'), path.join(__dirname, 'src')],
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, 'tsconfig.json')
            }
          }
        ]
      }
    ]
  },
  devtool: 'inline-cheap-module-source-map',
  devServer: {
    hot: true,
    port: 4000,
    proxy: {
      '/api': 'http://localhost:9123',
      '/bsso': 'http://localhost:9123'
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    watchFiles: {
      paths: ['src/**/*', '../brain-trust/src/**/*'],
      options: {
        ignored: /\.spec\.tsx?$/i
      }
    },
    historyApiFallback: true
  }
});

developmentConfig.plugins = getPlugins(true);

const productionConfig = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: {
        loader: 'match',
        options: 'replace'
      }
    }
  }
})(commonConfig, {
  mode: 'production',
  output: {
    publicPath: '/catalog'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, 'tsconfig.build.json')
            }
          }
        ]
      }
    ]
  },
  optimization: {
    usedExports: true,
    minimize: true
  }
});
productionConfig.plugins = getPlugins();

const isDevServer = Boolean(process.env.WEBPACK_SERVE);

if (isDevServer) {
  module.exports = developmentConfig;
} else {
  module.exports = productionConfig;
}
