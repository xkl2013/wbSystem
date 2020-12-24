import React from 'react';
import moment from 'moment';
import { DEAL_STATUS, FEE_APPLY_TYPE_LIST, WRITE_OFF_STATUS } from '@/utils/enum';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { renderTxt } from '@/utils/hoverPopover';
import BITable from '@/ant_components/BITable';
import { DATE_FORMAT } from '@/utils/constants';
import checkDetail from '@/pages/newApproval/_utils/checkDetail';

// 获取table列表头
export function columnsFn() {
    const columns = [
        {
            title: '费用申请编号',
            dataIndex: 'applicationCode',
        },
        {
            title: '申请日期',
            dataIndex: 'applicationCreateTime',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '申请人姓名',
            dataIndex: 'applicationUserName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '申请人所属部门',
            dataIndex: 'applicationApplyDeptNameParent',
            render: (text) => {
                const args = text && text.replace(/,/g, '、');
                return <span style={{ cursor: 'pointer' }}>{renderTxt(args)}</span>;
            },
        },
        {
            title: '费用承担主体',
            dataIndex: 'applicationFeeTakerMainName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '收款对象',
            dataIndex: 'applicationChequesName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '申请总金额',
            dataIndex: 'applicationApplyTotalFee',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
        },
        {
            title: '申请事由',
            dataIndex: 'applicationReason',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text, 5)}</span>;
            },
        },
        {
            title: '审批状态',
            dataIndex: 'applicationApproveStatus',
            render: (text) => {
                return getOptionName(FEE_APPLY_TYPE_LIST, text);
            },
        },
        {
            title: '处理状态',
            dataIndex: 'handleStatus',
            render: (text) => {
                return getOptionName(DEAL_STATUS, text);
            },
        },
        {
            title: '处理时间',
            dataIndex: 'handleDate',
            render: (text, record) => {
                if (record.handleStatus === 2) {
                    return text;
                }
                return null;
            },
        },
        {
            title: '冲销状态',
            dataIndex: 'applicationChargeAgainstSatus',
            render: (text) => {
                return getOptionName(WRITE_OFF_STATUS, text);
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
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
                                checkDetail({ instanceId: record.applicationInstanceId });
                                // return props.gotoDetail(record.applicationInstanceId);
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
    e.applicationProjectVoList.map((item, i) => {
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
            key: 'applicationProjectName',
            title: '项目',
            dataIndex: 'applicationProjectName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            key: 'applicationActorBlogerName',
            title: '艺人/博主',
            dataIndex: 'applicationActorBlogerName',
        },
        {
            key: 'applicationFeeTypeName',
            title: '费用类型',
            dataIndex: 'applicationFeeTypeName',
        },
        {
            key: 'applicationFeeApply',
            title: '申请金额',
            dataIndex: 'applicationFeeApply',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
        },
        {},
    ];

    return (
        <BITable
            rowKey="applicationReid"
            columns={columns}
            dataSource={e.applicationProjectVoList}
            pagination={false}
        />
    );
}
