/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-12-08 16:55:08
 * @LastEditTime: 2021-09-28 21:34:02
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \gear\packages\hooks\src\useInputValue.ts
 */
import { useCallback, useState } from 'react';

function useInputValue(initValue: string) {
  const [value, setValue] = useState(initValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  }, []);

  return <const>([value, onChange, setValue]);
}

export default useInputValue;
