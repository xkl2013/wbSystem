import React, { forwardRef, useState, useEffect } from 'react';
import { InputNumber } from 'antd';
import { numToFixed } from '@/utils/utils';
import styles from './styles.less';

function Rate(props, ref) {
    const {
        value, precision, decimalPartMaxLength = 2, minValue, maxValue, ...others
    } = props;
    const setFormater = (val) => {
        if (!val) return val;
        return numToFixed(val / 100, decimalPartMaxLength);
    };
    const [newValue, setValue] = useState();
    useEffect(() => {
        const newVal = props.value ? numToFixed(props.value * 100, decimalPartMaxLength - 2) : props.value;
        setValue(newVal);
    }, [decimalPartMaxLength, props.value]);
    const onChange = (val) => {
        const newVal = setFormater(val);
        if (props.onChange) {
            props.onChange(newVal);
        }
        setValue(val);
    };
    return (
        <div className={styles.tailNode}>
            <InputNumber
                ref={ref}
                {...others}
                min={minValue}
                max={maxValue}
                className={styles.taxesRateInput}
                value={newValue}
                formatter={(val) => {
                    return `${val}%`;
                }}
                parser={(val) => {
                    return val.replace('%', '');
                }}
                onChange={onChange}
                precision={precision}
            />
        </div>
    );
}
export default forwardRef(Rate);
