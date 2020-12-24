import React from 'react';
import ReactDOM from 'react-dom';
import GeneralCom from '@/components/General';
import { Input, message } from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';
import styles from './styles.less';
import BIButton from '@/ant_components/BIButton';
import { getComponent } from '@/components/airTable/component/baseComponent/index.js'
const { TextArea } = Input;
const Node = getComponent('FILE');


class DocButton extends React.Component {
  state = {
    value: ''
  }
  onChange = (value) => {
    console.log(value, 222)
    this.setState({ value })
  }
  render() {
    return (
      <Box title="自定义form展示">
        <Node value={this.state.value} onChange={this.onChange} componentAttr={{ options: [{ id: '1', name: '男' }, { id: '2', name: '女' }] }} />
      </Box>
    )
  }
}


export default DocButton;