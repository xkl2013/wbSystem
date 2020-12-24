import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';

const Option = Select.Option;
export interface ApolloSelectProps extends SelectProps<any> {
    isMultiple?: boolean;
    options?: any[];
}
const Custom = (props: ApolloSelectProps) => {
    return <Select {...props}>{props.children}</Select>
}
Custom.Option = Option
export default Custom;