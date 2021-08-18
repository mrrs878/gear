/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-12-08 16:55:08
 * @LastEditTime: 2020-12-08 17:01:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jsLibrary\src\react\hooks\useInputValue.ts
 */
import { ChangeEvent, useCallback, useState } from 'react';

function useInputValue(initValue: string)
  : [
    string,
    (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void,
    React.Dispatch<React.SetStateAction<string>>,
  ] {
  const [value, setValue] = useState(initValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  }, []);

  return [value, onChange, setValue];
}

export default useInputValue;
