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
import BIButton from '@/ant_components/BIButton';
// eslint-disable-next-line import/extensions,import/no-unresolved
import DropDownPanle from '@/components/filterUsers';
import styles from './index.less';
import SubmitButton from '@/components/SubmitButton';

class ModalDemo extends React.Component {
    selectUsers = [];

    handleOk = () => {
        const { clickOK } = this.props;
        if (clickOK) {
            clickOK(Array.from(new Set(this.selectUsers)));
        }
    };

    clickDropDownPanle = (arr) => {
        this.selectUsers = [];
        arr.forEach((item) => {
            const id = typeof item.id === 'string' ? Number(item.id) : item.id;
            this.selectUsers.push(id);
        });
        return this.selectUsers;
    };

    checkoutFootButton = (footButton) => {
        const { hideUserModal } = this.props;
        if (footButton && typeof footButton === 'object' && !Array.isArray(footButton)) {
            // 判断传入的是node
            return footButton;
        }
        const buttonArray = !footButton ? ['取消', '确定'] : footButton;
        if (Array.isArray(buttonArray) && buttonArray.length === 1) {
            return [
                <SubmitButton key={0} onClick={this.handleOk}>
                    {buttonArray[0]}
                </SubmitButton>,
            ];
        }
        if (Array.isArray(buttonArray) && buttonArray.length === 2) {
            return [
                <BIButton key={0} className={styles.modalBtnCls} onClick={hideUserModal}>
                    {buttonArray[0]}
                </BIButton>,
                <SubmitButton type="primary" className={styles.modalBtnCls} key={1} onClick={this.handleOk}>
                    {buttonArray[1]}
                </SubmitButton>,
            ];
        }
    };

    render() {
        const {
            title, modalContent, footButton, visible, maskClosable, value, hideUserModal,
        } = this.props;
        const defaultModal = (
            <div className={styles.contentCls}>
                <DropDownPanle
                    onChange={(val) => {
                        return this.clickDropDownPanle(val);
                    }}
                    value={value}
                />
            </div>
        );
        return (
            visible && (
                <Modal
                    title={title}
                    className={styles.modalAddCls}
                    maskClosable={maskClosable || false}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={hideUserModal}
                    footer={this.checkoutFootButton(footButton)}
                >
                    {!modalContent ? (
                        defaultModal
                    ) : (
                        <div style={{ textAlign: 'center' }} className={styles.modalContent}>
                            {modalContent}
                        </div>
                    )}
                </Modal>
            )
        );
    }
}

export default ModalDemo;
