import React, { useRef, useState } from 'react';
import { DatePicker } from 'antd';
import { antiAssign } from '../../../../utils/utils';
import styles from './styles.less';

const { RangePicker } = DatePicker;
export const ApolloDateRange = (props: any) => {
    const { onChange, placeholder, showTime, beginDatePlaceholder, endDatePlaceholder, value, onEmitChange } = props;
    const selfProps = antiAssign(props, [
        'onChange',
        'columnConfig',
        'onEmitChange',
        'beginDatePlaceholder',
        'endDatePlaceholder',
        'tableId',
        'rowData',
        'value',
        'cellRenderProps',
        'maxPopHeight',
        'getPopupContainer',
        'origin',
        'disableOptions',
        'rowId',
        'getInstanceDetail',
    ]);
    selfProps.disabled = !!props.disabled;
    selfProps.showTime=true;
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
        <RangePicker
            className={styles.date}
            dropdownClassName={styles.dropdownClassName}
            value={curValue}
            {...selfProps}
            placeholder={[beginDatePlaceholder || placeholder, endDatePlaceholder || placeholder]}
            onChange={changeValue}
            onOpenChange={selfProps.showTime ? timeOnBlurFn : dateOnBlurFn}
        />
    );
};
