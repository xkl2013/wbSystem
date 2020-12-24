import React from 'react';
import { Upload, Button, Icon } from 'antd';
import './style.less';


/*
* Input 组件
*
* 基于原 ant Input
* 只扩展自定义样式
* */

class BINumber extends React.Component {

  render() {
    return (
      <span className='Upload'>
        <Upload {...this.props} />
      </span>
    );
  }
}

export default BINumber;