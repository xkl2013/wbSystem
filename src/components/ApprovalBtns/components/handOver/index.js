import React, { Component } from 'react';
import { message, Modal } from 'antd';
import { msgF } from '@/utils/utils';
import storage from '@/utils/storage';

import BIInput from '@/ant_components/BIInput';
import BIButton from '@/ant_components/BIButton';
import SubmitButton from '@/components/SubmitButton';
import NotifyNode from '@/components/notifyNode/user_org_jole';

import { handOverProject } from '../../services';
import styles from './styles.less';

class HandOver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, // 弹框是否显示
            value: '', // 理由
            user: [],
        };
    }

    initData = () => {
        this.setState({
            visible: true,
            value: '',
            user: [],
        });
    };

    inputChange = (e) => {
        e.persist();
        const value = e.target && e.target.value;
        this.setState({
            value,
        });
    };

    userChange = (e) => {
        this.setState({
            user: e,
        });
    };

    onCancel = () => {
        this.setState({
            visible: false,
        });
    };

    onOk = () => {
        let { value } = this.state;
        const { user } = this.state;

        if (!user || user.length === 0) {
            message.error(msgF('请选择转交人'));
            return;
        }
        value = value.trim();
        if (!value) {
            message.error(msgF('请输入转交理由'));
            return;
        }
        this.handOver();
    };

    handOver = async () => {
        // 转交
        const id = this.props.instanceId;
        if (!id) {
            message.error(msgF('id不存在'));
            return;
        }
        const { value, user } = this.state;
        const { userName } = storage.getUserInfo();
        const str = `${userName}转交给${user[0].name}：`;
        const data = {
            opinion: {
                opinion: str + value,
            },
            acceptUser: {
                userId: user[0].id,
                userName: user[0].name,
            },
        };
        const result = await handOverProject(id, data);
        if (result && result.success) {
            message.success(msgF(result.message));
            this.onCancel();
            this.props.getInstanceData(id);
            // eslint-disable-next-line no-unused-expressions
            this.props.handOverCallback && this.props.handOverCallback();
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
                title="转交"
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
                    <span className={`${styles.itemSpan} ${styles.itemSpan1}`}>转交给：</span>
                    <div className={styles.itemDiv}>
                        <NotifyNode
                            length={1}
                            isShowClear
                            pannelConfig={{
                                user: {},
                            }}
                            disabled={!!(this.state.user && this.state.user.length > 0)}
                            data={this.state.user}
                            onChange={this.userChange}
                        />
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

export default HandOver;
