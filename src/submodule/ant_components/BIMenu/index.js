import React from 'react';
import { Menu } from 'antd';
import './style.less';

const Item = Menu.Item;
/*
* Menu 组件
*
* 基于原 ant Menu
* 只扩展自定义样式
* */

class BIMenu extends React.Component {

  render() {
    return (
      <div className='BIMenu'>
        <Menu {...this.props}>
          {this.props.children}
        </Menu>
      </div>
    );
  }
}

export { BIMenu as default };
BIMenu.Item = Item;
