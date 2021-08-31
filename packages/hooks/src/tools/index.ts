/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-31 19:40:16
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-31 19:40:17
 * @FilePath: \gear\packages\hooks\src\tools\index.ts
 */
export const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));
