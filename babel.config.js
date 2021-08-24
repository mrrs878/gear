/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-18 20:47:59
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-24 20:30:51
 * @FilePath: \gear\babel.config.js
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: { ie: 9 },
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { node: true },
          },
        ],
      ],
    },
  },
};
