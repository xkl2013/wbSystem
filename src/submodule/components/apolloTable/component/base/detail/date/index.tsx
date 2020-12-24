import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { formatStr } from '../../_utils/setFormatter';
import { DateProps } from '../detailInterface';
import styles from '../input/index.less';


export const ApolloDateDetail = (props: DateProps) => {
    const { value, formatter, componentAttr, className } = props;
    const formatValue = formatter ? formatter(value) : value;
    if (!formatValue) return null;
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

    let valueStr = '';
    if (typeof formatValue === 'string') {
        valueStr = formatValue;
    } else {
        valueStr = formatValue.format ? formatValue.format(format) : formatValue;
    }
    return (
        <div className={styles.container} ref={container}>
            {dotVisible ? (
                <Tooltip title={valueStr}>
                    <div className={classNames(styles.text, className)}>{valueStr}</div>
                </Tooltip>
            ) : (
                <div className={classNames(styles.text, className)}>{valueStr}</div>
            )}
            <div className={styles.itemBgTxt} ref={dom}>
                {valueStr}
            </div>
        </div>
    );
};
