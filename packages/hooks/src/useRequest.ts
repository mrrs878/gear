/*
 * @Author: mrrs878
 * @Date: 2020-12-08 22:50:25
 * @LastEditTime: 2021-09-30 14:02:47
 * @LastEditors: mrrs878@foxmail.com
 * @Description: useRequest hook
 * @FilePath: \gear\packages\hooks\src\useRequest.ts
 */
import { useEffect, useState, useCallback } from 'react';
import { useCompare } from './useCompare';

function useRequest<P, T>(api: (params: P) => Promise<T>, visible = true, params?: P) {
  const [res, setRes] = useState<T>();
  const [loading, setLoading] = useState(() => false);
  const [newParams] = useCompare(params);

  const doFetch = useCallback(async (rest = newParams) => {
    setLoading(true);
    const tmp = await api(rest);
    setRes(tmp);
    setLoading(false);
    return tmp;
  }, [api, newParams]);

  useEffect(() => {
    if (visible) doFetch(newParams);
  }, [doFetch, newParams, visible]);

  return <const>([loading, res, doFetch, doFetch]);
}

export default useRequest;
