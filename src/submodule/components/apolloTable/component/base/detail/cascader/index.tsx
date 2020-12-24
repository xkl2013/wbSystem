import React from 'react';
import styles from './index.less';

export const ApolloCascaderDetail = (props) => {
    const { value } = props;

    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            const text = value[0] && value[0].text;
            return <div className={styles.text}>{text}</div>;
        }
    }
    return '数据错误';
};
