import React from 'react';
import { renderTxt } from '@/utils/hoverPopover';
import AuthButton from '@/components/AuthButton';
import { dataMask4Number, getOptionName } from '@/utils/utils';
import {
    CONTRACT_END_STATUS,
    CONTRACT_FEE_STATUS,
    PROJECT_MONEY_STATUS,
    // CONTRACT_SETTLEMENT_STATUS,
    PROJECTING_EXECTE_STATE,
    CONTRACT_REIMBURSE_STATUS,
} from '@/utils/enum';
import styles from './index.less';

// 获取table列表头
export function columnsFn(props) {
    const columns = [
        {
            title: '项目名称',
            dataIndex: 'projectingName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
            width: 180,
            fixed: true,
            align: 'left',
        },
        {
            title: '项目编号',
            dataIndex: 'projectingCode',
            width: 180,
            fixed: true,
            align: 'left',
        },
        {
            title: '公司名称',
            dataIndex: 'projectingCustomerName',
            render: (text, record) => {
                return (
                    <span style={{ cursor: 'pointer' }}>
                        {!record.projectingCompanyName ? renderTxt(text) : renderTxt(record.projectingCompanyName)}
                    </span>
                );
            },
            width: 180,
        },
        {
            title: '签单额',
            dataIndex: 'projectingBudget',
            render: (d, record) => {
                if (Number(record.projectingType) === 4) {
                    return '';
                }
                return d && `${dataMask4Number(d)}元`;
            },
        },
        {
            title: '负责人',
            dataIndex: 'projectingHeaderName',
        },
        {
            title: '更新时间',
            dataIndex: 'projectingUpdatedAt',
            width: 180,
        },
        {
            title: '执行状态',
            dataIndex: 'projectingExecteState',
            render: (text) => {
                return getOptionName(PROJECTING_EXECTE_STATE, text);
            },
        },
        {
            title: '回款状态',
            dataIndex: 'returnStatus',
            render: (text, record) => {
                // 直播项目隐藏回款、费用、结案
                if (Number(record.projectingType) === 4) {
                    return '';
                }
                return getOptionName(PROJECT_MONEY_STATUS, text);
            },
        },
        {
            title: '费用确认状态',
            dataIndex: 'expenseConfirmStatus',
            render: (text, record) => {
                if (Number(record.projectingType) === 4) {
                    return '';
                }
                return getOptionName(CONTRACT_FEE_STATUS, text);
            },
        },
        // {
        //     title: '结算状态',
        //     dataIndex: 'settleStatus',
        //     render: (text) => {
        //         return getOptionName(CONTRACT_SETTLEMENT_STATUS, text);
        //     },
        // },
        {
            title: '结案状态',
            dataIndex: 'endStatus',
            render: (text, record) => {
                if (Number(record.projectingType) === 4) {
                    return '';
                }
                return getOptionName(CONTRACT_END_STATUS, text);
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/project/manage/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.checkData(record.projectingId);
                                }}
                            >
                                {' '}
                                查看
                            </span>
                        </AuthButton>
                    </div>
                );
            },
            width: 80,
            fixed: 'right',
        },
    ];
    return columns || [];
}
export default columnsFn;
