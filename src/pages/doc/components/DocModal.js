import React, { Component } from 'react';
import {Divider,Input} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BIModal from '@/ant_components/BIModal';
import BIButton from '@/ant_components/BIButton';

const { TextArea } = Input;


class DocModal extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const val =
`import BIModal from '@/ant_components/BIModal';
<BIModal
  title="Basic Modal"
  visible={this.state.visible}
  onOk={this.handleOk}
  onCancel={this.handleCancel}
  footer={[
    <BIButton style={{marginRight:10}} onClick={this.handleCancel}>取消</BIButton>,
    <BIButton type="primary" onClick={this.handleOk}>确定</BIButton>
  ]}
>
  <p>Some contents...</p>
  <p>Some contents...</p>
</BIModal>
`;

    return (
      <Box title="BIModal 对话框">
        <Left>

          <BIButton type="primary" onClick={this.showModal}>
            Open Modal
          </BIButton>
          <BIModal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <BIButton style={{marginRight:10}} onClick={this.handleCancel}>取消</BIButton>,
              <BIButton type="primary" onClick={this.handleOk}>确定</BIButton>
            ]}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
          </BIModal>

          <Divider orientation="left"> 组件说明 </Divider>
          <div>
            API 同 <a href="https://ant.design/components/modal-cn/" target="view_window">Ant Modal</a>
          </div>
        </Left>
        <Right>
          <TextArea rows={5} defaultValue={val} />
        </Right>
      </Box>
    )
  }
}


export default DocModal;

