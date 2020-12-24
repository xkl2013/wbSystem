import React from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';


const CustomInput = (props: InputProps) => {
    return <Input {...props} />
}
export default CustomInput;