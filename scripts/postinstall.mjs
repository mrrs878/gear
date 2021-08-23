/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import fs from 'fs-extra';
import path from 'path';
import mustache from 'mustache';
import _ from 'lodash';
// @ts-ignore
import { rootDir } from './utils.mjs';

function readFileSyncSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (err) {
    return '';
  }
}

const packagesDir = path.join(rootDir, 'packages');
const packages = fs.readdirSync(packagesDir);
const plugins = packages.filter(
  (x) => x.startsWith('plugin-') && !x.includes('-transform'),
);

// tsconfig root
fs.writeJsonSync(
  path.resolve(rootDir, 'tsconfig.json'),
  {
    files: [],
    references: packages.map((p) => ({ path: `packages/${p}` })),
  },
  { spaces: 2 },
);

packages.forEach((p) => {
  // tsconfig
  const tsconfig = {
    extends: '../../tsconfig-base.json',
    include: ['src', 'src/**/*.json'], // https://github.com/microsoft/TypeScript/issues/25636#issuecomment-627111031
    compilerOptions: {
      composite: true,
      rootDir: 'src',
      outDir: 'lib',
    },
  };
  // if (p !== 'mrrs78') {
  //   tsconfig.references = [{ path: '../mrrs78' }]
  // }

  fs.writeJsonSync(path.join(packagesDir, p, 'tsconfig.json'), tsconfig, {
    spaces: 2,
  });

  // license
  fs.copyFileSync(
    path.join(rootDir, 'LICENSE'),
    path.join(packagesDir, p, 'LICENSE'),
  );

  // package.json
  const pkgPath = path.join(packagesDir, p, 'package.json');
  const pkg = fs.readJsonSync(pkgPath);
  pkg.repository = {
    type: 'git',
    url: 'https://github.com/mrrs878/gear.git',
    directory: `packages/${p}`,
  };
  pkg.main = 'dist/index.cjs.js';
  pkg.module = 'dist/index.esm.js';
  pkg.types = 'lib/index.d.ts';
  pkg.unpkg = 'dist/index.min.js';
  pkg.jsdelivr = 'dist/index.min.js';
  pkg.files = ['dist', 'lib'];
  pkg.homepage = 'https://github.com/mrrs878/gear#readme';
  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
});

// plugins readme
plugins.forEach((p) => {
  const name = p.split('-').slice(1).join('-');
  const result = mustache.render(
    readFileSyncSafe(path.join(rootDir, 'scripts/plugin-template.md')),
    {
      name,
      importedName: _.camelCase(name.replace('-ssr', '')),
      desc: fs.readJsonSync(path.join(packagesDir, p, 'package.json'))
        .description,
    },
  );
  fs.writeFileSync(path.join(packagesDir, p, 'README.md'), result);
});

// gear readme
const readme = readFileSyncSafe(path.join(rootDir, 'README.md')).replace(
  /## Plugins\s+([\w\W])*?\s+##/,
  () => {
    const content = plugins
      .map((p) => {
        const pkg = fs.readJsonSync(path.join(packagesDir, p, 'package.json'));
        if (pkg.private) return;

        const name = p.split('-').slice(1).join('-');
        const badge = `[![npm](https://img.shields.io/npm/v/@gear/plugin-${name}.svg)](https://npm.im/@gear/plugin-${name})`
          + ' '
          + `[![gzip size](https://img.badgesize.io/https://unpkg.com/@gear/plugin-${name}/dist/index.min.js?compression=gzip)](https://unpkg.com/@gear/plugin-${name})`;
        const desc = _.upperFirst(
          pkg.description.replace('ByteMD plugin to ', ''),
        );
        // eslint-disable-next-line consistent-return
        return `| [@gear/plugin-${name}](./packages/plugin-${name}) | ${badge} | ${desc} |`;
      })
      .filter((x) => x)
      .join('\n');

    return `## Plugins

| Package | Status | Description |
| --- | --- | --- |
${content}

##`;
  },
);

if (!readFileSyncSafe(path.join(rootDir, 'README.md'))) {
  fs.writeFileSync(path.join(rootDir, 'README.md'), readme);
}

// locales
let importCode = '';
const exportObject = {};
packages.forEach((p) => {
  const localeDir = path.join(packagesDir, p, 'src/locales');
  if (fs.existsSync(localeDir) && fs.lstatSync(localeDir).isDirectory()) {
    const locales = fs.readdirSync(localeDir).map((x) => x.replace('.json', ''));
    const libName = p.startsWith('plugin') ? `@mrrs878/${p}` : p;

    locales.forEach((l) => {
      if (!exportObject[l]) exportObject[l] = {};

      const varName = _.snakeCase(`${l}-${p}`);

      importCode += `import ${varName} from '${libName}/lib/locales/${l}';\n`;
      exportObject[l][_.snakeCase(p)] = varName;
    });
  }
});
