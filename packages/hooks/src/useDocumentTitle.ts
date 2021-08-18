/*
* @Author: mrrs878@foxmail.com
* @Date: 2020-12-08 11:01:28
 * @LastEditTime: 2021-08-18 18:03:00
 * @LastEditors: mrrs878@foxmail.com
* @Description: In User Settings Edit
 * @FilePath: \wrench\packages\hooks\src\useDocumentTitle.ts
*/
import { useEffect } from 'react';

function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = 'hello world';
    };
  }, [title]);
}

export default useDocumentTitle;
