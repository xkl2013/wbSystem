import React from 'react';
import { Input } from 'antd';
import InconFont from '@/submodule/components/IconFont/IconFont';
import styles from './style.less';

const { TextArea } = Input;
const Search = Input.Search;
const Password = Input.Password;
/*
* Input 组件
*
* 基于原 ant Input
* 只扩展自定义样式
* */

const BIInput = (props) => {
  const onClear = () => {
    if (props.onChange) {
      props.onChange('')
    }
    if (props.onClear) {
      props.onClear('')
    }
  }
  return (
    <Input

      {...props}
      suffix={props.value ? (<InconFont type="iconguanbi" className={styles.clearIcon} onClick={onClear} />) : <span />}
    />
  );
}

export default BIInput;
BIInput.TextArea = TextArea;
BIInput.Password = Password;
BIInput.Search = Search;
