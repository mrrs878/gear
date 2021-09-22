/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-22 20:22:55
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-22 21:13:54
 * @FilePath: \gear\packages\hooks\src\useWatch.ts
 */
import { useEffect, useRef } from 'react';
import { equals, not } from 'ramda';

type OnChange = <T>(preVal?: T, newVal?: T) => any;

const useWatch = <T>(value: T, onChange: OnChange) => {
  const valRef = useRef<T>(value);

  useEffect(() => {
    if (not(equals(valRef.current, value))) onChange(valRef.current, value);
    valRef.current = value;
  }, [value, onChange]);
};

export default useWatch;
