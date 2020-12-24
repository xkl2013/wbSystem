import React, { Component } from 'react';
import {Divider,Input,Icon} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BIDropDown from '@/ant_components/BIDropDown';
import BIButton from '@/ant_components/BIButton';
import BIMenu from '@/ant_components/BIMenu';

const { TextArea } = Input;

class DocDropDown extends Component {
  handleMenuClick = (value) => {
    console.log(`click ${value}`);
  };

  render() {
    const val =
      `import BIDropDown from '@/ant_components/BIDropDown';
import BIButton from '@/ant_components/BIButton';
import BIMenu from '@/ant_components/BIMenu';

const menu = (
<BIMenu onClick={this.handleMenuClick}>
  <BIMenu.Item key="1"><Icon type="user" />1st menu item</BIMenu.Item>
  <BIMenu.Item key="2"><Icon type="user" />2nd menu item</BIMenu.Item>
  <BIMenu.Item key="3"><Icon type="user" />3rd item</BIMenu.Item>
</BIMenu>
);
<BIDropDown overlay={menu}>
  <BIButton>
    我的条件 <Icon type="down" />
  </BIButton>
</BIDropDown>`;

    const menu = (
      <BIMenu onClick={this.handleMenuClick}>
        <BIMenu.Item key="1"><Icon type="user" />1st menu item</BIMenu.Item>
        <BIMenu.Item key="2"><Icon type="user" />2nd menu item</BIMenu.Item>
        <BIMenu.Item key="3"><Icon type="user" />3rd item</BIMenu.Item>
      </BIMenu>
    );

    return (
      <Box title="BIDropDown 下拉菜单">
        <Left>
          <BIDropDown overlay={menu}>
            <BIButton>
              我的条件 <Icon type="down" />
            </BIButton>
          </BIDropDown>

          <Divider orientation="left"> 组件说明 </Divider>

          <div>
            API 同 <a href="https://ant.design/components/dropdown-cn/" target="view_window">Ant DropDown</a>
          </div>

        </Left>
        <Right>
          <TextArea rows={5} defaultValue={val} />
        </Right>
      </Box>
    )
  }
}

export default DocDropDown;

