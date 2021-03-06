/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import React from 'react';
import moment from 'moment';
import styles from './index.less';
import { DATE_FORMAT } from '@/utils/constants';
import { thousandSeparatorFixed } from '@/utils/utils';

// 获取table列表头
export function columnsFn({ from }, props) {
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            render: (...arg) => {
                return arg[2] + 1;
            },
        },
        {
            title: '回款批次',
            dataIndex: 'batch',
        },
        {
            title: '预计回款金额',
            dataIndex: 'projectingReturnMoney',
            render: (text) => {
                return text && `¥ ${thousandSeparatorFixed(text, 2)}`;
            },
        },
        {
            title: '预计回款时间',
            dataIndex: 'projectingReturnDate',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return props.editTableLine(record);
                            }}
                        >
                            编辑
                        </span>
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return props.delTableLine(record);
                            }}
                        >
                            删除
                        </span>
                    </div>
                );
            },
        },
    ];
    if (from === 'detail') {
        columns.pop();
    }
    return columns || [];
}
export default columnsFn;
