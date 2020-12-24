import React, { useRef, useState } from 'react';
import { Select } from 'antd';
import { ApolloSelectProps } from '../editInterface';
import { antiAssign } from '../../../../utils/utils';
import s from './index.less';

export const ApolloSelect = (props: ApolloSelectProps) => {
    const { options = [], onChange, isMultiple, maxPopHeight, onEmitChange, value, origin } = props;
    const selfProps = antiAssign(props, [
        'tableId',
        'rowId',
        'rowData',
        'columnConfig',
        'onEmitChange',
        'value',
        'onChange',
        'events',
        'isMultiple',
        'options',
        'disableOptions',
        'maxPopHeight',
        'request',
        'form',
        'cellRenderProps',
        'getCalendarContainer',
        'getInstanceDetail',
    ]);
    selfProps.disabled = !!props.disabled;

    if (isMultiple) {
        selfProps.mode = 'multiple';
    }
    const [curValue, setCurValue] = useState(value);
    const isOpen: any = useRef();
    const changeValue = (value: any) => {
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
    if (maxPopHeight) {
        extra.dropdownClassName = s.selectDropdown;
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
        <Select className={s.select} {...selfProps} onChange={changeValue} value={curValue} {...extra} onBlur={onBlur}>
            {options.map((item) => {
                return (
                    <Select.Option key={item.id} value={item.id}>
                        {item.name}
                    </Select.Option>
                );
            })}
        </Select>
    );
};
