/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-22 20:24:33
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-22 21:03:54
 * @FilePath: \gear\packages\hooks\__tests__\useWatch.test.ts
 */
import { renderHook } from '@testing-library/react-hooks';
import { useWatch } from '../src';

describe('test useCookie', () => {
  it('should be defined', () => {
    expect(useWatch).toBeDefined();
  });

  it('onChange should be called when the value changes', () => {
    const onChange = jest.fn();
    const { rerender } = renderHook(
      ({ initialValue }) => useWatch(initialValue, onChange),
      {
        initialProps: {
          initialValue: 0,
        },
      },
    );

    rerender({ initialValue: 10 });

    expect(onChange).toBeCalled();

    rerender({ initialValue: 20 });

    expect(onChange).toBeCalledWith(10, 20);
  });

  it('should work normally when the value is null', () => {
    const onChange = jest.fn();

    const { rerender } = renderHook(
      ({ initialValue }) => useWatch(initialValue, onChange),
      {
        initialProps: {
          initialValue: null,
        },
      },
    );

    rerender({ initialValue: 0 });

    expect(onChange).toBeCalledWith(null, 0);
  });

  it('should work normally when value is an Object', () => {
    const onChange = jest.fn();

    const { rerender } = renderHook(
      ({ initialValue }) => useWatch(initialValue, onChange),
      {
        initialProps: {
          initialValue: {
            name: 'tom',
            age: 12,
          },
        },
      },
    );

    rerender({ initialValue: { name: 'tom', age: 13 } });

    expect(onChange).toBeCalledTimes(1);

    rerender({ initialValue: { name: 'tom', age: 13 } });

    expect(onChange).toBeCalledTimes(1);
  });
});
