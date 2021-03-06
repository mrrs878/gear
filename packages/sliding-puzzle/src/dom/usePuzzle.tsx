/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-10 17:05:43
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-26 20:22:26
 * @FilePath: \gear\packages\sliding-puzzle\src\dom\usePuzzle.tsx
 */
import {
  RefObject, useCallback, useEffect, useRef, useState,
} from 'react';

interface IProps {
  containerSize: {
    width: number;
    height: number
  };
  sliderRef: RefObject<HTMLDivElement>;
  onRelease: (moveX: number) => Promise<boolean>;
  onRefresh: () => Promise<boolean>;
}

export enum DragStatus {
  pending,
  start,
  move,
  end,
}

export enum VerifyStatus {
  pending,
  success,
  fail,
}

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const sum = (a: number, b: number) => a + b;

const square = (a: number) => a * a;

const inRange = (s: number, [min, max]: Array<number>) => {
  if (s < min) return min;
  if (s > max) return max;
  return s;
};
const verifyTrail = (trail: Array<number>) => {
  const average = trail.reduce(sum) / trail.length;
  const deviations = trail.map((x) => x - average);
  const stddev = Math.sqrt(deviations.map(square).reduce(sum) / trail.length);
  return stddev !== 0;
};

type UsePuzzle = (props: IProps) => ([
  boolean,
  {
    left: number,
  },
  {
    left: number,
  },
  VerifyStatus,
  DragStatus,
]);

const usePuzzle: UsePuzzle = (props: IProps) => {
  const [loading, setLoading] = useState(false);
  const [dragStatus, setDragStatus] = useState(DragStatus.pending);
  const [moveX, setMoveX] = useState(0);
  const trail = useRef<Array<number>>([]);
  const [verifyStatus, setVerifyStatus] = useState(VerifyStatus.pending);
  const [originPosition, setOriginPosition] = useState({ x: 0, y: 0 });

  const imgPositionLeft = inRange(moveX, [10, props.containerSize.width - 65]);
  const sliderPositionLeft = inRange(moveX, [0, props.containerSize.width - 40]);

  const reset = useCallback(async () => {
    try {
      setVerifyStatus(VerifyStatus.pending);
      setDragStatus(DragStatus.pending);
      setLoading(true);
      await props.onRefresh();
      setMoveX(0);
    } finally {
      setLoading(false);
    }
  }, [props]);

  const onFail = useCallback(() => {
    setVerifyStatus(VerifyStatus.fail);
    setTimeout(reset, 800);
  }, [reset]);

  const onSuccess = useCallback(() => {
    setVerifyStatus(VerifyStatus.success);
    setTimeout(reset, 800);
  }, [reset]);

  const handleDragStart = useCallback((e: any) => {
    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;
    setOriginPosition({ x, y });
    setDragStatus(() => DragStatus.start);
  }, []);

  const handleDragMove = useCallback((e: any) => {
    if (dragStatus !== DragStatus.start) return false;
    const eventX = e.clientX || e.touches[0].clientX;
    const eventY = (e.clientY || e.touches[0].clientY) as number;
    const newMoveX = eventX - originPosition.x;
    if (newMoveX < 10 || newMoveX >= props.containerSize.width) return false;
    setMoveX(newMoveX);
    trail.current.push(eventY);
    return true;
  }, [props.containerSize.width, dragStatus, originPosition.x]);

  const handleDragEnd = useCallback(async () => {
    try {
      if (dragStatus !== DragStatus.start) return;
      setLoading(true);
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      const isHuman = verifyTrail(trail.current);
      if (!isHuman) {
        onFail();
        return;
      }
      const res = await props.onRelease(moveX);
      await sleep(200);
      setDragStatus(DragStatus.end);
      if (res) onSuccess();
      else onFail();
    } catch (error) {
      onFail();
    } finally {
      setLoading(false);
    }
  }, [dragStatus, handleDragMove, moveX, onFail, onSuccess, props]);

  useEffect(() => {
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragEnd, handleDragMove]);

  useEffect(() => {
    const slider = props.sliderRef.current;
    slider?.addEventListener('mousedown', handleDragStart);
    return () => {
      slider?.removeEventListener('mousedown', handleDragStart);
    };
  }, [handleDragStart, props.sliderRef]);

  return [
    loading,
    {
      left: sliderPositionLeft,
    },
    {
      left: imgPositionLeft,
    },
    verifyStatus,
    dragStatus,
  ];
};

export { usePuzzle };
