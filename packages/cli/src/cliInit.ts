/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-07 20:34:07
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-07 21:54:22
 * @FilePath: \gear\packages\cli\src\cliInit.ts
 */
import program from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import download from 'download-git-repo';

function bootstrap() {
  if (!fs.existsSync(path.resolve(__dirname, '../template.json'))) {
    fs.writeFileSync(path.resolve(__dirname, '../template.json'), '{}');
  }

  const tplObj = fs.readJSONSync(path.resolve(__dirname, '../template.json'));

  const cmd = new program.Command();

  cmd
    .usage('<template-name> [project-name]');
  cmd.parse(process.argv);
  if (cmd.args.length < 1) return cmd.help();

  const templateName = cmd.args[0];
  const projectName = cmd.args[1];
  if (!tplObj[templateName]) {
    console.log(chalk.red('\n Template does not exit! \n '));
    return false;
  }
  if (!projectName) {
    console.log(chalk.red('\n Project should not be empty! \n '));
    return false;
  }

  const url = tplObj[templateName];

  console.log(chalk.white('\n Start generating... \n'));
  download(
    `direct:${url}`,
    projectName,
    { clone: true },
    (err: any) => {
      if (err) {
        console.log(chalk.red(`Generation failed. ${err}`));
        return;
      }
      // 结束加载图标
      console.log(chalk.green('\n Generation completed!'));
      console.log('\n To get started');
      console.log(`\n    cd ${projectName} \n`);
    },
  );

  return true;
}

export { bootstrap };
