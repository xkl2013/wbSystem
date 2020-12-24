import React from 'react';
import { Button } from 'antd';
import './style.less';

/*
* Button 组件
*
* 基于原 ant Button
* 只扩展自定义样式
* */

class BIButton extends React.Component {

  render() {
    return (
      <span className='BIButton'>
        <Button {...this.props}></Button>
      </span>
    );
  }
}

export default BIButton;
