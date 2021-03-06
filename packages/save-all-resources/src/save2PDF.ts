/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-01 19:32:59
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-03 19:54:21
 * @FilePath: \gear\packages\save-all-resources\src\save2PDF.ts
 */
import puppeteer, { PDFOptions } from 'puppeteer';
import { autoScroll } from './tool';

type IPdfOptions = Exclude<PDFOptions, 'path'>;

interface IOptions extends IPdfOptions {
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
    console.log('printing...');
    const pdfOptions = JSON.parse(JSON.stringify(options));
    Reflect.deleteProperty(pdfOptions, 'url');
    await page.pdf(pdfOptions);

    console.log('hooray, succeeded');
    await browser.close();
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
}

export { bootstrap };
