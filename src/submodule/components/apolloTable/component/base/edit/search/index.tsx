import React, { useState, useRef } from 'react';
import { message } from 'antd';
import Search from '../../extra/associationSearch';
import { ApolloSearchProps } from '../editInterface';
import { antiAssign } from '../../../../utils/utils';
import s from './index.less';

export const ApolloSearch = (props: ApolloSearchProps) => {
    const { onChange, maxCount, isMultiple, request, maxPopHeight, onEmitChange, value, origin } = props;
    const selfProps = antiAssign(props, [
        'columnConfig',
        'onEmitChange',
        'onChange',
        'isMultiple',
        'options',
        'value',
        'request',
        'maxCount',
        'request',
        'tableId',
        'rowData',
        'cellRenderProps',
        'getCalendarContainer',
        'maxPopHeight',
        'disableOptions',
        'rowId',
        'getInstanceDetail',
    ]);
    selfProps.disabled = !!props.disabled;
    if (isMultiple) {
        selfProps.mode = 'multiple';
    }
    const [curValue, setCurValue] = useState(value);
    const isOpen: any = useRef();
    const changeValue = (value: any) => {
        if (isMultiple && maxCount && maxCount < value.length) {
            message.warn(`最多选择${maxCount}个`);
            return;
        }
        setCurValue(value);
        if (typeof onChange === 'function') {
            onChange(value, value);
        }
        // 表格中的单选，选择后直接触发更新
        if (origin === 'table' && selfProps.mode !== 'multiple') {
            onBlur(value);
        }
        if (selfProps.mode === 'multiple' && !isOpen.current) {
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

    const extra: any = {};
    // 表格中限制下拉类组件弹框高度
    if (maxPopHeight) {
        extra.dropdownClassName = s.searchDropdown;
        extra.dropdownStyle = {
            maxHeight: maxPopHeight,
        };
    }
    if (origin === 'table') {
        extra.defaultOpen = true;
        isOpen.current = true;
    }
    if (selfProps.mode === 'multiple') {
        extra.onDropdownVisibleChange = onDropdownVisibleChange;
    }
    return (
        <Search
            className={s.search}
            request={request}
            fieldNames={{ value: 'fieldValueValue', label: 'fieldValueName' }}
            {...selfProps}
            onChange={changeValue}
            initDataType="onfocus"
            {...extra}
            onBlur={onBlur}
            value={curValue}
        />
    );
};
