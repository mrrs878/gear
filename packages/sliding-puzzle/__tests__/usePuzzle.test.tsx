/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-19 19:50:16
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-23 19:48:32
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
    const [,,, verifyStatus, dragStatus] = result.current;
    expect(verifyStatus).toEqual(VerifyStatus.pending);
    expect(dragStatus).toEqual(DragStatus.pending);
    act(() => {
      fireEvent.mouseDown(sliderRef.current, { clientX: 20, clientY: 20 });
    });
    expect(result.current[4]).toEqual(DragStatus.start);
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
    const [,,,, dragStatus] = result.current;
    expect(dragStatus).toEqual(DragStatus.start);
  });

  it('Anti-robot', async () => {
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
    await act(async () => {
      fireEvent.mouseDown(sliderRef.current, { clientX: 20, clientY: 25 });
      await sleep(40);
      fireEvent.mouseMove(window.document, { clientX: 23, clientY: 25 });
      await sleep(10);
      fireEvent.mouseMove(window.document, { clientX: 66, clientY: 25 });
      await sleep(30);
      fireEvent.mouseMove(window.document, { clientX: 130, clientY: 25 });
      await sleep(50);
      fireEvent.mouseUp(window.document);
    });
    const [,,,, dragStatus] = result.current;
    expect(dragStatus).toEqual(DragStatus.end);
    expect(onRelease).toBeCalledTimes(0);
  });

  it('When the mouse is raised, onRelease and onRefresh should be requested', async () => {
    const sliderRef = {
      current: document.createElement('div'),
    };
    const onRelease = jest.fn();
    const onRefresh = jest.fn();
    renderHook(() => usePuzzle({
      containerSize: { width: 350, height: 200 },
      sliderRef,
      onRefresh,
      onRelease,
    }));
    await act(async () => {
      fireEvent.mouseDown(sliderRef.current, { clientX: 20, clientY: 20 });
      await sleep(50);
      fireEvent.mouseMove(window.document, { clientX: 23, clientY: 25 });
      await sleep(10);
      fireEvent.mouseMove(window.document, { clientX: 66, clientY: 50 });
      await sleep(30);
      fireEvent.mouseMove(window.document, { clientX: 130, clientY: 10 });
      await sleep(20);
      fireEvent.mouseUp(window.document);
    });
    expect(onRelease).toBeCalled();
    // await waitFor(() => expect(onRefresh).toBeCalled());
  });

  it('when onRelease throws an exception, the code will not crash', async () => {
    const sliderRef = {
      current: document.createElement('div'),
    };
    const onRelease = jest.fn(() => Promise.reject(new Error('error')));
    const onRefresh = jest.fn();
    const { result } = renderHook(() => usePuzzle({
      containerSize: { width: 350, height: 200 },
      sliderRef,
      onRefresh,
      onRelease,
    }));
    await act(async () => {
      fireEvent.mouseDown(sliderRef.current, { clientX: 20, clientY: 20 });
      await sleep(50);
      fireEvent.mouseMove(window.document, { clientX: 23, clientY: 25 });
      await sleep(10);
      fireEvent.mouseUp(window.document);
    });
    const [,,,verifyStatus] = result.current;
    expect(verifyStatus).toEqual(VerifyStatus.fail);
  });
});
