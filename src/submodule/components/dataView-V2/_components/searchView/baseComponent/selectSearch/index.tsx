import React, { useState } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';

const Option: any = Select.Option;
export interface ApolloSelectProps extends SelectProps<any> {
    request: Function;
    isMultiple?: boolean;
    options?: any[];
    optionsKey?: {
        label: string;
        value: string;
    }
}
const Custom = (props: ApolloSelectProps) => {
    const [dataSource, setData] = useState<any[]>([])
    const optionsKey = props.optionsKey || { value: 'id', label: 'name' }
    const getList = async (val: string) => {
        if (props.request && typeof props.request === 'function') {
            const data = await props.request(val);
            if (data && Array.isArray(data)) {
                const newData = data.map(ls => ({
                    ...ls,
                    _id: ls[optionsKey.value],
                    _name: ls[optionsKey.label]
                }))
                setData(newData)
            }
        }
    }
    const handleSearch = (val: string) => {
        getList(val);
    };
    return <Select
        showSearch
        filterOption={false}
        onSearch={handleSearch}
        onFocus={getList.bind(null, '')}
        labelInValue
        {...props}>
        {dataSource.map((ls: any) => (
            <Option key={ls._id}>{ls._name}</Option>)
        )}</Select>
}
Custom.Option = Option
export default Custom;