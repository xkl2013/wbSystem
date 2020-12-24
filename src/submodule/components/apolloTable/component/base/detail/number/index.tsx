import React from 'react';
import styles from './index.less';
import { NumberProps } from '../detailInterface';

export const ApolloNumberDetail = (props: NumberProps) => {
    const { value, formatter, componentAttr } = props;
    const formatValue = formatter ? formatter(value, componentAttr) : value;
    if (!formatValue) return null;

    if (typeof formatValue === 'string') {
        return <div className={styles.text}>{formatValue}</div>;
    }
    return '数据错误';
};
