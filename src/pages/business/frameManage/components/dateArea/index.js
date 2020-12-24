import React, { forwardRef } from 'react';
import moment from 'moment';
import DateArea from '@/components/airTable/component/baseComponent/component/rangePicker';
import getFormatter from '@/components/airTable/component/baseComponent/_utils/getFormatter';
import { SetFormatter, formatStr } from '@/components/airTable/component/baseComponent/_utils/setFormatter';
import styles from './styles.less';

const CustomDateArea = forwardRef((props, ref) => {
    const { columnConfig = {}, changeParams } = props;
    const onChange = (val) => {
        const newVal = SetFormatter.RANGE_PICKER(val, columnConfig.columnAttrObj || {});
        if (props.onChange) {
            props.onChange(newVal);
        }
        if (changeParams) {
            // 同步form使用,后期会封装到组件里面
            changeParams(newVal);
        }
    };
    return <DateArea {...props} ref={ref} value={getFormatter.RANGE_PICKER(props.value)} onChange={onChange} />;
});
const DateAreaDetail = forwardRef((props, ref) => {
    const { value, componentAttr = {} } = props;
    const format = componentAttr.format || formatStr;
    if (!Array.isArray(value)) return null;
    let newVal = (value[0] || {}).value;
    newVal = newVal ? newVal.split('~') : [];
    const [startTime, endTime] = newVal;
    const returnVal = newVal
        .map((ls) => {
            return ls ? moment(ls).format(format) : ls;
        })
        .join('~');
    const checkDateAreaColor = () => {
        // 核算起始日期≤当前访问时间≤核算终止日期：日期为蓝色
        if (moment().isBetween(startTime, endTime)) {
            return 'rgb(205, 225, 255)';
        }
        // 当前访问时间≤核算起始日期：日期为绿色
        if (moment().isBefore(startTime)) {
            return 'rgba(4, 180, 173, 0.2)';
        }
        // 核算终止日期≤当前访问时间：日期为红色
        if (moment().isAfter(endTime)) {
            return 'rgb(252, 213, 220)';
        }
        return '#fff';
    };
    return (
        <div className={styles.dateWrap} ref={ref}>
            <span style={{ background: checkDateAreaColor() }} className={styles.dateWord}>
                {returnVal}
            </span>
        </div>
    );
});
CustomDateArea.Detail = DateAreaDetail;
export default CustomDateArea;
