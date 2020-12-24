import React, { useState } from 'react';
import BIInput from '@/ant_components/BIInput';
import IconFont from '@/components/CustomIcon/IconFont';

const Search = (props) => {
    const {
        columnConfig: { columnChsName },
        onPressEnter,
    } = props;
    const [value, setValue] = useState('');
    const onClick = () => {
        if (typeof onPressEnter === 'function') {
            onPressEnter(value);
        }
    };

    const placeholder = `请输入${columnChsName}搜索`;
    return (
        <BIInput
            placeholder={placeholder}
            onChange={(e) => {
                setValue(e.target.value);
            }}
            value={value}
            onPressEnter={onClick}
            prefix={
                <IconFont type="iconziduan-lianxiangdanxuan" style={{ color: 'rgba(0,0,0,.25)' }} onClick={onClick} />
            }
        />
    );
};
export default Search;
