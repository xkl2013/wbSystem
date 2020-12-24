import React from 'react';
import styles from './index.less';
import { isNumber, thousandSeparatorFixed } from '@/utils/utils';

export default function Detail(props) {
    const { formatter, value, componentAttr } = props;
    if (!value) {
        return null;
    }
    if (value[0] && !isNumber(value[0].value)) {
        return <div className={styles.text}>{value[0].value}</div>;
    }
    const formatValue = formatter ? formatter(value, componentAttr) : value;
    const thousandSeparatorValue = formatValue && thousandSeparatorFixed(formatValue, componentAttr.precision);
    return <div className={styles.text}>{thousandSeparatorValue}</div>;
}
