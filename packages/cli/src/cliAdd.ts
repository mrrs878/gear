/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-07 20:04:27
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-07 20:27:08
 * @FilePath: \gear\packages\cli\src\cliAdd.ts
 */
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

function bootstrap() {
  if (!fs.existsSync(path.resolve(__dirname, '../template.json'))) {
    fs.writeFileSync(path.resolve(__dirname, '../template.json'), '{}');
  }

  const tplObj = fs.readJSONSync(path.resolve(__dirname, '../template.json'));

  // 自定义交互式命令行的问题及简单的校验
  const question = [
    {
      name: 'name',
      type: 'input',
      message: '请输入模板名称',
      validate(val: string) {
        if (val === '') {
          return 'Name is required!';
        } if (tplObj[val]) {
          return 'Template has already existed!';
        }
        return true;
      },
    },
    {
      name: 'url',
      type: 'input',
      message: '请输入模板地址',
      validate(val: string) {
        if (val === '') return 'The url is required!';
        return true;
      },
    },
  ];

  inquirer
    .prompt(question).then((answers) => {
      const { name, url } = answers;
      // eslint-disable-next-line no-control-regex
      tplObj[name] = url.replace(/[\u0000-\u0019]/g, '');
      fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(tplObj), 'utf-8', (err) => {
        if (err) console.log(err);
        console.log('\n');
        console.log(chalk.green('Added successfully!\n'));
        console.log(chalk.grey('The latest template list is: \n'));
        console.log(tplObj);
        console.log('\n');
      });
    });
}

export { bootstrap };
