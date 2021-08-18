/*
 * @Author: your name
 * @Date: 2021-01-18 22:49:48
 * @LastEditTime: 2021-08-18 19:05:30
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \wrench\packages\hooks\src\useInViewport.ts
 */
import { useEffect, useState } from 'react';
import 'intersection-observer';
import { BasicTarget, getTargetElement } from './tools/dom';

type InViewport = boolean | undefined;

interface OptionsI {
  root?: BasicTarget;
}

function isInViewport(el: HTMLElement): InViewport {
  if (!el) {
    return undefined;
  }

  const viewPortWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewPortHeight = window.innerHeight || document.documentElement.clientHeight;
  const rect = el.getBoundingClientRect();

  if (rect) {
    const {
      top, bottom, left, right,
    } = rect;
    return bottom > 0 && top <= viewPortHeight && left <= viewPortWidth && right > 0;
  }

  return false;
}

function useInViewport(target: BasicTarget, options?: OptionsI): InViewport {
  const [inViewPort, setInViewport] = useState<InViewport>(() => {
    const el = getTargetElement(target);
    return isInViewport(el as HTMLElement);
  });

  useEffect(() => {
    const el = getTargetElement(target);
    const root = getTargetElement(options?.root, document.body) as HTMLElement;
    if (!el) {
      return () => {};
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInViewport(entry.isIntersecting);
        });
      },
      { root },
    );

    observer.observe(el as HTMLElement);

    return () => {
      observer.disconnect();
    };
  }, [target, options]);

  return inViewPort;
}

export default useInViewport;
