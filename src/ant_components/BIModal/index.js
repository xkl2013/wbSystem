import React from 'react';
import { Modal } from 'antd';
import './style.less';

const confirm = Modal.confirm;

/*
 * Modal 组件
 *
 * 基于原 ant Modal
 * 只扩展自定义样式
 * */
// wrapClassName不传默认BIModalWrap
class BIModal extends React.PureComponent {
    render() {
        return (
            <span className="BIModal">
                <Modal wrapClassName="BIModalWrap" cancelText="取消" okText="确定" {...this.props}>
                    {this.props.children}
                </Modal>
            </span>
        );
    }
}

export { BIModal as default };
BIModal.confirm = (config = {}) => {
    return confirm({
        cancelText: '取消',
        okText: '确定',
        ...config,
    });
};
BIModal.warning = Modal.warning;
