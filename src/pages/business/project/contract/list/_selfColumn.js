import React from 'react';
import { isEmpty } from 'lodash';
import { contractCategory } from '@/utils/enumNo2';
import {
    FEE_APPLY_TYPE_LIST,
    CONTRACT_ARCHIVE_STATUS,
    PROJECT_TYPE,
    CONTRACT_PROGRESS_STATUS,
    CONTRACT_MONEY_STATUS,
    CONTRACT_REIMBURSE_STATUS,
    CONTRACT_FEE_STATUS,
    CONTRACT_SETTLEMENT_STATUS,
    CONTRACT_END_STATUS,
} from '@/utils/enum';
import { getOptionName, isNumber, thousandSeparatorFixed } from '@/utils/utils';
import { renderTxt, renderPopTable } from '@/utils/hoverPopover';
import AuthButton, { checkPathname } from '@/components/AuthButton';
import styles from './index.less';

function getColor(id) {
    // 1:待审批 2:审批中 3:审批通过 4:审批未通过 5:审批撤销 6 审批流程启动失败
    switch (id) {
        case 1:
        case 2:
            return '#FFB63E';
        case 3:
            return '#04B4AD';
        case 4:
            return '#EC6D68';
        case 5:
            return '#8C97A3';
        default:
            return '#848F9B';
    }
}

// 获取table列表头
export function columnsFn(props) {
    const listPage = props.props.contractListPage || {};
    const list = listPage.list || [];
    const columns = [
        // {
        //     title: '序列',
        //     dataIndex: 'index',
        //     align: 'center',
        //     render: (...argu) => {
        //         return argu[2] + 1;
        //     },
        //     width: 50,
        // },
        {
            title: '项目名称',
            fixed: 'left',
            align: 'left',
            dataIndex: 'contractProjectName',
            render: (text) => {
                return text && renderTxt(text);
            },
            width: isEmpty(list) ? 0 : 180,
        },
        {
            title: '合同编号',
            fixed: 'left',
            align: 'left',
            dataIndex: 'contractCode',
            width: isEmpty(list) ? 0 : 190,
        },
        {
            title: '项目类型',
            dataIndex: 'contractProjectType',
            render: (text) => {
                return text && getOptionName(PROJECT_TYPE, text);
            },
            width: 100,
        },
        {
            title: '负责人',
            dataIndex: 'contractHeaderName',
            width: 130,
        },
        {
            title: '客户名称',
            dataIndex: 'customers',
            width: 180,
            render: (text) => {
                return text && renderTxt(text);
            },
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            width: 180,
            render: (text) => {
                return text && renderTxt(text);
            },
        },
        {
            title: '艺人/博主',
            dataIndex: 'talents',
            render: (text) => {
                return text && renderTxt(text);
            },
            width: 180,
        },
        {
            title: '合同总金额',
            dataIndex: 'contractMoneyTotal',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                return isNumber(text) && `${thousandSeparatorFixed(text)}元`;
            },
            // width: '5%',
        },
        {
            title: '执行进度',
            dataIndex: 'contractProgress',
            // width: '5%',
            render: (text, record) => {
                const content = (text && `${(text * 100).toFixed(2)}%`) || '0.00%';
                const contractAppointmentList = (record.contractAppointmentList || []).map((item, index) => {
                    return {
                        ...item,
                        index,
                    };
                });
                const column = [
                    {
                        title: '艺人/博主',
                        dataIndex: 'contractAppointmentTalentName',
                        render: (text) => {
                            return text && renderTxt(text);
                        },
                        width: 100,
                        className: styles.columnHeader,
                    },
                    {
                        title: '执行进度',
                        className: styles.columnHeader,
                        dataIndex: 'contractAppointmentProgress',
                        render: (word) => {
                            return (word && `${(word * 100).toFixed(2)}%`) || '0.00%';
                        },
                        width: 80,
                    },
                    {
                        title: '进度更新时间',
                        className: styles.columnHeader,
                        dataIndex: 'contractAppointmentCreatedAt',
                        render: (text) => {
                            return text && text.slice(0, 10);
                        },
                        width: 100,
                    },
                ];
                return renderPopTable(content, column, contractAppointmentList, styles.tableClass);
            },
        },
        {
            title: '开票进度',
            dataIndex: 'invoiceMoney',
            // width: '5%',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                const result = text ? text.split('/') : [0, 0];
                const left = Number(result[0]) === 0 ? 0 : thousandSeparatorFixed(result[0]);
                const right = Number(result[1]) === 0 ? 0 : thousandSeparatorFixed(result[1]);
                const content = `${left === 'null' ? 0 : left}/${right === 'null' ? 0 : right}`;
                const contractInvoiceList = (record.contractInvoiceList || []).map((item, index) => {
                    return {
                        ...item,
                        index,
                    };
                });
                const column = [
                    {
                        title: '开票金额',
                        dataIndex: 'contractInvoiceMoney',
                        render: (word) => {
                            return word && thousandSeparatorFixed(word);
                        },
                        className: styles.columnHeader,
                        width: 120,
                    },
                    {
                        title: '开票时间',
                        className: styles.columnHeader,
                        dataIndex: 'contractInvoiceDate',
                        render: (text) => {
                            return text && text.slice(0, 10);
                        },
                        width: 100,
                    },
                ];
                return renderPopTable(content, column, contractInvoiceList, styles.tableClass);
            },
        },
        {
            title: '回款进度',
            dataIndex: 'returnMoney',
            // width: '5%',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                const result = text ? text.split('/') : [0, 0];
                const left = Number(result[0]) === 0 ? 0 : thousandSeparatorFixed(result[0]);
                const right = Number(result[1]) === 0 ? 0 : thousandSeparatorFixed(result[1]);
                const content = `${left === 'null' ? 0 : left}/${right === 'null' ? 0 : right}`;
                const contractReturnList = (record.contractReturnList || []).map((item, index) => {
                    return { ...item, index };
                });
                const column = [
                    {
                        title: '回款金额',
                        className: styles.columnHeader,
                        dataIndex: 'contractReturnMoney',
                        render: (word) => {
                            return word && thousandSeparatorFixed(word);
                        },
                        width: 120,
                    },
                    {
                        title: '回款时间',
                        className: styles.columnHeader,
                        dataIndex: 'contractReturnDate',
                        render: (text) => {
                            return text && text.slice(0, 10);
                        },
                        width: 100,
                    },
                ];
                return renderPopTable(content, column, contractReturnList, styles.tableClass);
            },
        },
        {
            title: '费用确认进度',
            dataIndex: 'feeConfirmProgress',
            // width: '5%',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                const result = text ? text.split('/') : [0, 0];
                const left = result[0];
                const right = result[1];
                const content = `${left === 'null' ? 0 : left}/${right === 'null' ? 0 : right}`;
                const disabled = content === '0/0' || Number(result[1]) === 0; // textDecoration: 'underline'
                return (
                    <span
                        className={disabled ? `${styles.link} ${styles.disabled}` : styles.link}
                        onClick={() => {
                            return !disabled && props.goProgress(record.contractId);
                        }}
                    >
                        {content}
                    </span>
                );
            },
        },
        {
            title: '累计报销金额',
            dataIndex: 'accumulatedReimbursementMoney',
            // width: '5%',
            render: (text, record) => {
                const disabled = !(
                    checkPathname('/foreEnd/business/project/contract/detail/cost')
                    && record.contractApprovalStatus === 3
                );
                return (
                    <span
                        className={disabled ? `${styles.link} ${styles.disabled}` : styles.link}
                        onClick={() => {
                            return !disabled && props.checkFeeData(record.contractId);
                        }}
                    >
                        {(text && thousandSeparatorFixed(text)) || 0}
                    </span>
                );
            },
        },
        {
            title: '结算进度',
            dataIndex: 'settlementProgress',
            // width: '5%',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                const result = text ? text.split('/') : [0, 0];
                const left = Number(result[0]) === 0 ? 0 : thousandSeparatorFixed(result[0]);
                const right = Number(result[1]) === 0 ? 0 : thousandSeparatorFixed(result[1]);
                const content = `${left === 'null' ? 0 : left}/${right === 'null' ? 0 : right}`;
                const disabled = !(
                    checkPathname('/foreEnd/business/project/contract/detail/settle')
                    && record.contractApprovalStatus === 3
                );
                return (
                    <span
                        className={disabled ? `${styles.link} ${styles.disabled}` : styles.link}
                        onClick={() => {
                            return !disabled && props.checkAccountData(record.contractId);
                        }}
                    >
                        {content}
                    </span>
                );
            },
        },
        {
            title: '签约日期',
            dataIndex: 'contractSigningDate',
            render: (text) => {
                return text && text.slice(0, 10);
            },
            // // width: '5%',
        },
        {
            title: '主子合同',
            dataIndex: 'contractCategory',
            render: (text) => {
                return getOptionName(contractCategory, text);
            },
            // width: '5%',
        },
        {
            title: '审批状态',
            dataIndex: 'contractApprovalStatus',
            render: (text) => {
                return <span style={{ color: getColor(text) }}>{getOptionName(FEE_APPLY_TYPE_LIST, text)}</span>;
            },
            // width: '5%',
        },
        {
            title: '执行状态',
            dataIndex: 'contractProgressStatus',
            render: (text) => {
                return getOptionName(CONTRACT_PROGRESS_STATUS, text);
            },
            // width: '5%',
        },
        {
            title: '回款状态',
            dataIndex: 'contractMoneyStatus',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                return getOptionName(CONTRACT_MONEY_STATUS, text);
            },
            // width: '5%',
        },
        {
            title: '报销状态',
            dataIndex: 'reimburseStatus',
            render: (text) => {
                return getOptionName(CONTRACT_REIMBURSE_STATUS, text);
            },
            // width: '5%',
        },
        {
            title: '费用确认状态',
            dataIndex: 'expenseConfirmStatus',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                return getOptionName(CONTRACT_FEE_STATUS, text);
            },
            // width: '5%',
        },
        {
            title: '结算状态',
            dataIndex: 'contractSettlementStatus',
            render: (text) => {
                return getOptionName(CONTRACT_SETTLEMENT_STATUS, text);
            },
            // width: '5%',
        },
        {
            title: '结案状态',
            dataIndex: 'endStatus',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                return getOptionName(CONTRACT_END_STATUS, text);
            },
            // width: '5%',
        },
        {
            title: '归档状态',
            dataIndex: 'contractArchiveStatus',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                return (
                    <span style={{ color: text === 0 ? '#848F9B' : '#04B4AD' }}>
                        {getOptionName(CONTRACT_ARCHIVE_STATUS, text)}
                    </span>
                );
            },
            // width: '5%',
        },
        {
            title: '操作',
            fixed: 'right',
            dataIndex: 'operate',
            width: isEmpty(list) ? 0 : 200,
            ellipsis: true,
            render: (text, record) => {
                const { contractCategory, contractApprovalStatus, contractIsVirtual, projectEndStatus } = record;
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/project/contract/addChildren">
                            {Number(contractCategory) === 0
                                && Number(contractApprovalStatus) === 3
                                && Number(contractIsVirtual) !== 1 && (
                                <span
                                    className={
                                        Number(projectEndStatus) === 1
                                            ? `${styles.btnCls} ${styles.disabled}`
                                            : styles.btnCls
                                    }
                                    onClick={() => {
                                        return props.addChildContract(record.contractId);
                                    }}
                                >
                                    创建子合同
                                </span>
                            )}
                        </AuthButton>
                        {/*
                        <AuthButton authority="/foreEnd/business/project/contract/specialEdit">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.editData(record.contractId, 1);
                                }}
                            >
                                {' '}
                                编辑
                            </span>
                        </AuthButton>
                        */}
                        <AuthButton authority="/foreEnd/business/project/contract/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.checkData(record.contractId);
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
export default columnsFn;
