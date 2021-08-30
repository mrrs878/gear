/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-30 19:38:09
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-30 19:39:11
 * @FilePath: \gear\packages\hooks\__tests__\useInputValue.test.tsx
 */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { useInputValue } from '../src';

describe('useInputValue', () => {
  it('should be defined', () => {
    expect(useInputValue).toBeDefined();
  });
  it('test useInputValue', () => {
    const App = () => {
      const [value, onChange] = useInputValue('hello');
      return (
        <input type="text" placeholder={value} value={value} onChange={onChange} />
      );
    };
    render(<App />);
    const element = screen.getByPlaceholderText('hello');
    expect(element.getAttribute('value')).toBe('hello');
    fireEvent.input(element, { target: { value: 'hello world' } });
    expect(element.getAttribute('value')).toBe('hello world');
  });
});
