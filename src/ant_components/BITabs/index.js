import React from 'react';
import { Tabs } from 'antd';
import './style.less';

const TabPane = Tabs.TabPane;
/*
* Tabs 组件
*
* 基于原 ant Tabs
* 只扩展自定义样式
* */

class BITabs extends React.Component {

  render() {
    return (
      <span className='BITabs'>
        <Tabs {...this.props}>
          {this.props.children}
        </Tabs>
      </span>
    );
  }
}

export default BITabs;
BITabs.TabPane = TabPane;
