/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-13 15:20:58
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-10-01 10:45:09
 * @FilePath: \gear\packages\sliding-puzzle\__tests__\getPuzzleImg.test.ts
 */
import fs from 'fs';
import path from 'path';
import { getPuzzleImg } from '../src';

const img: any = fs.readFileSync(path.resolve(__dirname, 'avatar.png'));

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

describe('getPuzzleImg', () => {
  it('img info should be returned', async () => {
    await getPuzzleImg(img);
    await sleep(10);
    await getPuzzleImg(img);
    await sleep(15);
    await getPuzzleImg(img);
    await sleep(20);
    await getPuzzleImg(img);
    await sleep(25);
    await getPuzzleImg(img);
    await sleep(30);
    const res = await getPuzzleImg(img);
    expect(res).toHaveProperty('background');
  });

  it('when the image fails to load, the program will not crash', async () => {
    const res = await getPuzzleImg('x');
    expect(res).toEqual({});
  });
});
