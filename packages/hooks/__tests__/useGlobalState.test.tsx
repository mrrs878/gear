/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-11-18 22:05:30
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-11-19 19:38:31
 */

import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { setGlobalState, useGlobalState } from '../src';

describe('useGlobalState', () => {
  test('should be defined', () => {
    expect(useGlobalState).toBeDefined();
  });

  test('globalState should be available normally', () => {
    setGlobalState({
      name: 'tom',
    });

    const { result } = renderHook(() => {
      const [state] = useGlobalState();
      return state;
    });

    expect(result.current?.name).toEqual('tom');
  });

  test('globalState should be able to get the latest value after setGlobalState', () => {
    setGlobalState({
      name: 'tom',
    });

    const { result } = renderHook(() => {
      const [state] = useGlobalState();
      return state;
    });

    // updateGlobalState
    act(() => {
      setGlobalState({
        name: 'jerry',
      });
    });

    expect(result.current.name).toEqual('jerry');
  });
});
