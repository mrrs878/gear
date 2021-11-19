/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-11-18 22:04:54
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-11-19 19:45:47
 */

import { useEffect, useState } from 'react';

let globalState: Record<string, any> = {};

const observers = new Set<Function>();

const setGlobalState = (nextGlobalState: any) => {
  globalState = nextGlobalState;
  observers.forEach((observer) => observer());
};

const useGlobalState = () => {
  const [state, setState] = useState(globalState);

  useEffect(() => {
    const observer = () => setState(globalState);

    observers.add(observer);

    observer();

    return () => {
      observers.delete(observer);
    };
  }, []);

  return [state, setGlobalState];
};

export { useGlobalState, setGlobalState };
