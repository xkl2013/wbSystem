/*
 * title：字符串，弹框标题
 * visible：布尔值，弹框显隐
 * showModal：函数，控制弹框显隐
 * modalContent：html，弹框中间内容
 * clickOK点击确认按钮回调
 * footButton：数组，['是'，'否']
 * */
import React from 'react';
import { Modal } from 'antd';
import _ from 'lodash';
import DropDownPanel from '../index.tsx';
import styles from './styles.less';

class ModalDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
        };
    }

    componentDidMount = () => {
        this.initValue(this.props.value);
    };

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initValue(nextProps.value);
        }
    }

    initValue = (value) => {
        const newValue = _.cloneDeep(value);
        this.setState({ value: newValue });
    };

    handleOk = (e) => {
        e.stopPropagation();
        const { handleOk } = this.props;
        if (handleOk) {
            handleOk(this.state.value);
        }
    };

    clickDropDownPanel = (value) => {
        this.setState({ value });
    };

    render() {
        const { title, visible, zIndex, onCancel } = this.props;
        const { value } = this.state;
        return !visible ? null : (
            <Modal
                zIndex={zIndex || 1000}
                width={800}
                title={title}
                className={styles.modalAddCls}
                maskClosable={false}
                visible={visible}
                onOk={this.handleOk}
                onCancel={onCancel}
            >
                <DropDownPanel {...this.props} onChange={this.clickDropDownPanel} value={value} />
            </Modal>
        );
    }
}
export default ModalDemo;
