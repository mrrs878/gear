/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-31 19:39:08
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-31 19:42:29
 * @FilePath: \gear\packages\hooks\__tests__\useDebounce.test.ts
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { sleep } from '../src/tools';
import { useDebounce } from '../src';

describe('test useDebounce', () => {
  const fn = (param: number) => param + 1;
  test('run', async () => {
    let cnt = 0;
    const { result } = renderHook(() => useDebounce(fn));
    const [run] = result.current;

    await act(async () => {
      cnt = run(cnt) || 0;
      expect(cnt).toBe(0);
      await sleep(1100);
      cnt = run(cnt);
      expect(cnt).toBe(1);
    });
  });
  test('options', async () => {
    let cnt = 0;
    const { result } = renderHook(() => useDebounce(fn, { wait: 500 }));
    const [run] = result.current;

    await act(async () => {
      cnt = run(cnt) || 0;
      expect(cnt).toBe(0);
      await sleep(100);
      cnt = run(cnt) || 0;
      expect(cnt).toBe(0);
      await sleep(600);
      cnt = run(cnt) || 0;
      expect(cnt).toBe(1);
    });
  });
});
