/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-13 15:20:58
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-13 15:22:00
 * @FilePath: \gear\packages\sliding-puzzle\__tests__\getPuzzleImg.test.ts
 */
import { getPuzzleImg } from '../src';

describe('getPuzzleImg', () => {
  it('img info should be returned', async () => {
    const res = await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
    expect(res).toHaveProperty('background');
  });
});
