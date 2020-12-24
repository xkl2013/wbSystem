import React from 'react';
import {InputNumber} from 'antd';
import './style.less';

/*
* InputNumber 组件
*
* 基于原 ant Input
* 只扩展自定义样式
* */

class BIInputNumer extends React.Component {

  render() {
    return (
      <span className='BIInput'>
        <InputNumber {...this.props} />
      </span>
    );
  }
}

export default BIInputNumer;
