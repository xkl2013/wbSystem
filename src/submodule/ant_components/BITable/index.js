import React from 'react';
import {ConfigProvider, Table} from 'antd';
import './style.less';
import RenderEmpty from "@/components/RenderEmpty";

/*
* Table 组件
*
* 基于原 ant Table
* 只扩展自定义样式
* */

class BITable extends React.Component {

  render() {
    return (
      <div className='BITable'>
        <ConfigProvider renderEmpty={RenderEmpty}>
          <Table {...this.props} />
        </ConfigProvider>
      </div>
    );
  }
}

export default BITable;
