import React, { useState, useRef } from 'react';
import InputSearch from '../../extra/dataEntry/textSelect';
import { ApolloInputSearchProps } from '../editInterface';
import { antiAssign } from '../../../../utils/utils';
import s from './index.less';

export const ApolloInputSearch = (props: ApolloInputSearchProps) => {
    const { onChange, request, onEmitChange, origin, value } = props;
    const selfProps = antiAssign(props, [
        'columnConfig',
        'onEmitChange',
        'value',
        'onChange',
        'request',
        'tableId',
        'rowId',
        'rowData',
        'cellRenderProps',
        'getCalendarContainer',
        'events',
        'isMultiple',
        'options',
        'disableOptions',
        'maxPopHeight',
        'form',
        'getInstanceDetail',
    ]);
    const [curValue, setCurValue] = useState(value);
    const isOpen = useRef(null);
    const changeValue = (value: any) => {
        setCurValue(value);
        if (typeof onChange === 'function') {
            onChange(value, value);
        }
        // 弹框关闭时触发修改
        if (origin === 'table' && selfProps.mode !== 'multiple' && !isOpen.current) {
            onBlur(value);
        }
    };
    const onBlur = (value: any) => {
        if (typeof onEmitChange === 'function') {
            onEmitChange(value, value);
        }
    };
    const onDropdownVisibleChange = (open: boolean) => {
        isOpen.current = open;
    };
    if (origin === 'table') {
        selfProps.onDropdownVisibleChange = onDropdownVisibleChange;
    }
    return (
        <InputSearch
            className={s.select}
            request={request}
            fieldNames={{ value: 'fieldValueValue', label: 'fieldValueName' }}
            {...selfProps}
            onChange={changeValue}
            initDataType="onfocus"
            value={curValue}
        />
    );
};
