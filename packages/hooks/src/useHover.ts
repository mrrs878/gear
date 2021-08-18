/*
* @Author: mrrs878@foxmail.com
* @Date: 2021-01-05 22:41:58
 * @LastEditTime: 2021-08-18 19:05:21
 * @LastEditors: mrrs878@foxmail.com
* @Description: In User Settings Edit
 * @FilePath: \wrench\packages\hooks\src\useHover.ts
*/
import { useCallback, useEffect, useState } from 'react';
import { BasicTarget, getTargetElement } from './tools/dom';

interface PropsI {
  onEnter?: () => void;
  onLeave?: () => void;
}
function useHover(target: BasicTarget, options: PropsI) {
  const { onEnter, onLeave } = options || {};
  const [state, setState] = useState(false);

  const onTargetMouseEnter = useCallback(() => {
    if (onEnter) onEnter();
    setState(true);
  }, [onEnter]);
  const onTargetMouseLeave = useCallback(() => {
    if (onLeave) onLeave();
    setState(false);
  }, [onLeave]);

  useEffect(() => {
    const targetEle = getTargetElement(target);
    targetEle?.addEventListener('mouseenter', onTargetMouseEnter);
    targetEle?.addEventListener('mouseleave', onTargetMouseLeave);
    return () => {
      targetEle?.removeEventListener('mouseenter', onTargetMouseEnter);
      targetEle?.removeEventListener('mouseleave', onTargetMouseLeave);
    };
  }, [target, onTargetMouseEnter, onTargetMouseLeave]);

  return state;
}

export default useHover;
