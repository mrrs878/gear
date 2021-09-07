/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-07 19:55:59
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-07 21:59:03
 * @FilePath: \gear\packages\cli\src\cli.ts
 */
import program from 'commander';
import path from 'path';
import fs from 'fs';

const pkg = require('../package.json');

function bootstrap() {
  if (!fs.existsSync(path.resolve(__dirname, '../template.json'))) {
    fs.writeFileSync(path.resolve(__dirname, '../template.json'), '{}');
  }

  const cmd = new program.Command();

  cmd
    .version(pkg.version)
    .usage('<command> [options]')
    .command('add', 'add a new template')
    .command('del', 'delete a template')
    .command('ls', 'list all the templates')
    .command('init', 'generate a new project from a template');

  cmd.parse(process.argv);
}

export { bootstrap };
