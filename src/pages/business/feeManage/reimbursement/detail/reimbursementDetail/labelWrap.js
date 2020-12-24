import React from 'react';
import moment from 'moment';
import { getOptionName, getOptionPath, getLeafOptions, thousandSeparatorFixed } from '@/utils/utils';
import {
    IS_OR_NOT,
    CURRENCY_TYPE,
    REIMBURSE_INVOICE_TYPE,
    REIMBURSE_TAX_RATE,
    CHEQUES_TYPE,
    SETTLEMENT_TYPE,
    FEE_TYPE,
    CONTRACT_OBLIGATION_TYPE,
} from '@/utils/enum';
import { DATE_FORMAT } from '@/utils/constants';
import { renderTxt } from '@/utils/hoverPopover';
import Information from '@/components/informationModel';

export const LabelWrap1 = [
    [
        {
            key: 'reimburseCode',
            label: '费用报销编号',
        },
        {
            key: 'reimburseApplyTime',
            label: '申请日期',
            render: (d) => {
                return d.reimburseApplyTime && moment(d.reimburseApplyTime).format(DATE_FORMAT);
            },
        },
        {
            key: 'reimburseReportUserName',
            label: '填报人姓名',
        },
        {
            key: 'reimburseReportUserDeptNameParent',
            label: '填报人所在部门',
        },
    ],
    [
        {
            key: 'reimburseReimbureUserName',
            label: '实际报销人',
        },
        {
            key: 'reimburseReimbureUserDeptNameParent',
            label: '实际报销人所属部门',
        },
        {
            key: 'reimburseFeeTakerMainName',
            label: '费用承担主体',
        },
        {
            key: 'reimburseCurrency',
            label: '币种',
            render: (d) => {
                return getOptionName(CURRENCY_TYPE, d && d.reimburseCurrency);
            },
        },
    ],
    [
        {
            key: 'reimburseRecharge',
            label: '是否预充值',
            render: (detail) => {
                return getOptionName(IS_OR_NOT, detail.reimburseRecharge);
            },
        },
        {
            key: 'reimburseTotalFee',
            label: '报销总金额',
            render: (detail) => {
                return `${thousandSeparatorFixed(detail.reimburseTotalFee)}元`;
            },
        },
        {
            key: 'reimburseTotalPayFee',
            label: '申请付款总金额',
            render: (detail) => {
                return `${thousandSeparatorFixed(detail.reimburseTotalPayFee)}元`;
            },
        },
        {
            key: 'reimburseReason',
            label: '报销事由',
        },
    ],
];

export const columns1 = [
    // 项目费用
    {
        title: '序列',
        dataIndex: 'makeupCost',
        align: 'center',
        key: 'makeupCost',
        render: (detail, item, index) => {
            if (item.isTotal) {
                return '合计';
            }
            return index + 1;
        },
    },
    {
        title: '项目',
        dataIndex: 'reimburseProjectName',
        align: 'center',
        key: 'reimburseProjectName',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.reimburseProjectId,
                    name: record.reimburseProjectName,
                    path: '/foreEnd/business/project/manage/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '合同',
        dataIndex: 'reimburseContractName',
        align: 'center',
        key: 'reimburseContractName',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.reimburseContractId,
                    name: record.reimburseContractName,
                    path: '/foreEnd/business/project/contract/detail',
                },
            ];
            if (d === '无合同') {
                return d;
            }
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '艺人/博主',
        dataIndex: 'reimburseActorBlogerName',
        align: 'center',
        key: 'reimburseActorBlogerName',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.reimburseActorBlogerId,
                    name: record.reimburseActorBlogerName,
                    path:
                        record.reimburseActorBlogerType === 0
                            ? '/foreEnd/business/talentManage/talent/actor/detail'
                            : '/foreEnd/business/talentManage/talent/blogger/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '费用类型',
        dataIndex: 'reimburseFeeTypeName',
        align: 'center',
        key: 'reimburseFeeTypeName',
    },
    {
        title: '实际发生日期',
        dataIndex: 'reimburseFeeActualTime',
        align: 'center',
        key: 'reimburseFeeActualTime',
        render: (text) => {
            return text ? text.slice(0, 10) : null;
        },
    },
    {
        title: '履约义务',
        dataIndex: 'reimburseDuty',
        align: 'center',
        key: 'reimburseDuty',
        render: (d) => {
            return getOptionPath(getLeafOptions(CONTRACT_OBLIGATION_TYPE), d);
        },
    },
    {
        title: '约定费用承担方',
        dataIndex: 'reimburseFeeAggreeTakerId',
        align: 'center',
        key: 'reimburseFeeAggreeTakerId',
        render: (d) => {
            return getOptionName(FEE_TYPE, d);
        },
    },
    {
        title: '费用实际承担方',
        dataIndex: 'reimburseFeeTrulyTakerId',
        align: 'center',
        key: 'reimburseFeeTrulyTakerId',
        render: (d) => {
            return getOptionName(FEE_TYPE, d);
        },
    },
    {
        title: '费用承担部门',
        dataIndex: 'reimburseFeeTakerDeptNameParent',
        align: 'center',
        key: 'reimburseFeeTakerDeptName',
    },
    {
        title: '申请报销金额',
        dataIndex: 'reimburseFeeApply',
        align: 'center',
        key: 'reimburseFeeApply',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '申请付款金额',
        dataIndex: 'reimbursePayApply',
        align: 'center',
        key: 'reimbursePayApply',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '发票类型',
        dataIndex: 'reimburseInvoiceType',
        align: 'center',
        key: 'reimburseInvoiceType',
        render: (detail) => {
            return getOptionName(REIMBURSE_INVOICE_TYPE, detail);
        },
    },
    {
        title: '含税金额',
        dataIndex: 'reimburseIncludeTaxFee',
        align: 'center',
        key: 'reimburseIncludeTaxFee',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '税率',
        dataIndex: 'reimburseTaxRate',
        align: 'center',
        key: 'reimburseTaxRate',
        render: (d) => {
            return getOptionName(REIMBURSE_TAX_RATE, d);
        },
    },
    {
        title: '未税金额',
        dataIndex: 'reimburseNoTaxFee',
        align: 'center',
        key: 'reimburseNoTaxFee',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '税额',
        dataIndex: 'reimburseTax',
        align: 'center',
        key: 'reimburseTax',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '关联',
        dataIndex: 'outOfficeName',
        render: (text, record) => {
            return (
                <a href={`/foreEnd/approval/apply/myjob/detail?id=${record.outOfficeId}`} target="_balnk">
                    {renderTxt(text)}
                </a>
            );
        },
    },
    {
        title: '备注',
        dataIndex: 'reimburseFeeRemark',
        align: 'center',
        key: 'reimburseFeeRemark',
        render: (text) => {
            return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
        },
    },
];

export const columns2 = [
    // 日常费用
    {
        title: '序列',
        dataIndex: 'makeupCost',
        align: 'center',
        key: 'makeupCost',
        render: (detail, item, index) => {
            if (item.isTotal) {
                return '合计';
            }
            return index + 1;
        },
    },
    {
        title: '项目',
        dataIndex: 'reimburseProjectName',
        align: 'center',
        key: 'reimburseProjectName',
        render: (d, record) => {
            return record.reimburseProjectName;
        },
    },
    {
        title: '艺人/博主',
        dataIndex: 'reimburseActorBlogerName',
        align: 'center',
        key: 'reimburseActorBlogerName',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.reimburseActorBlogerId,
                    name: record.reimburseActorBlogerName,
                    path:
                        record.reimburseActorBlogerType === 0
                            ? '/foreEnd/business/talentManage/talent/actor/detail'
                            : '/foreEnd/business/talentManage/talent/blogger/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '费用类型',
        dataIndex: 'reimburseFeeTypeName',
        align: 'center',
        key: 'reimburseFeeTypeName',
    },
    {
        title: '实际发生日期',
        dataIndex: 'reimburseFeeActualTime',
        align: 'center',
        key: 'reimburseFeeActualTime',
        render: (text) => {
            return text ? text.slice(0, 10) : null;
        },
    },
    {
        title: '申请报销金额',
        dataIndex: 'reimburseFeeApply',
        align: 'center',
        key: 'reimburseFeeApply',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '申请付款金额',
        dataIndex: 'reimbursePayApply',
        align: 'center',
        key: 'reimbursePayApply',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '费用承担部门',
        dataIndex: 'reimburseFeeTakerDeptNameParent',
        align: 'center',
        key: 'reimburseFeeTakerDeptName',
    },
    {
        title: '发票类型',
        dataIndex: 'reimburseInvoiceType',
        align: 'center',
        key: 'reimburseInvoiceType',
        render: (detail) => {
            return getOptionName(REIMBURSE_INVOICE_TYPE, detail);
        },
    },
    {
        title: '含税金额',
        dataIndex: 'reimburseIncludeTaxFee',
        align: 'center',
        key: 'reimburseIncludeTaxFee',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '税率',
        dataIndex: 'reimburseTaxRate',
        align: 'center',
        key: 'reimburseTaxRate',
        render: (d) => {
            return getOptionName(REIMBURSE_TAX_RATE, d);
        },
    },
    {
        title: '未税金额',
        dataIndex: 'reimburseNoTaxFee',
        align: 'center',
        key: 'reimburseNoTaxFee',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '税额',
        dataIndex: 'reimburseTax',
        align: 'center',
        key: 'reimburseTax',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '关联',
        dataIndex: 'outOfficeName',
        render: (text, record) => {
            return (
                <a href={`/foreEnd/approval/apply/myjob/detail?id=${record.outOfficeId}`} target="_balnk">
                    {renderTxt(text)}
                </a>
            );
        },
    },
    {
        title: '备注',
        dataIndex: 'reimburseFeeRemark',
        align: 'center',
        key: 'reimburseFeeRemark',
        render: (text) => {
            return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
        },
    },
];

export const columns3 = [
    {
        title: '收款对象类型',
        dataIndex: 'reimburseChequesType',
        align: 'center',
        key: 'reimburseChequesType',
        render: (d) => {
            return getOptionName(CHEQUES_TYPE, d);
        },
    },
    {
        title: '收费对象名称',
        dataIndex: 'reimburseChequesName',
        align: 'center',
        key: 'reimburseChequesName',
    },
    {
        title: '结算方式',
        dataIndex: 'reimburseChequesSettlementWay',
        align: 'center',
        key: 'reimburseChequesSettlementWay',
        render: (d) => {
            return getOptionName(SETTLEMENT_TYPE, d);
        },
    },
    {
        title: '银行账户',
        dataIndex: 'reimburseChequesBankAccountNo',
        align: 'center',
        key: 'reimburseChequesBankAccountNo',
    },
    {
        title: '账户名称',
        dataIndex: 'reimburseChequesBankAccountName',
        align: 'center',
        key: 'reimburseChequesBankAccountName',
    },
    {
        title: '开户银行',
        dataIndex: 'reimburseChequesBankAddress',
        align: 'center',
        key: 'reimburseChequesBankAddress',
    },
    {
        title: '开户地',
        dataIndex: 'reimburseChequesBankCity',
        align: 'center',
        key: 'reimburseChequesBankCity',
    },
];

export const columns4 = [
    {
        title: '公司主体',
        dataIndex: 'reimbursePayCompanyName',
        align: 'center',
        key: 'reimbursePayCompanyName',
    },
    {
        title: '开户行',
        dataIndex: 'reimbursePayBankAddress',
        align: 'center',
        key: 'reimbursePayBankAddress',
    },
    {
        title: '银行账号',
        dataIndex: 'reimbursePayBankAcountNo',
        align: 'center',
        key: 'reimbursePayBankAcountNo',
    },
];
