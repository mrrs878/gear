/*
* @Author: mrrs878@foxmail.com
* @Date: 2020-12-31 12:47:00
 * @LastEditTime: 2021-08-25 22:16:07
 * @LastEditors: mrrs878@foxmail.com
* @Description: In User Settings Edit
 * @FilePath: \gear\packages\hooks\src\useClickAway.ts
*/
import { useEffect, useRef } from 'react';
import { BasicTarget, getTargetElement } from './tools/dom';

const defaultEvent = 'click';

type EventType = MouseEvent | TouchEvent;

function useClickAway(
  onClickAway: (event: EventType) => void,
  target: BasicTarget | Array<BasicTarget>,
  eventName: string = defaultEvent,
) {
  const onClickAwayRef = useRef(onClickAway);
  onClickAwayRef.current = onClickAway;

  useEffect(() => {
    const handler = (event: any) => {
      const targets = Array.isArray(target) ? target : [target];
      if (
        targets.some((targetItem) => {
          const targetElement = getTargetElement(targetItem) as HTMLElement;
          return !targetElement || targetElement?.contains(event.target);
        })
      ) return;
      onClickAwayRef.current(event);
    };

    document.addEventListener(eventName, handler);

    return () => {
      document.removeEventListener(eventName, handler);
    };
  }, [eventName, target]);
}

export default useClickAway;
