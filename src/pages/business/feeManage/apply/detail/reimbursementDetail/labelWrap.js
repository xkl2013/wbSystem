import React from 'react';
import moment from 'moment';
import { getOptionName, getOptionPath, getLeafOptions, thousandSeparatorFixed } from '@/utils/utils';
import {
    IS_OR_NOT,
    CURRENCY_TYPE,
    FEE_TYPE,
    CONTRACT_OBLIGATION_TYPE,
    CHEQUES_TYPE,
    SETTLEMENT_TYPE,
} from '@/utils/enum';
import { DATE_FORMAT } from '@/utils/constants';
import { renderTxt } from '@/utils/hoverPopover';
import Information from '@/components/informationModel';

export const LabelWrap1 = (props) => {
    const columns = [
        {
            key: 'applicationCode',
            label: '费用申请编号',
        },
        {
            key: 'applicationCreateTime',
            label: '申请日期',
            render: (d) => {
                return d.applicationCreateTime && moment(d.applicationCreateTime).format(DATE_FORMAT);
            },
        },
        {
            key: 'applicationUserName',
            label: '申请人姓名',
        },
        {
            key: 'applicationApplyDeptNameParent',
            label: '申请人所在部门',
        },
        {
            key: 'applicationFeeTakerMainName',
            label: '费用承担主体',
        },
        {
            key: 'applicationRecharge',
            label: '是否预充值',
            render: (detail) => {
                return getOptionName(IS_OR_NOT, detail.applicationRecharge);
            },
        },
        {
            key: 'applicationCurrency',
            label: '币种',
            render: (d) => {
                return getOptionName(CURRENCY_TYPE, d && d.applicationCurrency);
            },
        },
        {
            key: 'applicationApplyTotalFee',
            label: '申请总金额',
            render: (detail) => {
                return `${thousandSeparatorFixed(detail.applicationApplyTotalFee)}元`;
            },
        },
        {
            key: 'applicationTrulyPayFee',
            label: '实际付款总金额',
            render: (detail) => {
                return `${thousandSeparatorFixed(detail.applicationTrulyPayFee)}元`;
            },
            isHide: props.applicationPayStatus === 0,
        },
        {
            key: 'applicationReason',
            label: '申请事由',
        },
    ];
    let temp = [];
    const newArr = [];
    columns.map((item) => {
        if (item.isHide) {
            return;
        }
        if (temp.length === 4) {
            newArr.push(temp);
            temp = [];
        }
        temp.push(item);
    });
    if (temp.length > 0) {
        newArr.push(temp);
    }
    return newArr;
};

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
        dataIndex: 'applicationProjectName',
        align: 'center',
        key: 'applicationProjectName',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.applicationProjectId,
                    name: record.applicationProjectName,
                    path: '/foreEnd/business/project/manage/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '合同',
        dataIndex: 'applicationContractName',
        align: 'center',
        key: 'applicationContractName',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.applicationContractId,
                    name: record.applicationContractName,
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
        dataIndex: 'applicationActorBlogerName',
        align: 'center',
        key: 'applicationActorBlogerName',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.applicationActorBlogerId,
                    name: record.applicationActorBlogerName,
                    path:
                        record.applicationActorBlogerType === 0
                            ? '/foreEnd/business/talentManage/talent/actor/detail'
                            : '/foreEnd/business/talentManage/talent/blogger/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '费用类型',
        dataIndex: 'applicationFeeTypeName',
        align: 'center',
        key: 'applicationFeeTypeName',
    },
    {
        title: '履约义务',
        dataIndex: 'applicationDuty',
        align: 'center',
        key: 'applicationDuty',
        render: (d) => {
            return getOptionPath(getLeafOptions(CONTRACT_OBLIGATION_TYPE), d);
        },
    },
    {
        title: '约定费用承担方',
        dataIndex: 'applicationFeeAggreeTakerId',
        align: 'center',
        key: 'applicationFeeAggreeTakerId',
        render: (d) => {
            return getOptionName(FEE_TYPE, d);
        },
    },
    {
        title: '实际费用承担方',
        dataIndex: 'applicationFeeTrulyTakerId',
        align: 'center',
        key: 'applicationFeeTrulyTakerId',
        render: (d) => {
            return getOptionName(FEE_TYPE, d);
        },
    },
    {
        title: '费用承担部门',
        dataIndex: 'applicationFeeTakerDeptNameParent',
        align: 'center',
        key: 'applicationFeeTakerDeptName',
    },
    {
        title: '申请金额',
        dataIndex: 'applicationFeeApply',
        align: 'center',
        key: 'applicationFeeApply',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
    {
        title: '备注',
        dataIndex: 'applicationFeeRemark',
        align: 'center',
        key: 'applicationFeeRemark',
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
        dataIndex: 'applicationProjectName',
        align: 'center',
        key: 'applicationProjectName',
        render: (d, record) => {
            return record.applicationProjectName;
        },
    },
    {
        title: '艺人/博主',
        dataIndex: 'applicationActorBlogerName',
        align: 'center',
        key: 'applicationActorBlogerName',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.applicationActorBlogerId,
                    name: record.applicationActorBlogerName,
                    path:
                        record.applicationActorBlogerType === 0
                            ? '/foreEnd/business/talentManage/talent/actor/detail'
                            : '/foreEnd/business/talentManage/talent/blogger/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '费用类型',
        dataIndex: 'applicationFeeTypeName',
        align: 'center',
        key: 'applicationFeeTypeName',
    },
    {
        title: '费用承担部门',
        dataIndex: 'applicationFeeTakerDeptNameParent',
        align: 'center',
        key: 'applicationFeeTakerDeptName',
    },
    // {
    //     title: '费用承担主体',
    //     dataIndex: 'applicationFeeTakerMainName',
    //     align: 'center',
    //     key: 'applicationFeeTakerMainName',
    // },
    {
        title: '申请金额',
        dataIndex: 'applicationFeeApply',
        align: 'center',
        key: 'applicationFeeApply',
    },
    {
        title: '备注',
        dataIndex: 'applicationFeeRemark',
        align: 'center',
        key: 'applicationFeeRemark',
        render: (text) => {
            return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
        },
    },
];

export const columns3 = [
    {
        title: '收款对象类型',
        dataIndex: 'applicationChequesType',
        align: 'center',
        key: 'applicationChequesType',
        render: (d) => {
            return getOptionName(CHEQUES_TYPE, d);
        },
    },
    {
        title: '收费对象名称',
        dataIndex: 'applicationChequesName',
        align: 'center',
        key: 'applicationChequesName',
    },
    {
        title: '结算方式',
        dataIndex: 'applicationChequesSettlementWay',
        align: 'center',
        key: 'applicationChequesSettlementWay',
        render: (d) => {
            return getOptionName(SETTLEMENT_TYPE, d);
        },
    },
    {
        title: '银行账户',
        dataIndex: 'applicationChequesBankAccountNo',
        align: 'center',
        key: 'applicationChequesBankAccountNo',
    },
    {
        title: '账户名称',
        dataIndex: 'applicationChequesBankAccountName',
        align: 'center',
        key: 'applicationChequesBankAccountName',
    },
    {
        title: '开户银行',
        dataIndex: 'applicationChequesBankAddress',
        align: 'center',
        key: 'applicationChequesBankAddress',
    },
    {
        title: '开户地',
        dataIndex: 'applicationChequesBankCity',
        align: 'center',
        key: 'applicationChequesBankCity',
    },
];

export const columns4 = [
    {
        title: '公司主体',
        dataIndex: 'applicationPayCompanyName',
        align: 'center',
        key: 'applicationPayCompanyName',
    },
    {
        title: '开户行',
        dataIndex: 'applicationPayBankAddress',
        align: 'center',
        key: 'applicationPayBankAddress',
    },
    {
        title: '银行账号',
        dataIndex: 'applicationPayBankAcountNo',
        align: 'center',
        key: 'applicationPayBankAcountNo',
    },
];
