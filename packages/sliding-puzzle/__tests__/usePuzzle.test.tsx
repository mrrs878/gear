/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-19 19:50:16
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-13 16:57:31
 * @FilePath: \gear\packages\sliding-puzzle\__tests__\usePuzzle.test.tsx
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';
import {
  DragStatus, usePuzzle, VerifyStatus,
} from '../src';

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

describe('usePuzzle', () => {
  it('initial status', () => {
    const sliderRef = {
      current: document.createElement('div'),
    };
    const { result } = renderHook(() => usePuzzle({
      containerSize: { width: 350, height: 200 },
      sliderRef,
      onRefresh: () => Promise.resolve(true),
      onRelease: () => Promise.resolve(true),
    }));
    const [,, verifyStatus, dragStatus] = result.current;
    expect(verifyStatus).toEqual(VerifyStatus.pending);
    expect(dragStatus).toEqual(DragStatus.pending);
    act(() => {
      fireEvent.mouseDown(sliderRef.current, { clientX: 20, clientY: 20 });
    });
    expect(result.current[3]).toEqual(DragStatus.start);
  });

  it('When the mouse is pressed, the dragStatus should change', () => {
    const sliderRef = {
      current: document.createElement('div'),
    };
    const { result } = renderHook(() => usePuzzle({
      containerSize: { width: 350, height: 200 },
      sliderRef,
      onRefresh: () => Promise.resolve(true),
      onRelease: () => Promise.resolve(true),
    }));
    act(() => {
      fireEvent.mouseDown(sliderRef.current, { clientX: 20, clientY: 20 });
    });
    const [,,, dragStatus] = result.current;
    expect(dragStatus).toEqual(DragStatus.start);
  });

  it('Anti-robot', () => {
    const sliderRef = {
      current: document.createElement('div'),
    };
    const onRelease = jest.fn();
    const { result } = renderHook(() => usePuzzle({
      containerSize: { width: 350, height: 200 },
      sliderRef,
      onRefresh: () => Promise.resolve(true),
      onRelease,
    }));
    act(() => {
      fireEvent.mouseDown(sliderRef.current, { clientX: 20, clientY: 20 });
      fireEvent.mouseMove(window.document, { clientX: 23, clientY: 25 });
      fireEvent.mouseMove(window.document, { clientX: 66, clientY: 25 });
      fireEvent.mouseMove(window.document, { clientX: 130, clientY: 25 });
    });
    act(() => {
      fireEvent.mouseUp(window.document);
    });
    const [,,, dragStatus] = result.current;
    expect(dragStatus).toEqual(DragStatus.end);
    expect(onRelease).toBeCalledTimes(0);
  });

  it('When the mouse is raised, onRelease and onRefresh should be requested', async () => {
    const sliderRef = {
      current: document.createElement('div'),
    };
    const onRelease = jest.fn();
    const onRefresh = jest.fn();
    const { result } = renderHook(() => usePuzzle({
      containerSize: { width: 350, height: 200 },
      sliderRef,
      onRefresh,
      onRelease,
    }));
    act(() => {
      fireEvent.mouseDown(sliderRef.current, { clientX: 20, clientY: 20 });
    });
    act(() => {
      fireEvent.mouseMove(window.document, { clientX: 23, clientY: 25 });
      fireEvent.mouseMove(window.document, { clientX: 66, clientY: 50 });
      fireEvent.mouseMove(window.document, { clientX: 130, clientY: 10 });
    });
    act(() => {
      fireEvent.mouseUp(window.document);
    });
    const [,,, dragStatus] = result.current;
    expect(dragStatus).toEqual(DragStatus.end);
    await act(async () => {
      expect(onRelease).toBeCalled();
      await sleep(1000);
      expect(onRefresh).toBeCalled();
      expect(result.current[3]).toEqual(DragStatus.pending);
    });
  });
});
