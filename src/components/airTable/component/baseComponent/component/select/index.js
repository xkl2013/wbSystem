import React from 'react';
import Select from '@/ant_components/BISelect';

export default function (props) {
    const { options = [] } = props;
    return (
        <Select {...props}>
            {options.map((item) => {
                return (
                    <Select.Option key={item.id} value={item.id}>
                        {item.name}
                    </Select.Option>
                );
            })}
        </Select>
    );
}
