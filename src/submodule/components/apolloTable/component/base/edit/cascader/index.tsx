import React from 'react';
import { Cascader } from 'antd';
import { ApolloCascaderProps } from '../editInterface';
import { antiAssign } from '../../../../utils/utils';
import s from './index.less';

function filter(inputValue, path) {
    return path.some((option) => {
        return option.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    });
}
export const ApolloCascader = (props: ApolloCascaderProps) => {
    const {
        requestCode,
        fieldNames = { label: 'label', value: 'value', children: 'children' },
        showSearch,
        onChange,
        request,
    } = props;
    const selfProps = antiAssign(props, [
        'columnConfig',
        'onChange',
        'requestCode',
        'request',
        'fieldNames',
        'tableId',
        'cellRenderProps',
        'maxPopHeight',
        'getCalendarContainer',
        'origin',
    ]);
    const [options, setOptions] = React.useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            const res = await request(requestCode);
            if (res) {
                setOptions(res);
            }
        };
        if (requestCode) {
            fetchData();
        }
    }, [requestCode]);
    const changeValue = (value, option) => {
        if (typeof onChange === 'function') {
            onChange(value, option);
        }
    };

    return (
        <Cascader
            className={s.cascader}
            onChange={changeValue}
            options={options}
            fieldNames={fieldNames}
            showSearch={showSearch ? { filter } : false}
            {...selfProps}
        />
    );
};
