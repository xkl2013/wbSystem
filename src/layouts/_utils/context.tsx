import {createContext} from 'react';
export const Context = createContext({
    pageTitle: '',
    toggle: () => {}, //向上下文设定一个回调方法
  });