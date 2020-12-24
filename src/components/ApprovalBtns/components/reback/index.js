import React, { Component } from 'react';
import { message, Modal } from 'antd';
import { msgF } from '@/utils/utils';
import storage from '@/utils/storage';
import BIInput from '@/ant_components/BIInput';
import BIRadio from '@/ant_components/BIRadio';
import BISelect from '@/ant_components/BISelect';

import BIButton from '@/ant_components/BIButton';
import SubmitButton from '@/components/SubmitButton';

import { rebackProject, getProvors } from '../../services';
import styles from './styles.less';

class Reback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, // 弹框是否显示
            value: '', // 理由
            rebackType: 8, // 方式
            rebackNode: null, // 节点
            nodeList: [], // 节点列表
        };
    }

    initData = () => {
        this.setState({
            visible: true,
            value: '',
            rebackType: 8,
            rebackNode: null,
            nodeList: [],
        });
        this.getProvorsMth();
    };

    getProvorsMth = async () => {
        // 获取节点
        const res = await getProvors({
            instanceId: this.props.instanceId,
            status: this.state.rebackType,
        });
        if (res && res.success && res.data && res.data.length > 0) {
            this.setState({
                nodeList: res.data,
            });
        }
    };

    inputChange = (e) => {
        e.persist();
        const value = e.target && e.target.value;
        this.setState({
            value,
        });
    };

    rebackTypeChange = (e) => {
        this.setState(
            {
                rebackType: e.target.value,
                rebackNode: null,
                nodeList: [],
            },
            this.getProvorsMth,
        );
    };

    rebackNodeChange = (e) => {
        this.setState({
            rebackNode: e,
        });
    };

    onCancel = () => {
        this.setState({
            visible: false,
        });
    };

    onOk = () => {
        let { value } = this.state;
        const { rebackNode } = this.state;
        if (rebackNode === null) {
            message.error(msgF('请选择回退节点'));
            return;
        }
        value = value.trim();
        if (!value) {
            message.error(msgF('请输入回退理由'));
            return;
        }
        this.reback();
    };

    reback = async () => {
        // 回退
        const id = this.props.instanceId;
        if (!id) {
            message.error(msgF('id不存在'));
            return;
        }
        const { value, rebackType, rebackNode, nodeList } = this.state;
        const { userName } = storage.getUserInfo();
        const node = nodeList[rebackNode];
        const str = `${userName}回退给${node.name}：`;
        const data = {
            status: rebackType,
            opinion: {
                opinion: str + value,
            },
            approvalFlowNodeDto: {
                id: node.id,
                name: node.name,
            },
        };
        const result = await rebackProject(id, data);
        if (result && result.success) {
            message.success(msgF(result.message));
            this.onCancel();
            this.props.getInstanceData(id);
            // eslint-disable-next-line no-unused-expressions
            this.props.rebackCallback && this.props.rebackCallback();
            // eslint-disable-next-line no-unused-expressions
            this.props.commonCallback && this.props.commonCallback();
            if (this.props.successGo) {
                this.props.successGo();
            }
        }
    };

    render() {
        return (
            <Modal
                visible={this.state.visible}
                title="回退"
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
            >
                <div className={styles.item}>
                    <span className={styles.itemSpan}>回退方式：</span>
                    <div className={styles.itemDiv}>
                        <BIRadio value={this.state.rebackType} onChange={this.rebackTypeChange}>
                            <BIRadio.Radio value={7}>审批人重新操作</BIRadio.Radio>
                            <BIRadio.Radio value={8}>发起人编辑后，审批人重新操作</BIRadio.Radio>
                        </BIRadio>
                    </div>
                </div>
                <div className={styles.item}>
                    <span className={styles.itemSpan}>回退节点：</span>
                    <div className={styles.itemDiv}>
                        <BISelect value={this.state.rebackNode} onChange={this.rebackNodeChange} className={styles.sel}>
                            {this.state.nodeList.map((item, index) => {
                                return (
                                    <BISelect.Option value={index} key={index}>
                                        {item.name}
                                    </BISelect.Option>
                                );
                            })}
                        </BISelect>
                    </div>
                </div>
                <div className={styles.item}>
                    <span className={styles.itemSpan}>审批意见：</span>
                    <div className={styles.itemDiv}>
                        <BIInput.TextArea
                            value={this.state.value}
                            placeholder="请输入"
                            onChange={this.inputChange}
                            maxLength={140}
                            rows={4}
                        />
                        <span className={styles.words}>
                            {this.state.value.length}
                            /
                            {140}
                        </span>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default Reback;
