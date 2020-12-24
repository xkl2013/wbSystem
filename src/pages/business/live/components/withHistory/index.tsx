import React from 'react';
import { config } from '@/submodule/components/apolloTable';
import IconFont from '@/components/CustomIcon/IconFont';
import styles from './index.less';

const WithHistory = (props: any) => {
    const { columnConfig, rowData, cellRenderProps, value } = props;
    const { showHistory, addHistoryAuth } = cellRenderProps || {};
    const Comp = config[columnConfig.columnType].detailComp;
    const cellData = value;
    const empty =
        !cellData || cellData.length === 0 || (cellData.length === 1 && !cellData[0].text && !cellData[0].value);

    return (
        <div className={styles.container}>
            {empty ? <div className={styles.cell}>-</div> : <Comp {...props} />}
            <div
                className={styles.historyCount}
                role="presentation"
                onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopPropagation();
                    showHistory({
                        rowId: rowData.id,
                        rowData: rowData.rowData,
                        initType: 'detail',
                    });
                }}
            >
                {rowData.groupHistoryCount && rowData.groupHistoryCount > 0 && (
                    <span className={styles.countNo}>
                        {`(${rowData.groupHistoryCount > 99 ? '99+' : rowData.groupHistoryCount})`}
                    </span>
                )}
            </div>
            {addHistoryAuth && (
                <div
                    className={styles.addCls}
                    role="presentation"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopPropagation();
                        showHistory({
                            rowId: rowData.id,
                            rowData: rowData.rowData,
                            initType: 'add',
                        });
                    }}
                >
                    <IconFont className={styles.addIcon} type="iconxinzeng" />
                </div>
            )}
        </div>
    );
};
export default WithHistory;
