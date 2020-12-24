import React from 'react';
import { Checkbox } from 'antd';
import './style.less';
const CheckoutGroup = Checkbox.Group;
/*
* Select 组件
*
* 基于原 ant Select
* 只扩展自定义样式
* */

class BICheckout extends React.Component {
 

  render() {
    return (
      <span className='BICheckBox'>
        <CheckoutGroup {...this.props}>
          {this.props.children}
        </CheckoutGroup>
      </span>
    );
  }
}

export { BICheckout as default };
BICheckout.Checkbox = Checkbox;
