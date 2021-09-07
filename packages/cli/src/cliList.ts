/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-07 20:32:54
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-07 20:41:05
 * @FilePath: \gear\packages\cli\src\cliList.ts
 */
import path from 'path';
import fs from 'fs-extra';

function bootstrap() {
  if (!fs.existsSync(path.resolve(__dirname, '../template.json'))) {
    console.log('{}');
    return;
  }
  const tplObj = fs.readJSONSync(path.resolve(__dirname, '../template.json'));

  console.log(tplObj);
}

export { bootstrap };
