/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-23 20:57:28
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-03 19:45:00
 * @FilePath: \gear\packages\save-all-resources\src\save2Img.ts
 */
import puppeteer from 'puppeteer';
import { autoScroll } from './tool';

interface IOptions {
  url: string;
  fileName: string;
}

async function bootstrap(options: IOptions) {
  try {
    console.log('puppeteer starting...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    console.log('page loading...');
    await page.goto(options.url);
    console.log('page loaded');
    page.on('console', (consoleObj) => console.log(consoleObj.text()));
    console.log('scrolling...');
    await autoScroll(page);
    console.log('start screenshot');
    await page.screenshot({
      path: options.fileName,
      fullPage: true,
    });
    console.log('hooray, succeeded');
    await browser.close();
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
}

export { bootstrap };
