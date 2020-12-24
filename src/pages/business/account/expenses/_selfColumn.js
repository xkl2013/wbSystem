import React from 'react';
import AuthButton from '@/components/AuthButton';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import {
    EARNING_NC,
    EXPENSES_BUSINESS_STATE,
    REIMBURSE_INVOICE_TYPE,
    IS_OR_NOT,
    EXPENSES_PROCEEDING,
    CHEQUES_TYPE,
    REIMBURSE_SOURCE,
} from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
// import { Popover } from 'antd';

// 获取table列表头
function columnsFn() {
    const columns = [
        {
            title: '业务类型',
            dataIndex: 'feeBusinessType',
            render: (text) => {
                return getOptionName(EXPENSES_BUSINESS_STATE, text);
            },
            fixed: 'left',
            width: 110,
        },
        {
            title: '费用类型',
            dataIndex: 'feeTypeName',
            fixed: 'left',
            width: 100,
        },
        {
            title: '事项',
            align: 'left',
            dataIndex: 'feeThings',
            render: (text) => {
                return getOptionName(EXPENSES_PROCEEDING, text);
            },
            fixed: 'left',
            width: 80,
        },
        {
            title: '来源',
            dataIndex: 'feeSource',
            width: 90,
            render: (text) => {
                return getOptionName(REIMBURSE_SOURCE, text);
            },
        },
        {
            title: '报销/申请单号',
            dataIndex: 'feeExpenseNo',
            width: 110,
        },
        {
            title: '报销/申请人',
            dataIndex: 'feeExpenseUserName',
            width: 100,
        },
        {
            title: '是否预充值',
            dataIndex: 'feePreCharged',
            render: (text) => {
                return getOptionName(IS_OR_NOT, text);
            },
            width: 100,
        },
        {
            title: '申请日期',
            dataIndex: 'feeApplyTime',
            render: (text) => {
                return text === null ? '' : String(text).slice(0, 10);
            },
            width: 100,
        },
        {
            title: '审批完成时间',
            dataIndex: 'feeApprovalFinishTime',
            render: (text) => {
                return text === null ? '' : String(text).slice(0, 10);
            },
            width: 110,
        },
        {
            title: '付款确认时间',
            dataIndex: 'feePaymentConfirmTime',
            render: (text) => {
                return text === null ? '' : String(text).slice(0, 10);
            },
            width: 110,
        },
        // {
        //     title: '发票确认时间',
        //     dataIndex: 'feeConfirmInvoiceTime',
        //     width: 110,
        // },
        {
            title: '发票类型',
            dataIndex: 'feeInvoiceType',
            render: (text) => {
                return getOptionName(REIMBURSE_INVOICE_TYPE, text);
            },
            width: 100,
        },
        {
            title: '含税金额',
            dataIndex: 'feeHadTaxAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '税率',
            dataIndex: 'feeTaxRate',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 80,
        },
        {
            title: '未税金额',
            dataIndex: 'feeNoTaxAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '税额',
            dataIndex: 'feeTaxAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 80,
        },
        {
            title: '入帐金额',
            dataIndex: 'feeEntryAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '费用承担部门',
            dataIndex: 'feeBearDeptName',
            width: 120,
        },
        {
            title: '项目名称',
            dataIndex: 'feeProjectName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
            width: 100,
        },
        {
            title: '艺人/博主',
            dataIndex: 'feeTalentName',
            width: 100,
        },
        {
            title: '公司主体',
            dataIndex: 'feeCompanyName',
            width: 100,
        },
        {
            title: '收款对象类型',
            dataIndex: 'feeReceiveFromType',
            render: (text) => {
                return getOptionName(CHEQUES_TYPE, text);
            },
            width: 130,
        },
        {
            title: '收款对象名称',
            dataIndex: 'feeReceiveFromName',
            width: 100,
        },
        {
            title: '收款对象银行帐号',
            dataIndex: 'feeReceiveBankNo',
            width: 110,
        },
        {
            title: '付款帐号',
            dataIndex: 'feePaymentBankNo',
            width: 110,
        },
        // {
        //     title: '付款确认时间',
        //     dataIndex: 'feePaymentConfirmTime',
        //     width: 110,
        // },
        {
            title: '事由',
            dataIndex: 'feeReason',
            width: 90,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '操作人',
            dataIndex: 'feeOperatorName',
            width: 110,
        },
        {
            title: '传送NC时间',
            dataIndex: 'feeNcTime',
            width: 110,
        },
        {
            title: '传送NC状态',
            dataIndex: 'feeNcStatus',
            render: (text) => {
                return getOptionName(EARNING_NC, text);
            },
            width: 110,
        },
        {
            title: '备注',
            dataIndex: 'feeMark',
            width: 100,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '操作',
            fixed: 'right',
            dataIndex: 'feeId',
            render: () => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/feeManage/reimbursement/detail">
                            <span
                                style={{ color: '#ccc', cursor: 'no-drop' }}
                                // style={{ color: '#88B5FF', cursor: 'pointer' }}
                                title="暂不提供此功能"
                                // onClick={() => props.checkData(record.applicationId)}
                            >
                                {' '}
                                编辑
                            </span>
                        </AuthButton>
                    </div>
                );
            },
            width: 80,
        },
    ];
    return columns || [];
}

const value = '';

export { columnsFn, value };
