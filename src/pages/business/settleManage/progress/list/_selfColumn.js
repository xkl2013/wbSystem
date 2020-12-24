import React from 'react';
import { getOptionName, thousandSeparatorFixed, dataMask4Number, toBusinessSaveParams } from '@/utils/utils';
import { CONTRACT_ARCHIVE_STATUS, SIFT_TYPE } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import styles from './index.less';

const toPage = (path, params) => {
    const id = getOptionName(SIFT_TYPE, path);
    toBusinessSaveParams(id, params);
    window.open(path);
};
const goProgress = (val) => {
    // 点击进入项目费用确认详情
    window.open(`/foreEnd/business/project/contract/verify/detail?id=${val}`, '_blank');
};

function columnsFn() {
    const columns = [
        {
            title: 'talent',
            dataIndex: 'talentName',
            width: 110,
            render: (text) => {
                return String(text).slice(0, 10);
            },
        },
        {
            title: '项目名称',
            dataIndex: 'projectingName',
            width: 150,
            render: (text) => {
                return <span style={{ whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '拆账金额',
            dataIndex: 'divideAmount',
            width: 120,
            render: (text) => {
                return <span style={{ whiteSpace: 'nowrap' }}>{renderTxt(`${thousandSeparatorFixed(text)}元`)}</span>;
            },
        },

        {
            title: '分成比例(艺人:公司）',
            dataIndex: 'divideRateTalent',
            width: 150,
            render: (text, record) => {
                return (
                    (record.divideRateCompany || record.divideRateTalent)
                    && `${dataMask4Number(record.divideRateTalent, 0, (value) => {
                        return (value * 100).toFixed(0);
                    })}:${dataMask4Number(record.divideRateCompany, 0, (value) => {
                        return (value * 100).toFixed(0);
                    })}`
                );
            },
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            width: 150,
            render: (text) => {
                return <span style={{ whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '回款进度',
            dataIndex: 'contractMoneyReturnProgress',
            width: 110,
        },
        {
            title: '开票进度',
            dataIndex: 'contractInvoiceProgress',
            width: 110,
        },
        {
            title: '费用报销单数',
            dataIndex: 'reimburseCount',
            width: 110,
            render: (text, record) => {
                const params = {
                    // 根据费用列表塞选项key
                    projectId: {
                        label: record.projectingName,
                        value: record.projectingId,
                    },
                    approvalStatus: ['3'],
                };
                return (
                    <span
                        className={!text ? `${styles.link} ${styles.disabled}` : styles.link}
                        onClick={
                            text
                                ? () => {
                                    return toPage('/foreEnd/business/feeManage/reimbursement', params);
                                }
                                : null
                        }
                    >
                        {text || 0}
                    </span>
                );
            },
        },
        {
            title: '费用申请单数',
            dataIndex: 'applicationCount',
            width: 110,
            render: (text, record) => {
                const params = {
                    // 根据费用列表塞选项key
                    applicationProjectId: {
                        label: record.projectingName,
                        value: record.projectingId,
                    },
                    applicationApproveStatus: ['3'],
                };
                return (
                    <span
                        className={!text ? `${styles.link} ${styles.disabled}` : styles.link}
                        onClick={
                            text
                                ? () => {
                                    return toPage('/foreEnd/business/feeManage/apply', params);
                                }
                                : null
                        }
                    >
                        {text || 0}
                    </span>
                );
            },
        },
        {
            title: '投放条数',
            dataIndex: 'popularizeCount',
            width: 110,
            render: (text, record) => {
                const params = {
                    // 根据费用列表塞选项key
                    projectName: {
                        label: record.projectingName,
                        value: record.projectingId,
                    },
                    putStatuses: ['3'],
                };
                return (
                    <span
                        className={!text ? `${styles.link} ${styles.disabled}` : styles.link}
                        onClick={
                            text
                                ? () => {
                                    return toPage('/foreEnd/business/talentManage/throwManage/list', params);
                                }
                                : null
                        }
                    >
                        {text || 0}
                    </span>
                );
            },
        },
        {
            title: '费用确认进度',
            width: 110,
            dataIndex: 'contractFeeVerifyProgree',
            render: (text, record) => {
                if (Number(record.contractType) === 4) {
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
                            return !disabled && goProgress(record.contractId);
                        }}
                    >
                        {content}
                    </span>
                );
            },
        },
        {
            title: '制作人',
            dataIndex: 'producerName',
            width: 110,
            render: (text) => {
                return renderTxt(text);
            },
        },
        {
            title: '签约日期',
            dataIndex: 'contractSigningDate',
            width: 130,
            render: (text) => {
                return String(text || '').slice(0, 10);
            },
        },
        {
            title: '归档状态',
            dataIndex: 'contractArchiveStatus',
            width: 100,
            render: (text) => {
                return getOptionName(CONTRACT_ARCHIVE_STATUS, text);
            },
        },
        {
            title: '商务',
            dataIndex: 'projectingHeaderName',
            width: 150,
            textAlign: 'left',
            render: (text) => {
                return String(text || '').slice(0, 10);
            },
        },
    ];
    return columns || [];
}

const value = '';

export { value, columnsFn };
