import React, { Component } from 'react';
import {Divider,Input} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BIPagination from '@/ant_components/BIPagination';
const { TextArea } = Input;


class DocPagination extends Component {

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  render() {
    const btn =
`import BIPagination from '@/ant_components/BIPagination'

<BIPagination showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} defaultCurrent={3} total={500} />`;

    return (
      <Box title="BIPagination 分页">
        <Left>
          <BIPagination showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} defaultCurrent={3} total={500} />

          <Divider orientation="left"> 组件说明 </Divider>
          <div>
            API 同 <a href="https://ant.design/components/pagination-cn/" target="view_window">Ant Pagination</a>
          </div>
        </Left>
        <Right>
          <TextArea rows={5} defaultValue={btn} />
        </Right>
      </Box>
    )
  }
}


export default DocPagination;

