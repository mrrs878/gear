/*
 * @Author: mrrs878
 * @Date: 2020-12-08 22:50:25
 * @LastEditTime: 2020-12-09 16:15:15
 * @LastEditors: mrrs878
 * @Description: useRequest hook
 * @FilePath: \jsLibrary\src\react\hooks\useRequest.ts
 */
import { useEffect, useState, useCallback } from 'react';

/**
 * @param api 发送请求的函数
 * @param visible 是否自动触发
 * @param params 请求的参数
 * @returns 是否在请求中
 * @returns 接口返回值
 * @returns 手动发送请求
 * @returns 重新发送请求(使用上一次的参数)
*/
function useRequest<P, T>(api: (params: P) => Promise<T>, visible = true, params?: P)
  : [boolean, T|undefined, (params?: P) => void, () => void] {
  const [res, setRes] = useState<T>();
  const [loading, setLoading] = useState(() => false);
  const [newParams, setNewParams] = useState(() => params);
  const [autoFetch, setAutoFetch] = useState(() => visible);

  const fetch = useCallback(async () => {
    if (autoFetch) {
      setLoading(true);
      const newNewParams = (newParams || {}) as P;
      const tmp = await api(newNewParams);
      setRes(tmp);
      setLoading(false);
    }
  }, [api, autoFetch, newParams]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const doFetch = useCallback((rest = null) => {
    setNewParams(rest);
    setAutoFetch(true);
  }, []);

  return [loading, res, doFetch, fetch];
}

export default useRequest;
