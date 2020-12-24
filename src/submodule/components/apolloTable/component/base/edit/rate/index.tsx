import React, { useState } from 'react';
import { Icon, Rate } from 'antd';
import { antiAssign } from '../../../../utils/utils';
import s from './index.less';
import { ApolloRateProps } from '../editInterface';

export const ApolloRate = (props: ApolloRateProps) => {
    const { onChange, columnConfig, onEmitChange, value } = props;
    const selfProps = antiAssign(props, [
        'columnConfig',
        'onEmitChange',
        'onChange',
        'value',
        'tableId',
        'rowData',
        'cellRenderProps',
        'maxPopHeight',
        'getCalendarContainer',
        'getCalendarContainer',
        'origin',
        'disableOptions',
        'rowId',
        'getInstanceDetail',
    ]);
    selfProps.disabled = !!props.disabled;
    const [curValue, setCurValue] = useState(value);
    const changeValue = (value: any) => {
        setCurValue(value);
        if (typeof onChange === 'function') {
            onChange(value);
        }
        if (typeof onEmitChange === 'function') {
            onEmitChange(value);
        }
    };
    if (columnConfig.requiredFlag) {
        selfProps.allowClear = false;
    }
    return (
        <Rate
            className={s.rate}
            {...selfProps}
            character={<Icon type="like" theme="filled" />}
            onChange={changeValue}
            value={curValue}
        />
    );
};
