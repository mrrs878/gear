/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-13 15:20:58
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-23 14:18:27
 * @FilePath: \gear\packages\sliding-puzzle\__tests__\getPuzzleImg.test.ts
 */
import { getPuzzleImg } from '../src';

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

describe('getPuzzleImg', () => {
  it('img info should be returned', async () => {
    await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
    await sleep(10);
    await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
    await sleep(15);
    await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
    await sleep(20);
    await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
    await sleep(25);
    await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
    await sleep(30);
    const res = await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
    expect(res).toHaveProperty('background');
  });

  it('when the image fails to load, the program will not crash', async () => {
    const res = await getPuzzleImg('x');
    expect(res).toEqual({});
  });
});
