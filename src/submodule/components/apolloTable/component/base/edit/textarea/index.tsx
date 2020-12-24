import React, { useEffect, useState, useRef } from 'react';
import { Input } from 'antd';
import styles from './styles.less';
import { antiAssign } from '../../../../utils/utils';
import { ApolloTextAreaProps } from '../editInterface';
import { Consumer } from '../../../context';
import { placeCaretAtEnd } from '../../../../utils/autoFocus';

export const ApolloTextArea = (props: ApolloTextAreaProps) => {
    const {
        maxLength,
        onChange,
        value,
        getDetail,
        rowId,
        onEmitChange,
        columnConfig,
        origin,
        tableId,
        maxPopHeight,
    } = props;
    const { columnName } = columnConfig;
    const selfProps = antiAssign(props, [
        'columnConfig',
        'onChange',
        'cutLength',
        'getDetail',
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
        'isMultiple',
    ]);
    selfProps.disabled = !!props.disabled;
    const [curValue, setCurValue] = useState(value);
    const divInput = useRef(null);
    useEffect(() => {
        if (origin !== 'editForm') {
            getMore();
            if (divInput && divInput.current) {
                placeCaretAtEnd(divInput.current);
            }
        }
    }, []);

    const getMore = async () => {
        if (getDetail && rowId) {
            let newValue = await getDetail({ rowId });
            if (newValue) {
                newValue = newValue[0] && newValue[0].value;
                setCurValue(newValue);
            }
        }
    };

    const changeValue = (value: any) => {
        setCurValue(value);
        if (typeof onChange === 'function') {
            onChange(value);
        }
    };
    const onBlur = () => {
        if (typeof onEmitChange === 'function') {
            onEmitChange(curValue);
        }
    };

    // 表单部分
    if (origin === 'editForm') {
        return (
            <Consumer>
                {({ locale }) => {
                    return (
                        <div className={styles.container}>
                            <Input.TextArea
                                className={styles.inputForm}
                                {...selfProps}
                                onBlur={onBlur}
                                onChange={(e: any) => {
                                    changeValue(e.target.value);
                                }}
                            />
                            {!!maxLength && (
                                <span className={styles.wordNumberForm}>
                                    {`${locale.alreadyInput} ${(value || '').length}/${maxLength}`}
                                </span>
                            )}
                        </div>
                    );
                }}
            </Consumer>
        );
    }
    // 表格部分
    const table = document.getElementById(`apolloTable_${tableId}`);
    const cell = document.getElementById(`cellUnit_${tableId}_${rowId}_${columnName}`);
    const tableRect = table && table.getBoundingClientRect();
    const cellRect = cell && cell.getBoundingClientRect();
    const style: any = {};
    if (maxPopHeight) {
        style.maxHeight = maxPopHeight;
    }
    if (tableRect && cellRect && maxPopHeight && maxPopHeight + cellRect.top > tableRect.bottom) {
        style.bottom = 0;
        style.top = 'auto';
    }
    delete selfProps.autoSize;

    let lock = true;
    // 中文输入法问题
    const onCompositionStart = () => {
        lock = false;
    };
    const onCompositionEnd = (e: any) => {
        lock = true;
        changeDivValue(e);
    };
    const changeDivValue = (e: any) => {
        if (lock) {
            let text = e.target.innerText;
            if (text.length > maxLength) {
                text = text.substr(0, maxLength);
                e.target.innerText = text;
                placeCaretAtEnd(divInput.current);
            }
            changeValue(text);
        }
    };
    // 粘贴div(contenteditable = "true")富文本转为纯文本
    const onPaste = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        let text = '';
        const event = e.originalEvent || e;
        if (event.clipboardData && event.clipboardData.getData) {
            text = event.clipboardData.getData('text/plain');
        } else if (window.clipboardData && window.clipboardData.getData) {
            text = window.clipboardData.getData('Text');
        }
        if (document.queryCommandSupported('insertText')) {
            document.execCommand('insertText', false, text);
        } else {
            document.execCommand('paste', false, text);
        }
    };

    return (
        <Consumer>
            {({ locale }) => {
                return (
                    <div className={styles.tableCell} style={style}>
                        <div
                            ref={divInput}
                            contentEditable={!selfProps.disabled}
                            className={styles.divInput}
                            {...selfProps}
                            onBlur={onBlur}
                            onCompositionStart={onCompositionStart}
                            onCompositionEnd={onCompositionEnd}
                            onPaste={onPaste}
                            onInput={changeDivValue}
                            suppressContentEditableWarning
                        >
                            {value}
                        </div>
                        {!!maxLength && (
                            <span className={styles.numTip}>
                                {`${locale.alreadyInput} ${(curValue || '').length}/${maxLength}`}
                            </span>
                        )}
                    </div>
                );
            }}
        </Consumer>
    );
};
