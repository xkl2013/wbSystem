import React from 'react';
import { numToFixed } from '@/utils/utils';
import styles from './index.less';

export default function Detail(props) {
    const { formatter, value, componentAttr = {} } = props;
    const { decimalPartMaxLength = 2 } = componentAttr;
    const formatValue = formatter ? formatter(value) : value;
    const getFormater = (val) => {
        if (!val) return val;
        return numToFixed(val * 100, decimalPartMaxLength - 2);
    };
    return <div className={styles.text}>{formatValue ? `${getFormater(formatValue)}%` : ''}</div>;
}
