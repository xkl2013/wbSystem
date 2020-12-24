import React from 'react';
import {Form} from 'antd';
import './style.less';

/*
* Table 组件
*
* 基于原 ant Table
* 只扩展自定义样式
* */

class BIForm extends React.Component {

  render() {
    return (
      <div className='BIForm'>
        <Form {...this.props} />
      </div>
    );
  }
}

export default BIForm;
BIForm.Item = Form.Item;
