import React from 'react';
import AuthButton from '@/components/AuthButton';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { PROJECT_INFO_TYPE, COSTING_PROCEEDING, CONTRACT_SIGN_TYPE, EARNING_NC } from '@/utils/enum';
import styles from './index.less';
import { renderTxt } from '@/utils/hoverPopover';

// 获取table列表头
function columnsFn(props) {
    const columns = [
        {
            title: '项目明细分类',
            dataIndex: 'projectCostProjectDetailClassify',
            render: (text) => {
                return getOptionName(PROJECT_INFO_TYPE, text);
            },
            fixed: 'left',
            width: 110,
        },
        {
            title: '费用类型',
            dataIndex: 'projectCostFeeTypeName',
            fixed: 'left',
            width: 100,
        },
        {
            title: '事项',
            dataIndex: 'projectCostThings',
            render: (text) => {
                return getOptionName(COSTING_PROCEEDING, text);
            },
            fixed: 'left',
            width: 110,
        },
        {
            title: '合同名称',
            dataIndex: 'projectCostContractName',
            fixed: 'left',
            width: 140,
        },
        {
            title: '项目名称',
            dataIndex: 'projectCostProjectName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
            align: 'left',
            fixed: 'left',
            width: 150,
        },
        {
            title: '合同编号',
            dataIndex: 'projectCostContractCode',
            width: 130,
        },
        {
            title: '艺人',
            dataIndex: 'projectCostTalentName',
            width: 80,
        },
        {
            title: '艺人分成比例',
            dataIndex: 'projectCostTalentDivideProportion',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 110,
        },
        {
            title: '签约方式',
            dataIndex: 'projectCostContractWay',
            render: (text) => {
                return getOptionName(CONTRACT_SIGN_TYPE, text);
            },
            width: 100,
        },
        {
            title: '入帐金额',
            dataIndex: 'projectCostEntryAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '合同金额',
            dataIndex: 'projectCostContractAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '拆帐金额',
            dataIndex: 'projectCostTearAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '拆帐比例',
            dataIndex: 'projectCostTearProportaion',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 100,
        },
        {
            title: '公司金额',
            dataIndex: 'projectCostCompanyAmount',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '合同执行总体进度（加权平均）',
            dataIndex: 'projectCostContractTotalProgress',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 150,
        },
        {
            title: '进度差',
            dataIndex: 'projectCostProgressGap',
            render: (text) => {
                return text && `${(Number(text) * 100).toFixed(2)}%`;
            },
            width: 100,
        },
        {
            title: '进度更新时间',
            dataIndex: 'projectCostProgressUpdateTime',
            width: 110,
        },
        {
            title: '公司主体',
            dataIndex: 'projectCostCompanyName',
            width: 130,
        },
        {
            title: '客户主体',
            dataIndex: 'projectCostCustomerName',
            width: 130,
        },
        {
            title: '项目负责人',
            dataIndex: 'projectCostProjectManagerName',
            width: 100,
        },
        {
            title: '项目负责人所属部门',
            dataIndex: 'projectCostProjectManagerDeptName',
            width: 140,
        },
        {
            title: '结算税率',
            dataIndex: 'projectCostSettlementTaxrate',
            width: 100,
            render: (text) => {
                if (text !== null) {
                    return `${text * 100}%`;
                }
                return null;
            },
        },
        {
            title: '税额',
            dataIndex: 'projectCostSettlementTax',
            width: 100,
            render: (text) => {
                return Number(text).toFixed(2);
            },
        },
        {
            title: '未税金额',
            dataIndex: 'projectCostSettlementNoTax',
            width: 100,
            render: (text) => {
                return Number(text).toFixed(2);
            },
        },
        {
            title: '结算供应商',
            dataIndex: 'projectCostSettlementSupplierName',
            width: 100,
        },
        {
            title: '操作人',
            dataIndex: 'projectCostOperatorName',
            width: 80,
        },
        {
            title: '传送NC时间',
            dataIndex: 'projectCostTransferNcTime',
            width: 100,
        },
        {
            title: '传送NC状态',
            dataIndex: 'projectCostTransferNcStatus',
            render: (text) => {
                return getOptionName(EARNING_NC, text);
            },
            width: 100,
        },
        {
            title: '备注',
            dataIndex: 'projectCostRemark',
            width: 100,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '操作',
            fixed: 'right',
            dataIndex: 'projectCostId',
            render: (text, record) => {
                return (
                    <div>
                        {record.projectCostTransferNcStatus === 0 || record.projectCostTransferNcStatus === 2 ? (
                            <AuthButton authority="/foreEnd/business/account/costing/edit">
                                <span
                                    className={styles.btnCls}
                                    title="编辑"
                                    onClick={() => {
                                        return props.editDetail(record.projectCostId);
                                    }}
                                >
                                    编辑
                                </span>
                            </AuthButton>
                        ) : null}
                    </div>
                );
            },
            width: 70,
        },
    ];
    return columns || [];
}

const value = '';

export { columnsFn, value };
