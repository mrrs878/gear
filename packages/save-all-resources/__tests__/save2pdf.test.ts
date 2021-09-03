/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-01 20:43:51
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-03 20:08:56
 * @FilePath: \gear\packages\save-all-resources\__tests__\save2pdf.test.ts
 */
import puppeteer from 'puppeteer';
import path from 'path';
import { save2PDF } from '../src';

jest.setTimeout(20000);

describe('save2pdf tests', () => {
  it('puppeteer should work', async () => {
    console.log('puppeteer starting...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    await browser.newPage();
    await browser.close();
  });

  it('save2pdf', async () => {
    await save2PDF({ url: 'https://www.npmjs.com', fileName: path.resolve(process.cwd(), 'full.pdf') });
  });
});
