import React from 'react';
import styles from './index.less';
import { CommonProps } from '../detailInterface';

export const ApolloCheckBoxDetail = (props: CommonProps) => {
    const { value, componentAttr } = props;
    if (!value) return null;

    const { isMultiple } = componentAttr || {};
    let text = '';
    if (isMultiple) {
        text = (Array.isArray(value)
            ? value.map((item) => {
                return item.text;
            })
            : []
        ).join('，');
    } else {
        text = Array.isArray(value) && value.length > 0 ? value[0].text : '';
    }
    return <div className={styles.text}>{text}</div>;
};
