import React, { Component } from 'react';
import { Divider, Input } from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

const { TextArea } = Input;

class DocSelect extends Component {
  handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  render() {
    const val =
      `import BISelect from '@/ant_components/BISelect';

<BISelect defaultValue="lucy" style={{ width: 200 }} onChange={this.handleChange}>
  <BISelect.Option value="jack">Jack</BISelect.Option>
  <BISelect.Option value="lucy">Lucy</BISelect.Option>
</BISelect>`;

    return (
      <Box title="TreeFilter 选择器">
        <Left>


          <Divider orientation="left"> 组件说明 </Divider>

          <div>
            API 同 <a href="https://ant.design/components/select-cn/" target="view_window">Ant Select</a>
          </div>

        </Left>
        <Right>
          <TextArea rows={5} defaultValue={val} />
        </Right>
      </Box>
    )
  }
}

export default DocSelect;