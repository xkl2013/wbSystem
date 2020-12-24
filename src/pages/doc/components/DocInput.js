import React, { Component } from 'react';
import {Divider,Input} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BIInput from '@/ant_components/BIInput';
const { TextArea } = Input;


class DocInput extends Component {

  render() {
    const val =
      `import BIInput from '@/ant_components/BIInput';

<BIInput placeholder="请输入" />`;

    return (
      <Box title="BIInput 输入框">
        <Left>
          <BIInput placeholder="请输入" /> &nbsp;

          <Divider orientation="left"> 组件说明 </Divider>
          <div>
            API 同 <a href="https://ant.design/components/input-cn/" target="view_window">Ant Input</a>
          </div>
        </Left>
        <Right>
          <TextArea rows={5} defaultValue={val} />
        </Right>
      </Box>
    )
  }
}

export default DocInput;

