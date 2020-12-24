import React from 'react';
import { Pagination } from 'antd';
import './style.less';

/*
* Pagination 组件
*
* 基于原 ant Pagination
* 只扩展自定义样式
* */

class BIPagination extends React.Component {

  render() {
    return (
      <div className='BIPagination'>
        <Pagination {...this.props} />
      </div>
    );
  }
}

export default BIPagination;
