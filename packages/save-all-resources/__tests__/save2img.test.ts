/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-23 20:55:24
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-13 15:28:49
 * @FilePath: \gear\packages\save-all-resources\__tests__\save2img.test.ts
 */
import puppeteer from 'puppeteer';

describe('save2img tests', () => {
  it('puppeteer should work', async () => {
    console.log = jest.fn();
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    await browser.newPage();
    await browser.close();
  });

  it('save2Img', () => undefined);
});
