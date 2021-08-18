/*
 * @Author: your name
 * @Date: 2021-01-14 22:40:55
 * @LastEditTime: 2021-08-18 19:05:37
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \wrench\packages\hooks\src\useScroll.ts
 */

import { useEffect, useRef, useState } from 'react';
import { BasicTarget, getTargetElement } from './tools/dom';

type Position = {
  left: number;
  top: number;
};

 type Target = BasicTarget<HTMLElement | Document>;
 type ScrollListenerController = (val: Position) => boolean;

function useScroll(target?: Target, cb: ScrollListenerController = () => true): Position {
  const [position, setPosition] = useState<Position>({ left: NaN, top: NaN });
  const cbRef = useRef(cb);

  useEffect(() => {
    const el = getTargetElement(target);
    if (!el) return;

    function updatePosition(currentTarget: Target) {
      let newPosition: Position;
      if (currentTarget === document) {
        if (!document.scrollingElement) return;
        newPosition = {
          left: document.scrollingElement.scrollLeft,
          top: document.scrollingElement.scrollTop,
        };
      } else {
        newPosition = {
          left: (currentTarget as HTMLElement).scrollLeft,
          top: (currentTarget as HTMLElement).scrollTop,
        };
      }
      if (cbRef.current(newPosition)) setPosition(newPosition);
    }

    updatePosition(el as Target);

    function listener(event: Event) {
      if (!event.target) return;
      updatePosition(event.target as Target);
    }

    el.addEventListener('scroll', listener);
    return () => {
      el.removeEventListener('scroll', listener);
    };
  }, [target, cbRef]);

  return position;
}

export default useScroll;
