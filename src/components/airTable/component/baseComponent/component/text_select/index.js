import React from 'react';
import Search from '@/components/dataEntry/textSelect';
import { approvalBusinessData } from '@/services/globalSearchApi';

export default function (props) {
    const { onChange } = props;
    const changeValue = (...arg) => {
        if (typeof onChange === 'function') {
            onChange(...arg);
        }
    };
    return (
        <div>
            <Search
                request={(val) => {
                    return approvalBusinessData({ name: val, fieldValueName: props.type });
                }}
                fieldNames={{ value: 'fieldValueValue', label: 'fieldValueName' }}
                {...props}
                onChange={changeValue}
            />
        </div>
    );
}
