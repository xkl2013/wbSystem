import React from 'react';
import { TreeSelect } from 'antd';
import './style.less';

/*
* TreeSelect 组件
*
* 基于原 ant TreeSelect
* 只扩展自定义样式
* */

class BITreeSelect extends React.Component {

  render() {
    return (
      <span className='BITreeSelect'>
        <TreeSelect {...this.props}></TreeSelect>
      </span>
    );
  }
}

export default BITreeSelect;
