import React from 'react';
import AuthButton from '@/components/AuthButton';
import styles from './index.less';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { STARTPAYSTATUS, APPROVALSTATUS, FEE_APPLY_TYPE_LIST } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';

function columnsFn(props) {
    const columns = [
        {
            title: '申请日期',
            dataIndex: 'createTime',
            width: 110,
            fixed: 'left',
            render: (text) => {
                return String(text).slice(0, 10);
            },
        },
        {
            title: '申请人姓名',
            dataIndex: 'applyUserName',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
            fixed: 'left',
            align: 'left',
            width: 100,
        },
        {
            title: '申请人所在部门',
            dataIndex: 'applyUserDeptName',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
            width: 130,
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
            width: 110,
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
            width: 150,
        },
        {
            title: '合同编号',
            dataIndex: 'contractCode',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
            width: 120,
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
            width: 150,
        },
        {
            title: '艺人/博主',
            dataIndex: 'talentName',
            width: 130,
        },
        {
            title: '应结算金额',
            dataIndex: 'oughtSettleAmountTruly',
            width: 100,
            render: (text) => {
                return (
                    <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {renderTxt(`${thousandSeparatorFixed(text)}元`)}
                    </span>
                );
            },
        },
        {
            title: '佣金',
            dataIndex: 'brokerage',
            width: 100,
            render: (text) => {
                return (
                    <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {renderTxt(`${thousandSeparatorFixed(text)}元`)}
                    </span>
                );
            },
        },
        {
            title: '分成到手金额',
            dataIndex: 'dividedIntoHandAmount',
            width: 110,
            render: (text) => {
                return (
                    <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {renderTxt(`${thousandSeparatorFixed(text)}元`)}
                    </span>
                );
            },
        },
        {
            title: '发起付款状态',
            dataIndex: 'startPayStatus',
            width: 110,
            render: (text) => {
                return getOptionName(STARTPAYSTATUS, text);
            },
        },
        {
            title: '发起人',
            dataIndex: 'startUserName',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
            width: 100,
        },
        {
            title: '发起时间',
            dataIndex: 'startTime',
            width: 110,
            render: (text) => {
                return text ? String(text).slice(0, 10) : null;
            },
        },
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            width: 100,
            render: (text) => {
                return getOptionName(FEE_APPLY_TYPE_LIST, text);
            },
        },
        {
            title: '付款状态',
            dataIndex: 'payStatus',
            width: 100,
            render: (text) => {
                return getOptionName(APPROVALSTATUS, text);
            },
        },
        {
            title: '操作',
            fixed: 'right',
            dataIndex: 'operate',
            width: 60,
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/settleManage/statement/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.gotoDetail(record.id);
                                }}
                            >
                                {' '}
                                查看
                            </span>
                        </AuthButton>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}

const value = '';

export { value, columnsFn };
