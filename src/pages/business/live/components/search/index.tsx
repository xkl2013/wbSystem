import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import classNames from 'classnames';
import IconFont from '@/components/CustomIcon/IconFont';
import { mergeFilter } from '@/utils/utils';
import s from './index.less';

const Search = (props: any) => {
    const {
        config: { colName, colChsName, operationCode },
        onSearch,
        filters,
        className,
        sortConfig,
    } = props;

    const [value, setValue] = useState('');
    useEffect(() => {
        const filterValue = filters
            && filters.find((item:any) => {
                return item.colName === colName;
            });
        if (filterValue) {
            setValue(filterValue.colValues[0].value);
        } else {
            setValue('');
        }
    }, [filters]);

    const onPressEnter = () => {
        if (typeof onSearch === 'function') {
            const filterOps: any[] = [];
            if (value) {
                filterOps.push({
                    colName,
                    colChsName,
                    colValues: [{ text: value, value }],
                    operationCode,
                });
            }
            const data: any = {};
            data[colName] = filterOps;
            const newFilters = mergeFilter(filters, data);
            const payload = [{ type: 'filterConfig', config: newFilters }];
            if (sortConfig) {
                payload.push({ type: 'sortConfig', config: sortConfig });
            }
            onSearch(payload);
        }
    };
    const onInputSearch = (value: any) => {
        if (typeof onSearch === 'function') {
            const filterOps: any[] = [];
            if (value) {
                filterOps.push({
                    colName,
                    colChsName,
                    colValues: [{ text: value, value }],
                    operationCode,
                });
            }
            const data: any = {};
            data[colName] = filterOps;
            const newFilters = mergeFilter(filters, data);
            const payload = [{ type: 'filterConfig', config: newFilters }];
            if (sortConfig) {
                payload.push({ type: 'sortConfig', config: sortConfig });
            }
            onSearch(payload);
        }
    };
    return (
        <Input.Search
            allowClear
            className={classNames(s.search, className)}
            placeholder={colChsName || 'Search'}
            onChange={(e) => {
                setValue(e.target.value);
            }}
            enterButton="搜索"
            value={value}
            // onPressEnter={onPressEnter}
            onSearch={onInputSearch}
            prefix={
                <IconFont
                    type="iconziduan-lianxiangdanxuan"
                    style={{ color: 'rgba(0,0,0,.25)' }}
                    // onClick={onPressEnter}
                />
            }
        />
    );
};
export default Search;
