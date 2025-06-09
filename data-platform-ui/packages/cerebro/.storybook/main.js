const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const tsLoaderConfig = Object.seal({
  loader: 'ts-loader',
  options: {
    configFile: path.join(__dirname, '../tsconfig.json'),
    compilerOptions: {
      allowJs: true
    }
  }
});

module.exports = {
  stories: ['../src/**/*.stories.*'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5'
  },
  logLevel: 'debug',
  features: { babelModeV7: true, modernInlineRender: true, buildStoriesJson: true },
  /**
   *
   * @param {webpack.Configuration} config
   * @returns {Promise<*>}
   */
  managerWebpack: async config => {
    config.resolve.alias['@nlss/brain-trust'] = path.join(__dirname, '../brain-trust/src/index.ts');

    return config;
  },
  /**
   *
   * @param {webpack.Configuration} config
   * @returns {Promise<*>}
   */
  webpackFinal: async config => {
    config.resolve.alias['@nlss/brain-trust'] = path.join(__dirname, '../../brain-trust/src/index.ts');
    config.resolve.alias['story-utils'] = path.join(__dirname, '../src/story-utils.tsx');

    config.module.rules[0] = {
      test: config.module.rules[0].test,
      include: [
        path.join(__dirname, '../../brain-trust/src'),
        path.join(__dirname, '../src'),
        path.join(__dirname, 'preview.tsx')
      ],
      exclude: [/node_modules/i, /\.spec\.tsx?/i],
      use: [
        {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward'
          }
        },
        tsLoaderConfig
      ]
    };

    config.module.rules[4] = {
      ...config.module.rules[4],
      use: [...config.module.rules[4].use, tsLoaderConfig]
    };
    config.plugins.push(new NodePolyfillPlugin());

    return config;
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: false
  },
  babel: async options => ({
    ...options,
    rootMode: 'upward'
  })
};
