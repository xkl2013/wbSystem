import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Steps } from 'antd';
import { getModuleFromTableId } from '@/config/business';
import { getDetail } from '@/pages/business/live/session/service';
import SelectSession from '../selectSession';
import CheckRequired from '../checkRequired';
import TransferSuccess from '../transferSuccess';
import s from './index.less';

const { Step } = Steps;
// Modal标题映射
const titleMap = {
    1: '商品添加',
    2: '商品移至',
    3: '商品复制',
    4: '商品通过',
};
/**
 * 获取场次名称
 * @param tableId           表（艺人27/博主33）
 * @param liveId            场次id
 * @returns {Promise<*>}
 */
const getLiveName = async (tableId, liveId) => {
    const res = await getDetail({
        tableId: tableId > 31 ? 33 : 27, // 默认艺人，大于31为博主
        rowId: liveId,
    });
    if (res && res.success && res.data) {
        const liveCode = res.data.rowData.find((item) => {
            return item.colName === 'liveCode';
        });
        if (liveCode && liveCode.cellValueList && liveCode.cellValueList[0]) {
            return liveCode.cellValueList[0].text;
        }
    }
};
const TransferProduct = (props, ref) => {
    const { successCb, tableId, liveId } = props;
    // 操作类型
    const [titleIndex, setTitleIndex] = useState(1);
    // 操作数据（选择的产品）
    const [selectedRows, setSelectedRows] = useState([]);
    // 当前进度
    const [currStep, setCurrStep] = useState(0);
    const [visible, setVisible] = useState(false);
    // 第一步的表单数据
    const [formData, setFormData] = useState({});

    const showModal = async (titleIndex, selectedRows) => {
        if (titleIndex === 4) {
            // 通过操作时需构造目标table的数据
            const liveName = await getLiveName(tableId, liveId);
            setFormData({
                businessLiveId: liveId,
                businessLiveName: liveName,
                groupId: tableId + 1, // 通过时目标table为下一个table
                groupName: getModuleFromTableId(tableId + 1).name,
            });
            // 默认跳过第一步
            setCurrStep(1);
        } else {
            // 初始化时清空数据和进度
            setFormData({});
            setCurrStep(0);
        }
        setTitleIndex(titleIndex || props.titleIndex);
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
    const checkRequired = (values) => {
        setFormData(values);
        setCurrStep(1);
    };
    // 必填校验通过进入第三步
    const transfer = () => {
        setCurrStep(2);
    };
    // 返回上一步
    const goBack = () => {
        let prevStep = currStep - 1;
        if (prevStep < 0) {
            prevStep = 0;
        }
        setCurrStep(prevStep);
    };

    return (
        <Modal
            title={titleMap[titleIndex]}
            maskClosable={false}
            visible={visible}
            onCancel={hideModal}
            footer={null}
            width={1285}
            destroyOnClose={true}
        >
            <Steps className={s.steps} current={currStep}>
                <Step title="选择场次" />
                <Step title="必填校验" />
                <Step title="提交成功" />
            </Steps>
            {currStep === 0 && (
                <SelectSession
                    selectedRows={selectedRows}
                    formData={formData}
                    liveId={liveId}
                    titleIndex={titleIndex}
                    handleCancel={hideModal}
                    handleSubmit={checkRequired}
                />
            )}
            {currStep === 1 && (
                <CheckRequired
                    selectedRows={selectedRows}
                    curTableId={tableId}
                    tableId={formData.groupId}
                    liveId={formData.businessLiveId}
                    handleCancel={goBack}
                    handleSubmit={transfer}
                    titleIndex={titleIndex}
                />
            )}
            {currStep === 2 && (
                <TransferSuccess
                    tableId={formData.groupId}
                    liveId={formData.businessLiveId}
                    title={titleMap[titleIndex]}
                    handleCancel={hideModal}
                    successCb={successCb}
                />
            )}
        </Modal>
    );
};

export default forwardRef(TransferProduct);
