import React from 'react';
import { Modal } from 'antd';
import './style.less';


/*
 * Modal 组件
 *
 * 基于原 ant Modal
 * 只扩展自定义样式
 * */
// wrapClassName不传默认BIModalWrap
const BIModal = (props) => {

    return (
        <Modal
            wrapClassName="BIModalWrap"
            focusTriggerAfterClose={false}
            {...props}>
            {props.children}
        </Modal>
    );

}

export default BIModal

