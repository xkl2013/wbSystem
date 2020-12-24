import React, { Component } from 'react';
import {Divider,Input} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BITabs from '@/ant_components/BITabs';

const { TextArea } = Input;

class DocTabs extends Component {
  handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  render() {
    const val = `import BITabs from '@/ant_components/BITabs';
          <BITabs type="card" tabBarStyle={{backgroundColor:'#fff'}} onChange={this.handleChange}>
            <BITabs.TabPane tab='项目一' key="1">啦啦</BITabs.TabPane>
            <BITabs.TabPane tab='项目二' key="2">啦啦哈哈</BITabs.TabPane>
          </BITabs>`;

    return (
      <Box title="BITabs">
        <Left>
          <BITabs type="card" tabBarStyle={{backgroundColor:'#fff',color:'#000'}} onChange={this.handleChange}>
            <BITabs.TabPane tab='项目一' key="1">啦啦</BITabs.TabPane>
            <BITabs.TabPane tab='项目二' key="2">啦啦哈哈</BITabs.TabPane>
          </BITabs>

          <Divider orientation="left"> 组件说明 </Divider>

          <div>
            API 同 <a href="https://ant.design/components/tabs-cn/" target="view_window">Ant Tabs</a>
          </div>

        </Left>
        <Right>
          <TextArea rows={5} defaultValue={val} />
        </Right>
      </Box>
    )
  }
}

export default DocTabs;

