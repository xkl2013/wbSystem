import React from 'react';
import styles from './index.less';
import checkDetail from '../_utils/checkDetail';
import { APPROVAL_APPROVAL_STATUS } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';

// 获取table列表头
export default function columnsFn() {
    const columns = [
        {
            title: '申请人',
            dataIndex: 'applyUserName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '审批事项',
            dataIndex: 'approvalType',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '审批摘要',
            dataIndex: 'approvalTip',
            width: 400,
            render: (d) => {
                return (d || []).map((item) => {
                    return (
                        <div>
                            <div className={styles.summary}>
                                实际报销人：
                                {item.trueFeeName}
                            </div>
                            <div className={styles.summary}>
                                收款对象：
                                {item.payName}
                            </div>
                            <div className={styles.summary}>
                                费用承担主体：
                                <span style={{ cursor: 'pointer' }}>{renderTxt(item.feePayPerson, 14)}</span>
                            </div>
                            <div className={styles.summary}>
                                报销总额：
                                {thousandSeparatorFixed(item.totalMoney)}
                            </div>
                            <div className={styles.summary}>
                                报销事由：
                                {item.reason}
                            </div>
                        </div>
                    );
                });
            },
        },
        {
            title: '申请时间',
            dataIndex: 'applyDate',
        },
        {
            title: '处理时间',
            dataIndex: 'handleDate',
        },
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            render: (text) => {
                return getOptionName(APPROVAL_APPROVAL_STATUS, text);
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    // <Button type="link" onClick={() => props.checkData(record.instanceId)}>查看</Button>
                    <div>
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return checkDetail(record.id);
                            }}
                        >
                            {' '}
                            查看
                        </span>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
