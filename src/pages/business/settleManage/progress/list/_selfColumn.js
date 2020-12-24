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
            title: '项目名称',
            dataIndex: 'projectingName',
            width: 150,
            render: (text) => {
                return <span style={{ whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
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
        }
    ];
    return columns || [];
}

const value = '';

export { value, columnsFn };
