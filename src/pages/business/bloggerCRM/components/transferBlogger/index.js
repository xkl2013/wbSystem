import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Steps } from 'antd';
import { moveData } from '../../service';
import SelectSession from '../selectSession';
import TransferSuccess from '../transferSuccess';
import s from './index.less';

const { Step } = Steps;
// Modal标题映射
const titleMap = {
    1: '博主移至',
};

const TransferBlogger = (props, ref) => {
    const { successCb, tableId } = props;
    // 操作类型
    const [titleIndex, setTitleIndex] = useState(1);
    // 操作数据（选择的产品）
    const [selectedRows, setSelectedRows] = useState([]);
    // 当前进度
    const [currStep, setCurrStep] = useState(0);
    const [visible, setVisible] = useState(false);
    // 第一步的表单数据
    const [formData, setFormData] = useState({});

    const showModal = async ({ titleIndex, selectedRows }) => {
        // 初始化时清空数据和进度
        setFormData({});
        setCurrStep(0);
        setTitleIndex(titleIndex || props.titleIndex || 1);
        setSelectedRows(selectedRows || props.selectedRows);
        setVisible(true);
    };
    const hideModal = () => {
        setVisible(false);
    };
    useImperativeHandle(ref, () => {
        return {
            showModal,
        };
    });
    // 进入第二步必填校验
    const transfer = async (values) => {
        setFormData(values);
        const res = await moveData({ data: values });
        if (res && res.success) {
            setCurrStep(1);
        }
    };

    return (
        <Modal
            title="博主移至"
            maskClosable={false}
            visible={visible}
            onCancel={hideModal}
            footer={null}
            width={1285}
            destroyOnClose={true}
        >
            <Steps className={s.steps} current={currStep}>
                <Step title="选择移至目标" />
                <Step title="提交成功" />
            </Steps>
            {currStep === 0 && (
                <SelectSession
                    selectedRows={selectedRows}
                    formData={formData}
                    titleIndex={titleIndex}
                    handleCancel={hideModal}
                    handleSubmit={transfer}
                    tableId={tableId}
                />
            )}
            {currStep === 1 && (
                <TransferSuccess
                    tableId={formData.groupId}
                    title={titleMap[titleIndex]}
                    handleCancel={hideModal}
                    successCb={successCb}
                />
            )}
        </Modal>
    );
};

export default forwardRef(TransferBlogger);
