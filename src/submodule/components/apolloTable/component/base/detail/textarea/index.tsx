import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import styles from './index.less';
import { TextAreaProps } from '../detailInterface';

export const ApolloTextAreaDetail = (props: TextAreaProps) => {
    const { className, origin, componentAttr, rowData, formatter, columnConfig } = props;
    const formatValue = formatter ? formatter(props.value) : props.value;
    if (!formatValue) {
        return null;
    }
    const [value, setValue] = useState(formatValue);
    useEffect(() => {
        setValue(formatValue);
    }, [formatValue]);
    const { cutLength, getDetail } = componentAttr;
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

    const getMore = async () => {
        let newValue = await getDetail({ rowId: rowData.id });
        if (newValue) {
            newValue = formatter ? formatter(newValue) : newValue;
            setValue(newValue);
        }
    };

    if (origin === 'detailForm') {
        return <div className={classNames(styles.text, className)}>{value}</div>;
    }

    if (typeof value === 'string') {
        return (
            <div className={styles.container} ref={container}>
                {dotVisible ? (
                    <Tooltip
                        // overlayClassName={styles.tooltip}
                        title={
                            <div className={styles.tooltipTitle}>
                                {value}
                                {value.length === cutLength && (
                                    <span className={styles.more} onClick={getMore}>
                                        查看更多
                                    </span>
                                )}
                            </div>
                        }
                    >
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
