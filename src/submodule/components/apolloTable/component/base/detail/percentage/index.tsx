import React from 'react';
import styles from './index.less';
import { PercentageProps } from '../detailInterface';

export const ApolloPercentageDetail = (props: PercentageProps) => {
    const { value, formatter, componentAttr } = props;
    const formatValue = formatter ? formatter(value, componentAttr) : value;
    if (!formatValue) return null;
    return <div className={styles.text}>{formatValue}</div>;
};
