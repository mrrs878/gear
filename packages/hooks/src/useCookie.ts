/*
 * @Author: your name
 * @Date: 2021-02-01 22:33:02
 * @LastEditTime: 2021-08-18 17:59:47
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \wrench\packages\hooks\src\useCookie.ts
 */
import Cookies from 'js-cookie';
import { useCallback, useState } from 'react';

export type CookieStateT = string | undefined | null;
export type CookieOptionsT = Cookies.CookieAttributes;

interface OptionsI extends CookieOptionsT {
  defaultValue?: CookieStateT | (() => CookieStateT)
}

const useCookie = (cookieKey: string, options: OptionsI) => {
  const [state, setState] = useState<CookieStateT>(() => {
    const cookieValue = Cookies.get(cookieKey);
    if (typeof cookieValue === 'string') return cookieValue;
    if (typeof options.defaultValue === 'function') return options.defaultValue();
    return options.defaultValue;
  });

  const updateState = useCallback((
    newValue?: CookieStateT | ((prevState: CookieStateT) => CookieStateT),
    newOptions: Cookies.CookieAttributes = {},
  ) => {
    const { defaultValue, ...resetOptions } = { ...options, ...newOptions };
    setState(
      (preState: CookieStateT): CookieStateT => {
        const value = typeof newValue === 'function' ? newValue(preState) : newValue;
        if (value === undefined || value === null) {
          Cookies.remove(cookieKey);
        } else {
          Cookies.set(cookieKey, value, resetOptions);
        }
        return value;
      },
    );
  }, [cookieKey, options]);

  return [state, updateState] as const;
};

export default useCookie;
