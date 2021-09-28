/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-12-21 18:01:32
 * @LastEditTime: 2021-09-28 21:33:25
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \gear\packages\hooks\src\useDebounce.ts
 */
import { debounce } from 'lodash';
import { useMemo, useRef } from 'react';

type Fn = (...args: any) => any;

interface PropsI {
  wait?: number;
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
}
function useDebounce<T extends Fn>(fn: T, options?: PropsI) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;
  const wait = options?.wait || 1000;
  const debounced = useMemo(
    () => debounce<T>(((...args: Array<[]>) => fn(...args)) as T, wait, options),
    [fn, options, wait],
  );
  return <const>([
    (debounced as unknown) as T,
    debounced.cancel,
    debounced.flush,
  ]);
}

export default useDebounce;
