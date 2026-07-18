module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: { '@': './src' },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      // Must stay last in the plugins list — required by React Navigation's
      // material top tabs (v7), which uses Reanimated under the hood.
      'react-native-reanimated/plugin',
    ],
  };
};
