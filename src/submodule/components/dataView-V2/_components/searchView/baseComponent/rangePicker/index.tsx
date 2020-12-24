import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';

export const formatStr = 'YYYY-MM-DD HH:mm:ss';

const { RangePicker } = DatePicker
const CustomInput = (props: any) => {
    const value = props.value && Array.isArray(props.value) ? props.value.map((ls: string) => moment(ls)) : props.value
    const onChange = (val: any) => {
        if (props.onChange) {
            let setFormat = formatStr;
            const newVal = val && Array.isArray(val) ? val.map(ls => ls.format ? ls.format(setFormat) : ls) : val;
            return props.onChange(newVal)
        }
    }
    return <RangePicker placeholder={props.placeholder || ['开始时间', '结束时间']}{...props} value={value} onChange={onChange} />
}
export default CustomInput;