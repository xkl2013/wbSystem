import React, { Component } from 'react';
import {Divider,Input,Radio} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BIRadio from '@/ant_components/BIRadio';
const { TextArea } = Input;


class DocButton extends Component {
  render() {
    const btn =
`import BIRadio from '@/ant_components/BIRadio'
    <BIRadio>
      <Radio.Button value="top">Horizontal</Radio.Button>
      <Radio.Button value="left">Vertical</Radio.Button>
    </BIRadio>`;

    return (
      <Box title="BIRadio 按钮">
        <Left>
          <BIRadio>
            <Radio.Button value="top">Horizontal</Radio.Button>
            <Radio.Button value="left">Vertical</Radio.Button>
          </BIRadio>
          <Divider orientation="left"> 组件说明 </Divider>
          <div>
            API 同 <a href="https://ant.design/components/button-cn/" target="view_window">Ant Button</a>
          </div>
        </Left>
        <Right>
          <TextArea rows={5} defaultValue={btn} />
        </Right>
      </Box>
    )
  }
}


export default DocButton;

