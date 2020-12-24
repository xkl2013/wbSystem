import React, { useState } from 'react';
import { Input } from 'antd';
import styles from './styles.less';
import { antiAssign } from '../../../../utils/utils';
import { ApolloInputProps } from '../editInterface';
import { Consumer } from '../../../context';

export const ApolloInput = (props: ApolloInputProps) => {
    const { maxLength, onChange, onEmitChange, value, style, origin } = props;
    const selfProps = antiAssign(props, [
        'columnConfig',
        'onChange',
        'style',
        'onEmitChange',
        'rowData',
        'tableId',
        'cellRenderProps',
        'maxPopHeight',
        'getPopupContainer',
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
    const newStyle: any = {
        ...style,
    };
    const wordNumStyle: any = {};
    if (maxLength) {
        // 表单中样式
        newStyle.paddingRight = '110px';
        if (origin === 'table' && style && style.minHeight) {
            // 表格中样式
            newStyle.minHeight = Number(style.minHeight) + 20;
            newStyle.paddingRight = '11px';
            newStyle.paddingBottom = '18px';
            wordNumStyle.bottom = '4px';
            wordNumStyle.top = 'auto';
        }
    }
    return (
        <Consumer>
            {({ locale }) => {
                return (
                    <div className={styles.container}>
                        <Input
                            className={styles.input}
                            style={newStyle}
                            {...selfProps}
                            value={curValue}
                            onBlur={(e: any) => {
                                onBlur(e.target.value);
                            }}
                            onChange={(e: any) => {
                                changeValue(e.target.value);
                            }}
                        />
                        {!!maxLength && (
                            <span className={styles.wordNumber} style={wordNumStyle}>
                                {`${locale.alreadyInput} ${(curValue || '').length}/${maxLength}`}
                            </span>
                        )}
                    </div>
                );
            }}
        </Consumer>
    );
};
