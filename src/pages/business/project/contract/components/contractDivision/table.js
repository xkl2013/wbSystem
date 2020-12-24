/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import React from 'react';
import styles from '../index.less';
import { dataMask4Number, thousandSeparatorFixed } from '@/utils/utils';

// 获取table列表头
export function columnsFn(obj, props) {
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
            title: '艺人/博主',
            dataIndex: 'talentName',
        },
        {
            title: '拆账比例',
            dataIndex: 'divideAmountRate',
            render: (text) => {
                return (
                    text !== undefined
                    && dataMask4Number(text, 0, (value) => {
                        return `${value.toFixed(4)}%`;
                    })
                );
            },
        },
        {
            title: '拆账金额',
            dataIndex: 'divideAmount',
            render: (text) => {
                return (
                    text !== undefined
                    && dataMask4Number(text, 0, (value) => {
                        return `¥ ${thousandSeparatorFixed(value, 2)}`;
                    })
                );
            },
        },
        {
            title: '分成比例(艺人：公司)',
            dataIndex: 'separateRatio',
            render: (text, record) => {
                return Number(record.divideRateTalent) + Number(record.divideRateCompany) === 100
                    ? `${record.divideRateTalent}:${record.divideRateCompany}`
                    : '';
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
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
export default columnsFn;
