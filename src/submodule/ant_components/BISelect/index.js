import React from 'react';
import { Select } from 'antd';
import './style.less';
const Option = Select.Option;
/*
* Select 组件
*
* 基于原 ant Select
* 只扩展自定义样式
* */

class BISelect extends React.Component {

  render() {
    return (
      <span className='BISelect'>
        <Select {...this.props}>
          {this.props.children}
        </Select>
      </span>
    );
  }
}

export { BISelect as default };
BISelect.Option = Option;
