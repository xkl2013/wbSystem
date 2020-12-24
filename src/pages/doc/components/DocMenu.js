import React, { Component } from 'react';
import {Divider,Input,Icon} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BIMenu from '@/ant_components/BIMenu';

const { TextArea } = Input;

class DocMenu extends Component {
  handleMenuClick = (value) => {
    console.log(`click ${value}`);
  };

  render() {
    const val =
      `import BIMenu from '@/ant_components/BIMenu';

<BIMenu onClick={this.handleMenuClick}>
  <BIMenu.Item key="1"><Icon type="user" />1st menu item</BIMenu.Item>
  <BIMenu.Item key="2"><Icon type="user" />2nd menu item</BIMenu.Item>
  <BIMenu.Item key="3"><Icon type="user" />3rd item</BIMenu.Item>
</BIMenu>`;

    return (
      <Box title="BIMenu 导航菜单">
        <Left>
          <BIMenu onClick={this.handleMenuClick}>
            <BIMenu.Item key="1"><Icon type="user" />1st menu item</BIMenu.Item>
            <BIMenu.Item key="2"><Icon type="user" />2nd menu item</BIMenu.Item>
            <BIMenu.Item key="3"><Icon type="user" />3rd item</BIMenu.Item>
          </BIMenu>

          <Divider orientation="left"> 组件说明 </Divider>

          <div>
            API 同 <a href="https://ant.design/components/menu-cn/" target="view_window">Ant Menu</a>
          </div>

        </Left>
        <Right>
          <TextArea rows={5} defaultValue={val} />
        </Right>
      </Box>
    )
  }
}

export default DocMenu;

