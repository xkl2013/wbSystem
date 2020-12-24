import React, { useRef, useState } from 'react';
import { DatePicker } from 'antd';
import { antiAssign } from '../../../../utils/utils';
import styles from './styles.less';

export const ApolloDate = (props: any) => {
    const { onChange, showTime, onEmitChange, value } = props;
    const selfProps = antiAssign(props, [
        'onChange',
        'columnConfig',
        'tableId',
        'rowData',
        'cellRenderProps',
        'maxPopHeight',
        'onEmitChange',
        'getPopupContainer',
        'origin',
        'disableOptions',
        'rowId',
        'getInstanceDetail',
        'value',
    ]);
    selfProps.disabled = !!props.disabled;
    const isOpen: any = useRef();
    const [curValue, setCurValue] = useState(value);
    const changeValue = (date: any, dateString: string) => {
        setCurValue(date);
        if (typeof onChange === 'function') {
            onChange(date, dateString);
        }
        if (typeof onEmitChange === 'function' && !isOpen.current) {
            onEmitChange(date);
        }
    };
    const dateOnBlurFn = (open: boolean) => {
        isOpen.current = open;
    };
    const timeOnBlurFn = (open: boolean) => {
        isOpen.current = open;
        if (typeof onEmitChange === 'function' && !open) {
            onEmitChange(curValue);
        }
    };
    return (
        <DatePicker
            className={styles.date}
            value={curValue}
            dropdownClassName={styles.dropdownClassName}
            popupStyle={{ width: '350px' }}
            {...selfProps}
            onChange={changeValue}
            onOpenChange={showTime ? timeOnBlurFn : dateOnBlurFn}
        />
    );
};
