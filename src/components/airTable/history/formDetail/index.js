import React from 'react';
import _ from 'lodash';
import styles from './index.less';
import { config } from '@/components/airTable/config';

function followList(data) {
    if (_.isEmpty(data)) {
        return null;
    }
    return data.map((item, index) => {
        if (!config[String(item.type)]) {
            return null;
        }
        const { component } = config[String(item.type)];
        return (
            <div key={index} className={styles.row}>
                <div className={styles.listLeft}>{`${item.title}：`}</div>
                <div className={styles.listRight}>
                    <component.Detail value={item.value} columnConfig={item} displayTarget="detail" />
                </div>
            </div>
        );
    });
}

export default function FormDetail(props) {
    const { name, data } = props;

    return (
        <div className={styles.wrap}>
            <p className={styles.titleCls}>{name}</p>
            <div id="gotop" className={styles.formWrap}>
                <div className={styles.listCls}>{followList(data)}</div>
            </div>
        </div>
    );
}
