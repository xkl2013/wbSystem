import React, { Component } from 'react';
import {Divider,Input} from 'antd';
import OrgTreeSelect from '@/components/orgTreeSelect';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BITreeSelect from '@/ant_components/BITreeSelect';
const { TextArea } = Input;


class DocButton extends Component {
  state = {
    value: undefined,
  }
  onChange = (value,label,extra) => {
    const level = extra && extra.triggerNode && extra.triggerNode.props ? extra.triggerNode.props.lv: 0;
    console.log(value);
    console.log(label);
    console.log(extra);
    console.log(level);
    this.setState({ value });
  }
  render() {
    const btn =
`import BITreeSelect from '@/ant_components/BITreeSelect';

<BITreeSelect
  style={{ width: 300 }}
  value={this.state.value}
  allowClear
  multiple
  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
  treeData={treeData}
  placeholder="Please select"
  treeDefaultExpandAll
  onChange={this.onChange}
/>`;

    const treeData = [{
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      lv: 1,
      children: [{
        title: 'Child Node1',
        value: '0-0-1',
        key: '0-0-1',
        lv: 2,
      }, {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
        lv: 2,
      }],
    }, {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
      lv: 1,
    }];

    return (
      <Box title="BITreeSelect 树选择">
        <Left>
          <BITreeSelect
            style={{ width: 300 }}
            value={this.state.value}
            allowClear
            multiple
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="Please select"
            treeDefaultExpandAll
            onChange={this.onChange}
          />
          <Divider orientation="left"> 组件说明 </Divider>
          <div>
            API 同 <a href="https://ant.design/components/tree-select-cn/" target="view_window">Ant TreeSelect</a>
          </div>
         <OrgTreeSelect/>
        </Left>
        <Right>
          <TextArea rows={5} defaultValue={btn} />
        </Right>
      </Box>
    )
  }
}


export default DocButton;

