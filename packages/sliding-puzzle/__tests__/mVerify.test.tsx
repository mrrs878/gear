/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-23 10:20:31
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-23 11:35:52
 * @FilePath: \gear\packages\sliding-puzzle\__tests__\mVerify.test.tsx
 */
import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { MVerify } from '../src';

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

describe('MVerify', () => {
  it('initial', () => {
    const onRefresh = jest.fn();
    const onRelease = jest.fn();

    const { getByText, baseElement } = render(<MVerify
      loading={false}
      background="x"
      block="x"
      onRefresh={onRefresh}
      onRelease={onRelease}
    />);

    expect(getByText('向右滑动填充拼图')).toBeDefined();

    expect(baseElement.getElementsByClassName('loading')).toHaveLength(0);
  });

  it('loading should switch normally', () => {
    const onRefresh = jest.fn();
    const onRelease = jest.fn();

    const { baseElement, rerender } = render(<MVerify
      loading
      background="x"
      block="x"
      onRefresh={onRefresh}
      onRelease={onRelease}
    />);

    expect(baseElement.getElementsByClassName('loading')).toHaveLength(1);

    rerender(<MVerify
      loading={false}
      background="x"
      block="x"
      onRefresh={onRefresh}
      onRelease={onRelease}
    />);

    expect(baseElement.getElementsByClassName('loading')).toHaveLength(0);
  });

  it('dragStatus should switch normally', async () => {
    const onRefresh = jest.fn(() => Promise.resolve(true));
    const onRelease = jest.fn(() => Promise.resolve(true));

    const { baseElement } = render(<MVerify
      loading={false}
      background="x"
      block="x"
      onRefresh={onRefresh}
      onRelease={onRelease}
    />);

    const slider = baseElement.querySelector('.puzzle-slider');

    expect(slider).toBeDefined();

    await act(async () => {
      fireEvent.mouseDown(slider, { clientX: 20, clientY: 20 });
      await sleep(100);
      fireEvent.mouseMove(window.document, { clientX: 23, clientY: 25 });
      await sleep(10);
      fireEvent.mouseMove(window.document, { clientX: 66, clientY: 50 });
      await sleep(20);
      fireEvent.mouseMove(window.document, { clientX: 130, clientY: 10 });
      await sleep(40);
      fireEvent.mouseUp(window.document);
    });

    expect(onRelease).toBeCalled();
  });

  it('onRefresh should be called on click the refresh button', async () => {
    const onRefresh = jest.fn(() => Promise.resolve(true));
    const onRelease = jest.fn(() => Promise.resolve(true));

    const { baseElement } = render(<MVerify
      loading={false}
      background="x"
      block="x"
      onRefresh={onRefresh}
      onRelease={onRelease}
    />);

    const refreshBtn = baseElement.querySelector('.puzzle-refresh');

    expect(refreshBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(refreshBtn);
      await sleep(100);
    });

    expect(onRefresh).toBeCalled();
  });
});
