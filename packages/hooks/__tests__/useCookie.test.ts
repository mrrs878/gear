/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-30 14:23:50
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-30 20:37:50
 * @FilePath: \gear\packages\hooks\__tests__\useCookie.test.ts
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { CookieOptionsT, useCookie } from '../src';

describe('test useCookie', () => {
  it('should be defined', () => {
    expect(useCookie).toBeDefined();
  });

  const setUp = (key: string, options?: CookieOptionsT) => renderHook(() => {
    const [state, setState] = useCookie(key, options);
    return {
      state,
      setState,
    } as const;
  });

  it('should support manual config', () => {
    const COOKIE_KEY = 'test-key4';
    global.window.document.cookie = `${COOKIE_KEY}=12`;
    const hook = setUp(COOKIE_KEY);
    expect(hook.result.current.state).toEqual('12');
  });

  it('getKey should work', () => {
    const COOKIE_KEY = 'test-key0';
    const hook = setUp(COOKIE_KEY, { defaultValue: 'A' });
    expect(hook.result.current.state).toEqual('A');
    act(() => {
      hook.result.current.setState('B');
    });
    expect(hook.result.current.state).toEqual('B');
  });

  it('should support null', () => {
    const COOKIE_KEY = 'test-key1';
    const hook = setUp(COOKIE_KEY, { defaultValue: 'null' });
    expect(hook.result.current.state).toEqual('null');
    act(() => {
      hook.result.current.setState(null);
    });
    expect(hook.result.current.state).toEqual(null);
  });

  it('should support empty string', () => {
    const COOKIE_KEY = 'test-key2';
    const hook = setUp(COOKIE_KEY, { defaultValue: 'hello' });
    expect(hook.result.current.state).toEqual('hello');
    act(() => {
      hook.result.current.setState('');
    });
    expect(hook.result.current.state).toEqual('');
  });

  it('should support function updater', () => {
    const COOKIE_KEY = 'test-key3';
    const hook = setUp(COOKIE_KEY, { defaultValue: () => 'hello' });
    expect(hook.result.current.state).toEqual('hello');
    act(() => {
      hook.result.current.setState((pre) => `${pre}, world`);
    });
    expect(hook.result.current.state).toEqual('hello, world');
  });
});
