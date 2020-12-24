import React from 'react';
import { Pagination } from 'antd';
import classNames from 'classnames';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import styles from './index.less';
import { CommonProps, CommonState } from './interface';
import Table from './Table';
import OperateConfig from './operate';
import TableOperateConfig from './tableOperate';
import { defaultLocale } from '../locale';
import { Provider } from './context';

/**
 * 获取每个单元格的值用'_'相连
 * @param cell
 */
const getCellKey = (cell: any) => {
    const arr1: any = [];
    const arr2: any = [];
    if (Array.isArray(cell.cellValueList) && cell.cellValueList.length > 0) {
        cell.cellValueList.map((data: any) => {
            arr1.push(data.value);
            arr2.push(data.text);
        });
    } else {
        return {
            key: '(Empty)',
            text: '(空)',
        };
    }
    return {
        key: arr1.join('_'),
        text: arr2.join('_'),
    };
};
/**
 *
 * @param {*} config
 * @param {*} dataSource
 * @params {*renderGroupText} 自定义渲染分组名称
 */
// 分组数据添加class
const formatData = (config: string[], dataSource: any[]) => {
    if (!config || !config.length) {
        return dataSource;
    }
    const map: any = {};
    // 一级分组条件
    const group1 = config[0];
    // 二级分组条件
    const group2 = config[1];
    // 三级分组条件
    const group3 = config[2];
    // 遍历数据默认已排序，根据分组级别给每行添加分组class
    return dataSource.map((row: any) => {
        const groupKeyArr: string[] = [];
        const groupTextArr: string[] = [];
        row.rowData.map((cell: any) => {
            if (group1 && cell.colName === group1.colName) {
                const group1Cell = getCellKey(cell);
                groupKeyArr[0] = group1Cell.key;
                groupTextArr[0] = group1Cell.text;
            }
            if (group2 && cell.colName === group2.colName) {
                const group2Cell = getCellKey(cell);
                groupKeyArr[1] = group2Cell.key;
                groupTextArr[1] = group2Cell.text;
            }
            if (group3 && cell.colName === group3.colName) {
                const group3Cell = getCellKey(cell);
                groupKeyArr[2] = group3Cell.key;
                groupTextArr[2] = group3Cell.text;
            }
        });
        // 先清空之前的
        delete row.classList;
        if (groupKeyArr[0]) {
            const group1Key = groupKeyArr[0];
            const group1Text = groupTextArr[0];
            if (!map[group1Key]) {
                map[group1Key] = group1Text;
                if (row.classList) {
                    row.classList[0] = 'groupLevel1';
                } else {
                    row.classList = ['groupLevel1'];
                }
            }
        }
        if (groupKeyArr[1]) {
            const group2Key = `${groupKeyArr[0]}-${groupKeyArr[1]}`;
            const group2Text = `${groupTextArr[0]}-${groupTextArr[1]}`;
            if (!map[group2Key]) {
                map[group2Key] = group2Text;
                if (row.classList) {
                    row.classList[1] = 'groupLevel2';
                } else {
                    row.classList = ['', 'groupLevel2', ''];
                }
            }
        }
        if (groupKeyArr[2]) {
            const group3Key = groupKeyArr.join('-');
            const group3Text = groupTextArr.join('-');
            if (!map[group3Key]) {
                map[group3Key] = group3Text;
                if (row.classList) {
                    row.classList[2] = 'groupLevel3';
                } else {
                    row.classList = ['', '', 'groupLevel3'];
                }
            }
        }
        row.groupLevel = groupKeyArr.length;
        row.groupKeyArr = groupKeyArr;
        row.groupTextArr = groupTextArr;
        row.groupConfig = config;
        return row;
    });
};
const memoizeData = memoizeOne(formatData);
class AirTable extends React.Component<CommonProps, CommonState> {
    static getDerivedStateFromProps(nextProps: CommonProps, prevState: CommonState) {
        const { columns, dataSource, groupConfig } = prevState;

        const nextState: CommonState = {
            ...prevState,
        };
        if (JSON.stringify(dataSource) !== JSON.stringify(nextProps.dataSource)) {
            nextState.dataSource = nextProps.dataSource;
        }
        if (JSON.stringify(columns) !== JSON.stringify(nextProps.columns)) {
            nextState.columns = nextProps.columns;
        }
        const operateConfig = nextProps.operateConfig;
        const nextGroupConfig: any =
            operateConfig &&
            operateConfig.menusGroup &&
            operateConfig.menusGroup.find((item: any) => {
                return item.type === 'group';
            });
        if (nextGroupConfig && JSON.stringify(groupConfig) !== JSON.stringify(nextGroupConfig.value)) {
            nextState.groupConfig = nextGroupConfig.value;
        }
        return nextState;
    }

    constructor(props: CommonProps) {
        super(props);
        const { columns, dataSource } = props;
        this.state = {
            columns,
            dataSource,
            groupConfig: [],
        };
    }

    onScroll = () => {
        const { onScroll } = this.props;
        if (typeof onScroll === 'function') {
            onScroll();
        }
    };

    getContext = () => {
        const { locale } = this.props;
        if (locale) {
            if (locale.context) {
                if (locale.lang && defaultLocale[locale.lang]) {
                    return { ...defaultLocale[locale.lang], ...locale.context };
                }
                return locale.context;
            }
        }
        return defaultLocale.cn;
    };

    render() {
        const { columns, dataSource, groupConfig } = this.state;
        const {
            className,
            tableClassName,
            rowStyle,
            rowClassName,
            distanceToLoad,
            emitChangeCell,
            bordered,
            width,
            height,
            operateConfig,
            paginationConfig,
            showIndex,
            showExpand,
            emptyPlaceholder,
            cellEditable,
            rowHeight,
            loading,
            rowSelection,
            tableOperateConfig,
            noDataPlaceholder,
            columnWidth,
            headerHeight,
            contentMenu,
            onScroll,
            loadComp,
            canResized,
            onDragResized,
            canFixed,
            onDragFixed,
            canSorted,
            onDragSorted,
            onEmitMsg,
            tableId,
            cachedFeAttr,
            renderFirstLeft,
            leftMargin,
        } = this.props;
        const sortConfig =
            operateConfig &&
            operateConfig.menusGroup &&
            operateConfig.menusGroup.find((item: any) => {
                return item.type === 'sort';
            });
        const memDataSource = memoizeData(groupConfig, dataSource);
        return (
            <Provider value={{ locale: this.getContext() }}>
                <div className={classNames(styles.container, className)}>
                    {operateConfig && <OperateConfig columns={columns} operateConfig={operateConfig} />}
                    <div className={classNames(styles.tableContainer, tableClassName)}>
                        {tableOperateConfig && (
                            <div className={styles.tableOperateContainer}>
                                <TableOperateConfig operateConfig={tableOperateConfig} />
                            </div>
                        )}
                        <div className={styles.tableC}>
                            <Table
                                tableId={tableId}
                                columns={columns}
                                dataSource={memDataSource}
                                rowStyle={rowStyle}
                                rowClassName={rowClassName}
                                onScroll={onScroll ? this.onScroll : undefined}
                                distanceToLoad={distanceToLoad}
                                cellEditable={cellEditable}
                                emitChangeCell={emitChangeCell}
                                bordered={bordered}
                                width={width}
                                height={height}
                                rowHeight={rowHeight}
                                headerHeight={headerHeight}
                                columnWidth={columnWidth}
                                sortConfig={sortConfig}
                                groupConfig={groupConfig}
                                paginationConfig={paginationConfig}
                                showIndex={showIndex}
                                showExpand={showExpand}
                                rowSelection={rowSelection}
                                loading={loading}
                                loadComp={loadComp}
                                noDataPlaceholder={noDataPlaceholder}
                                emptyPlaceholder={emptyPlaceholder}
                                contentMenu={contentMenu}
                                onEmitMsg={onEmitMsg}
                                cachedFeAttr={cachedFeAttr}
                                canResized={canResized}
                                onDragResized={onDragResized}
                                canFixed={canFixed}
                                onDragFixed={onDragFixed}
                                canSorted={canSorted}
                                onDragSorted={onDragSorted}
                                renderFirstLeft={renderFirstLeft}
                                leftMargin={leftMargin}
                            />
                        </div>
                    </div>
                    {paginationConfig && <Pagination {...paginationConfig} />}
                </div>
            </Provider>
        );
    }
}

export default AirTable;
