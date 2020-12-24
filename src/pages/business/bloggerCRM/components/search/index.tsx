import React from 'react';
import { Input } from 'antd';
import classNames from 'classnames';
import IconFont from '@/components/CustomIcon/IconFont';
import s from './index.less';

const Search = (props: any) => {
    const { className, onSearch, onChange, value } = props;
    const onInputSearch = (val: any) => {
        onChange(val);
        if (typeof onSearch === 'function') {
            onSearch({ pageNum: 1, clearSearch: !val });
        }
    };

    return (
        <Input.Search
            allowClear
            className={classNames(s.search, className)}
            placeholder="请输入talent名称"
            onChange={(e) => {
                onChange(e.target.value);
            }}
            enterButton="搜索"
            value={value}
            // onPressEnter={onSearch}
            onSearch={onInputSearch}
            prefix={<IconFont type="iconziduan-lianxiangdanxuan" style={{ color: 'rgba(0,0,0,.25)' }} />}
        />
    );
};
export default Search;
