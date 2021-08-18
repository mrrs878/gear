/*
 * @Author: your name
 * @Date: 2021-01-06 18:43:31
 * @LastEditTime: 2021-08-18 19:04:35
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \wrench\packages\hooks\src\useFullScreen.ts
 */
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import screenfull from 'screenfull';
import { BasicTarget, getTargetElement } from './tools/dom';

interface OptionsI {
  onExitFull?: () => void;
  onFull?: () => void;
}

function useFullScreen(target: BasicTarget, options?: OptionsI) {
  const { onExitFull, onFull } = options || {};

  const onExitFullRef = useRef(onExitFull);
  onExitFullRef.current = onExitFull;
  const onFullRef = useRef(onFull);
  onFullRef.current = onFull;
  const [state, setState] = useState(false);

  const onChange = useCallback(() => {
    if (screenfull.isEnabled) {
      const { isFullscreen } = screenfull;
      if (isFullscreen) {
        if (onFullRef.current) onFullRef.current();
      } else {
        screenfull.off('change', onChange);
        if (onExitFullRef.current) onExitFullRef.current();
      }
      setState(isFullscreen);
    }
  }, []);

  const setFull = useCallback(() => {
    const el = getTargetElement(target);
    if (!el) return;
    if (screenfull.isEnabled) {
      try {
        screenfull.request(el as HTMLElement);
        screenfull.on('change', onChange);
      } catch (error) {
        console.log(error);
      }
    }
  }, [target, onChange]);

  const exitFull = useCallback(() => {
    if (!state) return;
    if (screenfull.isEnabled) screenfull.exit();
  }, [state]);

  const toggleFull = useCallback(() => {
    if (state) exitFull();
    else setFull();
  }, [state, exitFull, setFull]);

  useEffect(() => () => {
    if (screenfull.isEnabled) screenfull.off('change', onChange);
  }, [onChange]);

  return [state, { setFull, exitFull, toggleFull }, screenfull.isEnabled] as const;
}

export default useFullScreen;
