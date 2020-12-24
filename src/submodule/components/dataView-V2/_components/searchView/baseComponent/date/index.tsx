import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import { InputProps } from 'antd/es/input';

export const formatStr = 'YYYY-MM-DD HH:mm:ss';

const CustomInput = (props: InputProps) => {
    const value = props.value ? moment(props.value) : props.value
    const onChange = (val: any) => {
        if (props.onChange) {
            let setFormat = formatStr;
            const newVal = val.format ? val.format(setFormat) : val;
            return props.onChange(newVal)
        }
    }
    return <DatePicker
        {...props}
        value={value} onChange={onChange} />
}
export default CustomInput;