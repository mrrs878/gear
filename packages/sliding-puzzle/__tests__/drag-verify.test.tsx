/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-19 19:50:16
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-10 20:10:16
 * @FilePath: \gear\packages\sliding-puzzle\__tests__\drag-verify.test.tsx
 */
import { renderHook } from '@testing-library/react-hooks';
import {
  DragStatus, getPuzzleImg, usePuzzle, VerifyStatus,
} from '../src';

describe('drag-verify', () => {
  it('getPuzzleImg', async () => {
    const res = await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
    expect(res).toHaveProperty('background');
  });

  it('usePuzzle', () => {
    const { result } = renderHook(() => usePuzzle({
      containerSize: { width: 350, height: 200 },
      onRefresh: () => Promise.resolve(true),
      onRelease: () => Promise.resolve(true),
    }));
    const [,, verifyStatus, dragStatus] = result.current;
    expect(verifyStatus).toEqual(VerifyStatus.pending);
    expect(dragStatus).toEqual(DragStatus.pending);
  });
});
