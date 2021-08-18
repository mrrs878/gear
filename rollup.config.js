// @ts-check
import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
// import visualizer from 'rollup-plugin-visualizer';

const production = !process.env.ROLLUP_WATCH
const umd = process.env.UMD

const packages = fs.readdirSync(path.resolve(__dirname, 'packages'))

const configs = packages
  .map((key) => {

    const pkg = fs.readJsonSync(`./packages/${key}/package.json`)
    if (pkg.private) return []

    const inputFile = path.resolve('packages', key, 'lib/index.js')
    const umdName = key.startsWith('plugin-')
      ? _.camelCase(`mrrs878-${key}`)
      : 'mrrs878'

    /** @type {import('rollup').RollupOptions} */
    const common = {
      input: inputFile,
      plugins: [
        commonjs(),
        resolve({
          browser: true,
        }),
        json(),
        replace({
          preventAssignment: true, // fix warning
          'process.env.NODE_ENV': JSON.stringify(
            production ? 'production' : 'development'
          ),
        }),
      ],
      watch: {
        clearScreen: false,
      },
    }

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
        /^codemirror-ssr/,
        'hast-util-sanitize/lib/github.json',
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ],
    }

    /** @type {import('rollup').OutputOptions} */
    const umdOutputOption = {
      format: 'umd',
      name: umdName,
      sourcemap: true,
      inlineDynamicImports: true,
    }

    /** @type {import('rollup').RollupOptions} */
    const umdConfig = {
      ...common,
      output: [
        {
          ...umdOutputOption,
          file: path.resolve('packages', key, 'dist/index.js'),
        },
        {
          ...umdOutputOption,
          file: path.resolve('packages', key, 'dist/index.min.js'),
          plugins: [terser()],
        },
      ],
      external: Object.keys(pkg.peerDependencies || {}),
    }

    /** @type {import('rollup').RollupOptions} */
    const es5Config = {
      ...common,
      input: path.resolve('packages', key, 'lib/index.js'),
      output: [
        {
          ...umdOutputOption,
          file: path.resolve('packages', key, 'dist/index.es5.js'),
        },
        {
          ...umdOutputOption,
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
      ],
    }

    // return [es5Config];

    if (umd) {
      return [config, umdConfig, es5Config]
    } else {
      return [config]
    }
  })
  .flat()

export default configs
