import React, { useState } from 'react';
import { InputNumber } from 'antd';
import styles from './styles.less';
import { ApolloNumberProps } from '../editInterface';
import { antiAssign } from '../../../../utils/utils';

export const ApolloNumber = (props: ApolloNumberProps) => {
    const { onChange, origin, value, onEmitChange }: any = props;
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
    };
    const onBlur = (value: any) => {
        if (typeof onEmitChange === 'function') {
            onEmitChange(value);
        }
    };
    const style: any = {};
    if (origin === 'editForm') {
        style.height = '32px';
    }

    return (
        <InputNumber
            value={curValue}
            onBlur={(e) => {
                onBlur(e.target.value);
            }}
            className={styles.number}
            style={style}
            {...selfProps}
            onChange={changeValue}
        />
    );
};
