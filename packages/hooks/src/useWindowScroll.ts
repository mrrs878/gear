const { useEffect } = require('react');

/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-12-08 11:16:32
 * @LastEditTime: 2021-01-18 23:26:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jsLibrary\react\hooks\useWindowScroll.js
 */
function useWindowScroll(scrollHandler: () => void) {
  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);
}

export default useWindowScroll;
