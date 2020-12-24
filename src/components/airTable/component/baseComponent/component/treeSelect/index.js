import React from 'react';
import Search from '@/components/orgTreeSelect';

export default function (props) {
    const { isMultiple = false, width } = props;
    return (
        <Search
            mode="org"
            dropdownStyle={{ width: width || 270, maxHeight: '300px' }}
            multiple={isMultiple}
            {...props}
        />
    );
}
