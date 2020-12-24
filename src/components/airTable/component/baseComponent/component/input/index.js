import React from 'react';
import Input from '@/ant_components/BIInput';
import styles from './styles.less';

export default function (props) {
    const {
        getPopupContainer,
        ismultiple,
        columnConfig,
        disableOptions,
        rowId,
        rowData,
        tableId,
        changeParams,
        getCalendarContainer,
        cellData,
        style,
        ...others
    } = props;
    return (
        <div className={styles.container}>
            <Input
                className={styles.input}
                style={{ ...style, paddingRight: others.maxLength ? '100px' : '11px' }}
                {...others}
            />
            {others.maxLength ? (
                <span className={styles.wordNumber}>
                    {`已输入${(others.value || '').length || 0}/${others.maxLength}`}
                </span>
            ) : null}
        </div>
    );
}
