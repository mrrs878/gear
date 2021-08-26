/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-18 20:47:59
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-26 21:55:09
 * @FilePath: \gear\packages\hooks\__tests__\useRequest.test.ts
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { useRequest } from '../src';

interface IUser {
  name: string;
  age: number;
}

const userInfos: Array<IUser> = [
  {
    name: '',
    age: -1,
  },
  {
    name: 'tom',
    age: 21,
  },
  {
    name: 'jerry',
    age: 22,
  },
];

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const GET_DATA = () => new Promise((resolve) => setTimeout(resolve, 200, {}));

const GET_USER_INFO = (id: number) => new Promise((resolve) => setTimeout(
  resolve,
  200,
  userInfos[id],
));

describe('@mrrs878/hooks/useRequest', () => {
  const setUp = (api, authFetch, params?) => renderHook(() => {
    const [loading, res, getData] = useRequest(api, authFetch, params);
    return [loading, res, getData];
  });
  it('fetch response', async () => {
    const hook = setUp(GET_DATA, false);
    const [,, getData] = (hook.result.current) as ReturnType<typeof useRequest>;
    let res = {};
    await act(async () => {
      res = await getData();
    });
    expect(res).toStrictEqual({});
  });

  it('hook response', async () => {
    const { result } = renderHook(() => useRequest(GET_DATA, false));
    const [,, getData] = result.current;
    await act(async () => {
      await getData();
    });

    expect(result.current[1]).toStrictEqual({});
  });

  it('autoFetch', async () => {
    await act(async () => {
      const { result } = renderHook(() => useRequest(GET_DATA));

      await sleep(210);
      expect(result.current[1]).toStrictEqual({});
    });
  });

  it('refetch', async () => {
    const { result } = renderHook(() => useRequest(GET_DATA, false));
    await act(async () => {
      await result.current[3]();
      await sleep(210);
    });
    expect(result.current[1]).toStrictEqual({});
  });

  it('with initial params', async () => {
    const { result } = renderHook(() => useRequest(GET_USER_INFO, false, 1));
    await act(async () => {
      await result.current[2]();
      await sleep(210);
    });
    expect(result.current[1]).toStrictEqual(userInfos[1]);
  });

  it('with new params', async () => {
    const { result } = renderHook(() => useRequest<number, any>(GET_USER_INFO, false, 1));
    await act(async () => {
      await result.current[2](2);
      await sleep(210);
    });
    expect(result.current[1]).toStrictEqual(userInfos[2]);
  });
});
