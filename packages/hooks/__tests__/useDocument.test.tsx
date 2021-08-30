/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-30 15:23:24
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-30 15:23:32
 * @FilePath: \gear\packages\hooks\__tests__\useDocument.test.tsx
 */
import { render } from '@testing-library/react';
import React from 'react';
import { useDocumentTitle } from '../src';

describe('test useDocumentTitle', () => {
  it('should be defined', () => {
    expect(useDocumentTitle).toBeDefined();
  });

  it('with parameter', () => {
    const App = () => {
      useDocumentTitle('hello mrrs');
      return <div />;
    };
    render(<App />);
    expect(global.window.document.title).toBe('hello mrrs');
  });
});
