import React, { forwardRef, useState, useEffect } from 'react';
import DatePicker from '@/ant_components/BIDatePicker';
import styles from './styles.less';

function TimeRange(props, ref) {
    const [value, setValue] = useState(props.value);
    useEffect(() => {
        setValue(props.value);
    }, [props.value]);
    const [startPlace, endPlace] = props.placeholder || [];
    const onChangeStart = (val) => {
        const newVal = { ...value, start: val };
        if (props.onChange) {
            props.onChange(newVal);
        }
        setValue(newVal);
    };
    const onChangeEnd = (val) => {
        const newVal = { ...value, end: val };
        if (props.onChange) {
            props.onChange(newVal);
        }
        setValue(newVal);
    };
    const { start, end } = value || {};
    return (
        <div className={styles.wrap} ref={ref}>
            <span className={styles.dateItem}>
                <DatePicker showTime placeholder={startPlace} value={start} onChange={onChangeStart} />
            </span>
            <span className={styles.splitLine}>-</span>
            <span className={styles.dateItem}>
                <DatePicker showTime placeholder={endPlace} value={end} onChange={onChangeEnd} />
            </span>
        </div>
    );
}
export default forwardRef(TimeRange);
