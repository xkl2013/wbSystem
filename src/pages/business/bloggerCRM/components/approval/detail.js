import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Modal } from 'antd';
import AuthButton from '@/components/AuthButton';
import BIRadio from '@/ant_components/BIRadio';
import Approval from '@/pages/business/project/common/components/detail/_approval';
import ApprovalBtns from '@/components/ApprovalBtns';
import FlexDetail from '@/components/flex-detail';
import { getOptionName, riseDimension } from '@/utils/utils';
import { SIGN_YEAR, TALENT_CONTRACT_TYPE } from '@/utils/enum';
import FileDetail from '@/components/upload/detail';
import { getApprovalDetail, getInstance, getApprovalDetailById } from '../../service';
import styles from './index.less';

const getGeneralCols = () => {
    const cols = [
        {
            key: 'talentName',
            label: 'talent名称',
        },
        {
            key: 'signYear',
            label: '签约年限',
            render: (detail) => {
                return getOptionName(SIGN_YEAR, detail.signYear);
            },
        },
        {
            key: 'talentContractType',
            label: '合约类型',
            render: (detail) => {
                return getOptionName(TALENT_CONTRACT_TYPE, detail.talentContractType);
            },
        },
        {
            key: 'divideRateCompany',
            label: '分成比例（艺人：公司）',
            render: (detail) => {
                return `${detail.divideRateTalent * 100}:${detail.divideRateCompany * 100}`;
            },
        },
        {
            key: 'remark',
            label: '备注',
            render: (detail) => {
                return (
                    <a target="_blank" rel="noopener noreferrer" href={detail.remark}>
                        {detail.remark}
                    </a>
                );
            },
        },
        {
            key: 'attachmentUrl',
            label: '附件',
            render: (detail) => {
                if (!detail.attachmentUrl) {
                    return null;
                }
                return <FileDetail data={[{ value: detail.attachmentUrl, name: detail.attachmentName }]} />;
            },
        },
    ];
    return riseDimension(cols, 3);
};
const Detail = (props, ref) => {
    const [type, setType] = useState('1');
    const [instanceId, setInstanceId] = useState();
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [instanceData, setInstanceData] = useState({});
    const [approvalIcon, setApprovalIcon] = useState();

    // 初始化数据 (复用组件必填，不能更改)
    const initData = () => {
        setType('1');
        getDataByInstanceId();
    };

    // 通过rowId获取详情
    const getDataByRowId = async (rowId) => {
        const result = await getApprovalDetail(rowId);
        if (result && result.success && result.data) {
            setInstanceId(result.data.instanceId);
            setFormData(result.data || {});
        }
    };

    // 通过实例id获取详情
    const getDataByInstanceId = async (id = instanceId) => {
        const result = await getApprovalDetailById(id);
        if (result && result.success && result.data) {
            setInstanceId(id);
            setFormData(result.data || {});
        }
    };

    // 获取审批流
    const getInstanceData = async () => {
        const result = await getInstance(instanceId);
        if (result && result.success) {
            setInstanceData(result.data || {});
        }
    };

    const tabChange = (e) => {
        // tab切换
        const value = e.target.value;
        setType(value);
        if (Number(value) === 1) {
            getDataByInstanceId();
        } else {
            getInstanceData();
        }
    };

    const hideModal = () => {
        setVisible(false);
    };

    const showModal = async ({ rowId, instanceId }) => {
        if (rowId) {
            getDataByRowId(rowId);
        } else if (instanceId) {
            getDataByInstanceId(instanceId);
        }
        setVisible(true);
    };
    useImperativeHandle(ref, () => {
        return {
            showModal,
            hideModal,
        };
    });

    return (
        <Modal
            visible={visible}
            title="主播管理"
            onCancel={hideModal}
            footer={null}
            width={800}
            bodyStyle={{ padding: 0, maxHeight: '70vh', overflow: 'auto' }}
            destroyOnClose={true}
        >
            <div className={styles.detailPage}>
                {approvalIcon}
                {instanceId && (
                    <div className={styles.rightBtns}>
                        <ApprovalBtns
                            instanceId={instanceId}
                            commonCallback={initData}
                            approvalIconCallback={(node) => {
                                setApprovalIcon(node);
                            }}
                        />
                    </div>
                )}
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio value={type} buttonStyle="solid" onChange={tabChange}>
                        <AuthButton>
                            <BIRadio.Button className={styles.tabBtn} value="1">
                                概况
                            </BIRadio.Button>
                        </AuthButton>
                        <AuthButton>
                            <BIRadio.Button className={styles.tabBtn} value="2">
                                审批
                            </BIRadio.Button>
                        </AuthButton>
                    </BIRadio>
                </div>
                {Number(type) === 1 && (
                    <FlexDetail LabelWrap={getGeneralCols(formData)} detail={formData} title="博主拓展概况" />
                )}
                {Number(type) === 2 && <Approval instanceData={instanceData} />}
            </div>
        </Modal>
    );
};

export default forwardRef(Detail);
