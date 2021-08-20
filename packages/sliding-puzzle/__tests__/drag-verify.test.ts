/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-19 19:50:16
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-19 20:42:38
 * @FilePath: \gear\packages\drag-verify\__tests__\drag-verify.test.ts
 */
'use strict';

import { getPuzzleImg } from '../src';

describe('drag-verify', () => {
    it('needs tests', async () => {
        const res = await getPuzzleImg('https://img2.baidu.com/it/u=1759559009,1100199201&fm=26&fmt=auto&gp=0.jpg');
        expect(res).toHaveProperty('background');
    });
});
