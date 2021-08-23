/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-23 20:57:28
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-23 21:42:32
 * @FilePath: \gear\packages\save-all-resources\src\save2Img.ts
 */
import puppeteer, { Page } from 'puppeteer';

interface IOptions {
  url: string;
  fileName: string;
}

async function autoScroll(page: Page) {
  return page.evaluate(() => new Promise((resolve) => {
    // 滚动的总高度
    let totalHeight = 0;
    // 每次向下滚动的高度 100 px
    const distance = 100;
    // 页面的高度 包含滚动高度
    const { scrollHeight } = document.body;
    const timer = setInterval(() => {
      // 滚动条向下滚动 distance
      window.scrollBy(0, distance);
      totalHeight += distance;
      console.log(`autoScrolling(${((totalHeight / scrollHeight) * 100).toFixed(2)}%)...`);
      // 当滚动的总高度 大于 页面高度 说明滚到底了。也就是说到滚动条滚到底时，以上还会继续累加，直到超过页面高度
      if (totalHeight >= scrollHeight) {
        clearInterval(timer);
        resolve('');
      }
    }, 300);
  }));
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
