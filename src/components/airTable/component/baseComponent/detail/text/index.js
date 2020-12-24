import React from 'react';
import styles from './index.less';

export default function Detail(props) {
    const { formatter, value, displayTarget } = props;
    const formatValue = formatter ? formatter(value) : value;

    if (!formatValue) {
        return null;
    }
    const style = {};
    if (displayTarget === 'detail') {
        style.overflow = 'auto';
        style.whiteSpace = 'normal';
    }
    if (typeof formatValue === 'string') {
        return (
            <div className={styles.text} style={style}>
                {formatValue}
            </div>
        );
    }
    return '数据错误';
}
