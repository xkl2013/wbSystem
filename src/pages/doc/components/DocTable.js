import React, { Component } from 'react';
import {Divider,Input} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BITable from '@/ant_components/BITable';
const { TextArea } = Input;


class DocTable extends Component {
  render() {
    const btn =
`import BITable from '@/ant_components/BITable';

<BITable dataSource={dataSource} columns={columns} pagination={false} />`;

    const dataSource = [{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    }];

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }];

    return (
      <Box title="BITable 表格">
        <Left>

          <BITable dataSource={dataSource} columns={columns} pagination={false} />

          <Divider orientation="left" > 组件说明 </Divider>
          <div>
            API 同 <a href="https://ant.design/components/table-cn/" target="view_window">Ant Table</a>
          </div>
        </Left>
        <Right>
          <TextArea rows={5} defaultValue={btn} />
        </Right>
      </Box>
    )
  }
}


export default DocTable;

