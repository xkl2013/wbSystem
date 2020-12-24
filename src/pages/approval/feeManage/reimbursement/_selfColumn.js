import React from 'react';
import moment from 'moment';
import { FEE_APPLY_TYPE_LIST, DEAL_STATUS } from '@/utils/enum';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { renderTxt } from '@/utils/hoverPopover';
import BITable from '@/ant_components/BITable';
import { DATE_FORMAT } from '@/utils/constants';
import checkDetail from '@/pages/newApproval/_utils/checkDetail';

// 获取table列表头
export function columnsFn() {
    const columns = [
        {
            title: '费用报销单编号',
            key: 'reimburseCode',
            dataIndex: 'reimburseCode',
        },
        {
            title: '申请日期',
            key: 'reimburseApplyTime',
            dataIndex: 'reimburseApplyTime',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '实际报销人',
            key: 'reimburseReimbureUserName',
            dataIndex: 'reimburseReimbureUserName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '实际报销人所属部门',
            key: 'reimburseReimbureUserDeptNameParent',
            dataIndex: 'reimburseReimbureUserDeptNameParent',
            render: (text) => {
                const args = text && text.replace(/,/g, '、');
                return <span style={{ cursor: 'pointer' }}>{renderTxt(args)}</span>;
            },
        },
        {
            title: '费用承担主体',
            key: 'reimburseFeeTakerMainName',
            dataIndex: 'reimburseFeeTakerMainName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '收款对象',
            key: 'reimburseChequesName',
            dataIndex: 'reimburseChequesName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '报销总金额',
            key: 'reimburseTotalFee',
            dataIndex: 'reimburseTotalFee',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
        },
        {
            title: '报销事由',
            key: 'reimburseReason',
            dataIndex: 'reimburseReason',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text, 5)}</span>;
            },
        },
        {
            title: '审批状态',
            key: 'reimburseApproveStatus',
            dataIndex: 'reimburseApproveStatus',
            render: (text) => {
                return getOptionName(FEE_APPLY_TYPE_LIST, text);
            },
        },
        {
            title: '处理状态',
            key: 'handleStatus',
            dataIndex: 'handleStatus',
            render: (text) => {
                return getOptionName(DEAL_STATUS, text);
            },
        },
        {
            title: '处理时间',
            key: 'handleDate',
            dataIndex: 'handleDate',
            render: (text, record) => {
                if (record.handleStatus === 2) {
                    return text;
                }
                return null;
            },
        },
        {
            title: '操作',
            key: 'operate',
            dataIndex: 'operate',
            width: 100,
            render: (text, record) => {
                return (
                    <div>
                        <button
                            type="button"
                            style={{
                                color: '#04b4ad',
                                cursor: 'pointer',
                                outline: 'none',
                                margin: 0,
                                padding: 0,
                                backgroundColor: 'transparent',
                                border: 'none',
                            }}
                            onClick={() => {
                                checkDetail({ instanceId: record.reimburseInstanceId });
                                // return props.gotoDetail(record.reimburseInstanceId);
                            }}
                        >
                            {' '}
                            查看
                        </button>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}

// 获取table列表头
export function columnsChildFn(e) {
    e.reimburseProjects.map((item, i) => {
        const result = item;
        result.index = i + 1;
        return result;
    });

    const columns = [
        {},
        {
            key: 0,
            title: '序列',
            dataIndex: 'index',
        },
        {
            key: 'reimburseProjectName',
            title: '项目',
            dataIndex: 'reimburseProjectName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            key: 'reimburseActorBlogerName',
            title: '艺人/博主',
            dataIndex: 'reimburseActorBlogerName',
        },
        {
            key: 'reimburseFeeTypeName',
            title: '费用类型',
            dataIndex: 'reimburseFeeTypeName',
        },
        {
            key: 'reimburseFeeApply',
            title: '申请报销金额',
            dataIndex: 'reimburseFeeApply',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
        },
        {},
    ];
    return <BITable rowKey="reimburseReId" columns={columns} dataSource={e.reimburseProjects} pagination={false} />;
}
