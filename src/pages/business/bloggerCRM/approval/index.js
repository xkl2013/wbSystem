import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import AuthButton from '@/components/AuthButton';
import BIRadio from '@/ant_components/BIRadio';
import Approval from '@/pages/business/project/common/components/detail/_approval';
import ApprovalBtns from '@/components/ApprovalBtns';
import FlexDetail from '@/components/flex-detail';
import { getOptionName, riseDimension } from '@/utils/utils';
import { getSearch } from '@/utils/urlOp';
import { SIGN_YEAR, TALENT_CONTRACT_TYPE } from '@/utils/enum';
import FileDetail from '@/components/upload/detail';
import { accMul } from '@/utils/calculate';
import storage from '@/utils/storage';
import BIButton from '@/ant_components/BIButton';
import Notice from '@/pages/business/components/noticers';
import EditApproval from '../components/approval/addOrUpdate';
import { getApprovalDetail, getInstance, getApprovalDetailById, startApproval, rebackApproval } from '../service';
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
                return `${detail.divideRateTalent}:${detail.divideRateCompany}`;
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
    return riseDimension(cols);
};
const detail2form = (detail) => {
    if (detail.divideRateTalent) {
        detail.divideRateTalent = accMul(detail.divideRateTalent, 100);
    }
    if (detail.divideRateCompany) {
        detail.divideRateCompany = accMul(detail.divideRateCompany, 100);
    }
    return detail;
};
const Detail = (props) => {
    const { dispatch } = props;
    const [type, setType] = useState('1');
    const [resubmitEnum, setResubmitEnum] = useState(1);
    const [formData, setFormData] = useState({});
    const [instanceData, setInstanceData] = useState({});
    const [approvalIcon, setApprovalIcon] = useState();
    const editApprovalForm = useRef(null);

    useEffect(() => {
        initData();
    }, []);

    // 初始化数据 (复用组件必填，不能更改)
    const initData = () => {
        const { rowId, id } = getSearch();
        if (rowId) {
            getDataByRowId(rowId);
        } else if (id) {
            getDataByInstanceId(id);
        }
    };

    // 通过rowId获取详情
    const getDataByRowId = async (rowId) => {
        const result = await getApprovalDetail(rowId);
        if (result && result.success && result.data) {
            const formData = detail2form(result.data);
            setFormData(formData);
            getInstanceData(result.data.instanceId);
        }
    };

    // 通过实例id获取详情
    const getDataByInstanceId = async (id) => {
        const result = await getApprovalDetailById(id);
        if (result && result.success && result.data) {
            const formData = detail2form(result.data);
            setFormData(formData);
            getInstanceData(result.data.instanceId);
        }
    };

    // 获取审批流
    const getInstanceData = async (instanceId) => {
        const result = await getInstance(instanceId);
        if (result && result.success) {
            setInstanceData(result.data || {});
        }
    };
    // 审批状态/审批流id变化时更新header上的按钮
    useEffect(() => {
        renderHeader();
    }, [instanceData.id, formData.approvalStatus]);
    // 标题回调
    const renderHeader = () => {
        dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: '博主拓展详情',
                component: rightBtns(),
            },
        });
    };
    // 审批操作回调
    const commonCallback = () => {
        initData();
        if (window.opener && window.opener.bus_sync_bloggerCRM) {
            window.opener.bus_sync_bloggerCRM();
        }
    };
    // 回退编辑/重新提交回调
    const editCallback = (resubmitEnum) => {
        setResubmitEnum(resubmitEnum);
        if (editApprovalForm && editApprovalForm.current && editApprovalForm.current.showModal) {
            editApprovalForm.current.showModal(formData);
        }
    };
    // 右上按钮
    const rightBtns = () => {
        const { approvalStatus, producerUserId } = formData;
        return (
            <div>
                {// 驳回/撤销
                    (Number(approvalStatus) === 4 || Number(approvalStatus) === 5)
                    && storage.getUserInfo().userId === producerUserId && (
                        <BIButton type="primary" className={styles.headerBtn} onClick={editCallback.bind(null, 2)}>
                            重新提交
                        </BIButton>
                    )}
                <ApprovalBtns
                    instanceId={instanceData.id}
                    approvalStatus={approvalStatus}
                    commonCallback={commonCallback}
                    editCallback={editCallback.bind(null, 1)}
                    approvalIconCallback={(node) => {
                        setApprovalIcon(node);
                    }}
                />
            </div>
        );
    };

    const onEdit = async (values) => {
        let func;
        if (resubmitEnum === 1) {
            func = rebackApproval;
            values.id = formData.id;
        } else if (resubmitEnum === 2) {
            func = startApproval;
        }
        values.expandId = formData.expandId;
        values.divideRateTalent /= 100;
        values.divideRateCompany /= 100;
        values.noticeList = Notice.getNoticeData() || [];
        const res = await func({ data: values });
        if (res && res.success) {
            editApprovalForm.current.hideModal();
            commonCallback();
        }
    };

    const tabChange = (e) => {
        // tab切换
        const value = e.target.value;
        setType(value);
    };

    return (
        <div className={styles.detailPage}>
            {approvalIcon}
            <div className={styles.detailTabBtnWrap}>
                <BIRadio value={type} buttonStyle="solid" onChange={tabChange}>
                    <AuthButton authority="/foreEnd/business/bloggerCRM/approval/info">
                        <BIRadio.Button className={styles.tabBtn} value="1">
                            概况
                        </BIRadio.Button>
                    </AuthButton>
                    <AuthButton authority="/foreEnd/business/bloggerCRM/approval/apply">
                        <BIRadio.Button className={styles.tabBtn} value="2">
                            审批
                        </BIRadio.Button>
                    </AuthButton>
                </BIRadio>
            </div>
            {Number(type) === 1 && (
                <FlexDetail LabelWrap={getGeneralCols(formData)} detail={formData} title="博主拓展信息" />
            )}
            {Number(type) === 2 && <Approval instanceData={instanceData} />}
            <EditApproval ref={editApprovalForm} onSubmit={onEdit} />
        </div>
    );
};

export default connect()(Detail);
