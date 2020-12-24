import React from 'react';
import AuthButton from '@/components/AuthButton';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import {
    PROJECT_INFO_TYPE,
    EARNING_PROCEEDING,
    CONTRACT_SIGN_TYPE,
    EARNING_NC,
    REIMBURSE_INVOICE_TYPE,
} from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';

// 获取table列表头
function columnsFn() {
    const columns = [
        {
            title: '项目明细分类',
            dataIndex: 'projectInputProjectDetailClassify',
            render: (text) => {
                return getOptionName(PROJECT_INFO_TYPE, text);
            },
            fixed: 'left',
            width: 120,
        },
        {
            title: '事项',
            dataIndex: 'projectInputThings',
            render: (text) => {
                return getOptionName(EARNING_PROCEEDING, text);
            },
            fixed: 'left',
            width: 110,
        },
        {
            title: '合同名称',
            dataIndex: 'projectInputContractName',
            fixed: 'left',
            width: 120,
        },
        {
            title: '项目名称',
            dataIndex: 'projectInputProjectName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
            fixed: 'left',
            width: 100,
        },
        {
            title: '艺人/博主',
            dataIndex: 'projectInputTalentName',
            fixed: 'left',
            align: 'left',
            width: 100,
        },
        {
            title: '合同编号',
            dataIndex: 'projectInputContractCode',
            width: 120,
        },
        {
            title: '艺人分成比例',
            dataIndex: 'projectInputStarDivideProportion',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 110,
        },
        {
            title: '签约方式',
            dataIndex: 'projectInputContractWay',
            render: (text) => {
                return getOptionName(CONTRACT_SIGN_TYPE, text);
            },
            width: 100,
        },
        {
            title: '合同金额',
            dataIndex: 'projectInputContractTotalAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '拆帐金额',
            dataIndex: 'projectInputTearAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '拆帐比例',
            dataIndex: 'projectInputTearProportaion',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 100,
        },
        {
            title: '公司金额',
            dataIndex: 'projectInputCompanyTotalAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '合同执行总体进度（加权平均）',
            dataIndex: 'projectInputContractTotalProgress',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 150,
        },
        {
            title: '进度差',
            dataIndex: 'projectInputProgressGap',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 100,
        },
        {
            title: '进度更新时间',
            dataIndex: 'projectInputProgressUpdateTime',
            width: 110,
        },
        {
            title: '回款金额',
            dataIndex: 'projectInputCashAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '实际回款时间',
            dataIndex: 'projectInputTrulyCashTime',
            width: 110,
            render: (text) => {
                if (text !== null) {
                    return String(text).slice(0, 10);
                }
                return null;
            },
        },
        {
            title: '发票类型',
            dataIndex: 'projectInputInvoiceType',
            render: (text) => {
                return getOptionName(REIMBURSE_INVOICE_TYPE, text);
            },
            width: 100,
        },
        {
            title: '开票金额',
            dataIndex: 'projectInputInvoiceAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '税率',
            dataIndex: 'projectInputTaxRate',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 100,
        },
        {
            title: '未税金额',
            dataIndex: 'projectInputNoTax',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '税额',
            dataIndex: 'projectInputTaxAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '发票开具时间',
            dataIndex: 'projectInputInvoiceTime',
            render: (text) => {
                return text === null ? '' : String(text).slice(0, 10);
            },
            width: 110,
        },
        {
            title: '开票更新时间',
            dataIndex: 'projectInputInvoiceUpdateTime',
            width: 110,
        },
        {
            title: '上线时间',
            dataIndex: 'projectingOnlineDate',
            render: (text) => {
                return text === null ? '' : String(text).slice(0, 10);
            },
            width: 110,
        },
        {
            title: '入帐金额',
            dataIndex: 'projectInputEntryAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '公司主体',
            dataIndex: 'projectInputCompanyName',
            width: 100,
        },
        {
            title: '客户主体',
            dataIndex: 'projectInputCustomerName',
            width: 100,
        },
        {
            title: '项目负责人',
            dataIndex: 'projectInputProjectManagerName',
            width: 100,
        },
        {
            title: '项目负责人所属部门',
            dataIndex: 'projectInputProjectManagerDeptName',
            width: 120,
        },
        {
            title: '收款帐号',
            dataIndex: 'projectInputReceiveNo',
            width: 100,
        },
        {
            title: '操作人',
            dataIndex: 'projectInputOperatorName',
            width: 100,
        },
        {
            title: '传送NC时间',
            dataIndex: 'projectInputTransferNcTime',
            width: 100,
        },
        {
            title: '传送NC状态',
            dataIndex: 'projectInputTransferNcStatus',
            render: (text) => {
                return getOptionName(EARNING_NC, text);
            },
            width: 100,
        },
        {
            title: '备注',
            dataIndex: 'projectInputRemark',
            width: 100,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '操作',
            fixed: 'right',
            dataIndex: 'projectInputId',
            width: 70,
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
        },
    ];
    return columns || [];
}

const value = '';

export { columnsFn, value };
