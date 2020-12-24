import React, { Component } from 'react';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import BIInputNumber from '@/ant_components/BIInputNumber';
import { initialize } from '../services';
import styles from './index.less';

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            value: new Date().getFullYear(),
        };
    }

    initData = () => {
        // 初始化
        this.setState({
            modalVisible: true,
        });
    };

    onChange = (e) => {
        this.setState({
            value: e,
        });
    };

    modalCancel = () => {
        // 模态框关闭
        this.setState({
            modalVisible: false,
        });
    };

    // 提交数据
    modalOk = async () => {
        const { value } = this.state;
        if (!value) {
            message.error('请输入初始化年');
            return;
        }
        const response = await initialize({ bloggerRecommendYear: value });
        if (response && response.success) {
            message.success('初始化成功');
            this.setState({ modalVisible: false });
            // eslint-disable-next-line
            this.props.refresh && this.props.refresh();
        }
    };

    render() {
        const { modalVisible, value } = this.state;
        return (
            <>
                <BIModal
                    visible={modalVisible}
                    centered="center"
                    title="初始化数据"
                    onCancel={this.modalCancel}
                    onOk={this.modalOk}
                >
                    <p className={styles.mb20}>请输入要初始化的年份</p>
                    <BIInputNumber min={2000} max={3000} value={value} precision={0} onChange={this.onChange} />
                </BIModal>
            </>
        );
    }
}

export default Recommend;
