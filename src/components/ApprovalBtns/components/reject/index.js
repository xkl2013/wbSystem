import React, { Component } from 'react';
import { message } from 'antd';
import { msgF } from '@/utils/utils';

import BIButton from '@/ant_components/BIButton';
import SubmitButton from '@/components/SubmitButton';
import ModalComponent from './ModalComponent';

import { rejectProject } from '../../services';

class Reject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, // 弹框是否显示
            value: '', // 理由
        };
    }

    initData = () => {
        this.setState({
            visible: true,
            value: '',
        });
    };

    inputChange = (e) => {
        e.persist();
        const value = e.target && e.target.value;
        this.setState({
            value,
        });
    };

    onCancel = () => {
        this.setState({
            visible: false,
        });
    };

    onOk = () => {
        let { value } = this.state;
        value = value.trim();
        if (!value) {
            message.error(msgF('请输入驳回理由'));
            return;
        }
        this.reject(value);
    };

    reject = async (opinion) => {
        // 驳回
        const id = this.props.instanceId;
        if (!id) {
            message.error(msgF('id不存在'));
            return;
        }
        const result = await rejectProject(id, { opinion });
        if (result && result.success) {
            message.success(msgF(result.message));
            this.onCancel();
            this.props.getInstanceData(id);
            // eslint-disable-next-line no-unused-expressions
            this.props.rejectCallback && this.props.rejectCallback();
            // eslint-disable-next-line no-unused-expressions
            this.props.commonCallback && this.props.commonCallback();
            if (this.props.successGo) {
                this.props.successGo();
            }
        }
    };

    render() {
        return (
            <ModalComponent
                visible={this.state.visible}
                inputChange={this.inputChange}
                value={this.state.value}
                title="驳回理由"
                onCancel={this.onCancel}
                onOk={this.onOk}
                footer={
                    <div>
                        <BIButton onClick={this.onCancel}>取消</BIButton>
                        <SubmitButton type="primary" style={{ marginLeft: '10px' }} onClick={this.onOk}>
                            确定
                        </SubmitButton>
                    </div>
                }
            />
        );
    }
}

export default Reject;
