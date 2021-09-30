/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-30 11:54:25
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-30 13:41:17
 * @FilePath: \gear\packages\hooks\src\useCompare.ts
 */
import { equals } from 'ramda';
import { useRef } from 'react';

function useCompare<T>(value: T) {
  const ref = useRef<T>();

  if (!equals(value, ref.current)) {
    ref.current = value;
  }

  return [ref.current];
}

export { useCompare };
