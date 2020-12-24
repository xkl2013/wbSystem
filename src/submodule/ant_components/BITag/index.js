import React from 'react';
import { Tag } from 'antd';
import './style.less';

/*
* Tag 组件
*
* 基于原 ant Tag
* 只扩展自定义样式
* */

class BITag extends React.Component {

  render() {
    return (
      <span className='BITag'>
        <Tag {...this.props}>
            {this.props.children}
        </Tag>
      </span>
    );
  }
}

export default BITag;
