// @ts-check
import fs from 'fs-extra';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const production = !process.env.ROLLUP_WATCH;

const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));

const configs = packages
  .map((key) => {
    const pkg = fs.readJsonSync(`./packages/${key}/package.json`);
    if (pkg.private) return [];

    const inputFile = path.resolve('packages', key, 'lib/index.js');

    /** @type {import('rollup').RollupOptions} */
    const common = {
      input: inputFile,
      plugins: [
        commonjs(),
        resolve({
          browser: true,
          preferBuiltins: false,
        }),
        json(),
        replace({
          preventAssignment: true, // fix warning
          'process.env.NODE_ENV': JSON.stringify(
            production ? 'production' : 'development',
          ),
        }),
        postcss({
          extract: true,
        }),
      ],
      watch: {
        clearScreen: false,
      },
    };

    /** @type {import('rollup').RollupOptions} */
    const config = {
      ...common,
      output: [
        {
          format: 'es',
          sourcemap: true,
          file: path.resolve('packages', key, pkg.module),
        },
        {
          format: 'cjs',
          sourcemap: true,
          file: path.resolve('packages', key, pkg.main),
          exports: 'auto', // fix warning
        },
      ],
      external: [
        'fs',
        'event',
        'readline',
        'assert',
        'path',
        'util',
        'stream',
        'constants',
        'events',
        'ora',
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ],
    };

    /** @type {import('rollup').OutputOptions} */
    const es5OutputOption = {
      format: 'cjs',
      // name: umdName,
      sourcemap: true,
      globals: { react: 'react' },
      inlineDynamicImports: true,
    };

    /** @type {import('rollup').RollupOptions} */
    const es5Config = {
      ...common,
      input: path.resolve('packages', key, 'lib/index.js'),
      output: [
        {
          ...es5OutputOption,
          file: path.resolve('packages', key, 'dist/index.es5.js'),
        },
        {
          ...es5OutputOption,
          file: path.resolve('packages', key, 'dist/index.es5.min.js'),
          plugins: [terser()],
        },
      ],
      plugins: [
        ...common.plugins,
        babel({
          babelHelpers: 'runtime',
          extensions: ['.js', '.mjs', '.html'],
        }),
        nodePolyfills(),
      ],
    };

    return [config, es5Config];
  })
  .flat();

const styleConfigs = [
  {
    input: 'packages/sliding-puzzle/src/dom/index.css',
    output: {
      file: 'style.js', // We don't need this file
    },
    plugins: [
      postcss({
        extract: path.resolve(__dirname, 'packages/sliding-puzzle/dist/index.css'),
        minimize: production,
      }),
    ],
  },
  {
    input: 'packages/tabbar/src/index.css',
    output: {
      file: 'style.js', // We don't need this file
    },
    plugins: [
      postcss({
        extract: path.resolve(__dirname, 'packages/tabbar/dist/index.css'),
        minimize: production,
      }),
    ],
  },
];

export default [...styleConfigs, ...configs];
