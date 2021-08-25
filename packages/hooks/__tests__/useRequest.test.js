/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-18 20:47:59
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-25 22:15:07
 * @FilePath: \gear\packages\hooks\__tests__\useRequest.test.js
 */
const { act, renderHook } = require('@testing-library/react-hooks');
const { useRequest } = require('../dist/index.cjs');

global.fetch = require('node-fetch');

describe('@mrrs878/hooks', () => {
  const setUp = (api, authFetch, params) => renderHook(() => {
    const [loading, res, getData] = useRequest(api, authFetch, params);
    return [loading, res, getData];
  });
  it('useRequest', async () => {
    const GET_DATA = () => fetch('http://localhost:3003/useRequest').then((res) => res.json());
    const hook = setUp(GET_DATA, false);
    const [,, getData] = hook.result.current;
    let res = {};
    await act(async () => {
      res = await getData();
    });
    expect(res).toStrictEqual({});
  });
});
