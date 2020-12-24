import React from 'react';
import { Input,AutoComplete,Icon } from 'antd';
import './style.less';

const { TextArea } = Input;
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
