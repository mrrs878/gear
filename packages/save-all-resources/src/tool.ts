/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-03 19:44:24
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-03 19:44:25
 * @FilePath: \gear\packages\save-all-resources\src\tool.ts
 */
import { Page } from 'puppeteer';

export async function autoScroll(page: Page) {
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
      // 当滚动的总高度 大于 页面高度 说明滚到底了。也就是说到滚动条滚到底时，以上还会继续累加，直到超过页面高度
      if (totalHeight >= scrollHeight) {
        clearInterval(timer);
        resolve('');
      }
    }, 300);
  }));
}
