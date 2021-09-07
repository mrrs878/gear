/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-07 20:30:38
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-07 20:33:59
 * @FilePath: \gear\packages\cli\src\cliDel.ts
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

  const question = [
    {
      name: 'name',
      message: '请输入要删除的模板名称',
      validate(val: string) {
        if (val === '') {
          return 'Name is required!';
        } if (!tplObj[val]) {
          return 'Template does not exist!';
        }
        return true;
      },
    },
  ];

  inquirer
    .prompt(question).then((answers) => {
      const { name } = answers;
      delete tplObj[name];
      fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(tplObj), 'utf-8', (err) => {
        if (err) console.log(err);
        console.log('\n');
        console.log(chalk.green('Deleted successfully!\n'));
        console.log(chalk.grey('The latest template list is: \n'));
        console.log(tplObj);
        console.log('\n');
      });
    });
}

export { bootstrap };
