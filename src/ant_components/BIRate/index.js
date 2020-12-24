import React from 'react';
import { Rate } from 'antd';
import './style.less';

/*
* Rate 组件
*
* 基于原 ant Rate
* 只扩展自定义样式
* */

class BIRate extends React.Component {

  render() {
    return (
      <span className='BIRate'>
        <Rate {...this.props}>
            {this.props.children}
        </Rate>
      </span>
    );
  }
}

export default BIRate;
