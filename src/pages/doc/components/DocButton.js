import React, { Component } from 'react';
import {Divider,Input} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BIButton from '@/ant_components/BIButton';
const { TextArea } = Input;


class DocButton extends Component {
  render() {
    const btn =
`import BIButton from '@/ant_components/BIButton'

<BIButton type="primary">查询</BIButton>
<BIButton>重置</BIButton>
<BIButton size="small" type="primary">small</BIButton>
<BIButton size="large" type="primary">large</BIButton>`;

    return (
      <Box title="BIButton 按钮">
        <Left>
          <BIButton type="primary">查询</BIButton> &nbsp;
          <BIButton>重置</BIButton> &nbsp;
          <BIButton size='small' type="primary">small</BIButton>&nbsp;
          <BIButton size='large' type="primary">large</BIButton>
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

