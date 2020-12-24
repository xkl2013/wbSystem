import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { formatStr } from '../../_utils/setFormatter';
import { DateProps } from '../detailInterface';
import styles from '../input/index.less';

export const ApolloDateRangeDetail = (props: DateProps) => {
    const { value, formatter, componentAttr, className } = props;
    const formatValue = formatter ? formatter(value) : value;
    if (!formatValue || !Array.isArray(formatValue)) return null;

    const [dotVisible, setDotVisible] = useState(false);
    const container = useRef(null);
    const dom = useRef(null);
    useEffect(() => {
        const containerTarget: any = container.current;
        const target: any = dom.current;
        if (containerTarget && target) {
            if (target.clientWidth > containerTarget.clientWidth) {
                setDotVisible(true);
            } else {
                setDotVisible(false);
            }
        }
    }, [value]);

    const { format = formatStr } = componentAttr || {};

    const arr: any[] = [];
    formatValue.map((item) => {
        arr.push(item && item.format ? item.format(format) : item);
    });
    const dateStr = arr.join('~');

    return (
        <div className={styles.container} ref={container}>
            {dotVisible ? (
                <Tooltip title={dateStr}>
                    <div className={classNames(styles.text, className)}>{dateStr}</div>
                </Tooltip>
            ) : (
                <div className={classNames(styles.text, className)}>{dateStr}</div>
            )}
            <div className={styles.itemBgTxt} ref={dom}>
                {dateStr}
            </div>
        </div>
    );
};
