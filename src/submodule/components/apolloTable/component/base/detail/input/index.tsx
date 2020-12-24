import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import styles from './index.less';
import { InputProps } from '../detailInterface';

export const ApolloInputDetail = (props: InputProps) => {
    const { className, origin, columnConfig } = props;
    const value = props.formatter ? props.formatter(props.value) : props.value;
    if (!value) {
        return null;
    }
    const [dotVisible, setDotVisible] = useState(false);
    const container = useRef(null);
    const dom = useRef(null);
    const detaWidth = useRef(columnConfig.width || 0);
    useEffect(() => {
        const containerTarget: any = container.current;
        const target: any = dom.current;
        const deta = columnConfig.width - detaWidth.current;
        if (containerTarget && target) {
            if (target.clientWidth > containerTarget.clientWidth + deta) {
                setDotVisible(true);
            } else {
                setDotVisible(false);
            }
        }
        if (deta !== 0) {
            detaWidth.current = columnConfig.width;
        }
    }, [value, columnConfig.width]);

    if (origin === 'detailForm') {
        return <div className={classNames(styles.text, className)}>{value}</div>;
    }

    if (typeof value === 'string') {
        return (
            <div className={styles.container} ref={container}>
                {dotVisible ? (
                    <Tooltip title={value}>
                        <div className={classNames(styles.text, className)}>{value}</div>
                    </Tooltip>
                ) : (
                    <div className={classNames(styles.text, className)}>{value}</div>
                )}
                <div className={styles.itemBgTxt} ref={dom}>
                    {value}
                </div>
            </div>
        );
    }
    return '数据错误';
};
