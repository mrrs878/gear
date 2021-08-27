/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-19 19:50:16
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-26 16:51:16
 * @FilePath: \gear\packages\sliding-puzzle\__tests__\drag-verify.test.ts
 */

import { getPuzzleImg } from '../src';

describe('drag-verify', () => {
  it('needs tests', async () => {
    const res = await getPuzzleImg('https://avatars.githubusercontent.com/u/7506913?v=4');
    expect(res).toHaveProperty('background');
  });
});
