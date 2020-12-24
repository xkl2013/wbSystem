import React from 'react';
import { Radio } from 'antd';
import './style.less';
const RadioGroup = Radio.Group;
/*
* Select 组件
*
* 基于原 ant Select
* 只扩展自定义样式
* */

class BIRadio extends React.Component {

  render() {
    return (
      <span className='BIRadio'>
        <RadioGroup {...this.props}>
          {this.props.children}
        </RadioGroup>
      </span>
    );
  }
}

export { BIRadio as default };
BIRadio.Radio = Radio;
BIRadio.Button = Radio.Button;
