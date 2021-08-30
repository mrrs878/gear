/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-19 19:50:16
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-30 15:15:58
 * @FilePath: \gear\packages\sliding-puzzle\__tests__\drag-verify.test.ts
 */

import { getPuzzleImg } from '../src';

describe('drag-verify', () => {
  it('getPuzzleImg', async () => {
    const res = await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
    expect(res).toHaveProperty('background');
  });
});
