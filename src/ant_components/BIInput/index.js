import React from 'react';
import { Input } from 'antd';
import './style.less';

const { TextArea } = Input;
const Search = Input.Search;
const Password = Input.Password;
/*
* Input 组件
*
* 基于原 ant Input
* 只扩展自定义样式
* */

class BIInput extends React.Component {

  render() {
    return (
      <span className='BIInput'>
        <Input {...this.props} />
      </span>
    );
  }
}

export default BIInput;
BIInput.TextArea = TextArea;
BIInput.Password = Password;
BIInput.Search = Search;
