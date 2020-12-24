import React, { Component } from 'react';
import classNames from 'classnames';
import memoizeOne from 'memoize-one';
import { Empty, Spin } from 'antd';
import { ScrollSync, Grid, AutoSizer } from 'react-virtualized';
import _ from 'lodash';
import scrollbarSize from 'dom-helpers/scrollbarSize';
import styles from './Table.less';
import { TableProps, TableState, ColumnProps, RowProps } from './interface';
import Column from './Column';
import Cell from './Cell';
import LeftDragFixed from './DragFixed';
import RightDragFixed from './RightDragFixed';
import DragSorted from './DragSorted';
import DragResized from './DragResized';
import { getMergeClassName, getMergeStyle } from '../utils/utils';
import {
    getLeftColumns,
    getRightColumns,
    getShowColumns,
    getLeftWidth,
    getTotalWidth,
    getFormatColumns,
    getTotalHeight,
    getRowHeight,
} from '../utils/memCols';
import { getDefaultTableConfig } from './defaultConfig';
import { Consumer } from './context';

const borderStyle = '1px solid #ececec';

export default class AirTable extends Component<TableProps, TableState> {
    config: any;

    grid1: any;

    grid2: any;

    grid3: any;

    grid4: any;

    grid5: any;

    grid6: any;

    memoizeFormatColumns: Function;

    memoizeData: Function;

    memoizeLeftColumns: Function;

    memoizeRightColumns: Function;

    memoizeColumns: Function;

    memoizeLeftWidth: Function;

    memoizeTotalWidth: Function;

    memoizeTotalHeight: Function;

    static getDerivedStateFromProps(nextProps: TableProps, prevState: TableState) {
        const { columns, dataSource } = prevState;
        const nextState: TableState = {
            ...prevState,
        };
        if (JSON.stringify(dataSource) !== JSON.stringify(nextProps.dataSource)) {
            nextState.dataSource = nextProps.dataSource;
        }
        if (JSON.stringify(columns) !== JSON.stringify(nextProps.columns)) {
            nextState.columns = nextProps.columns;
        }
        return nextState;
    }

    constructor(props: TableProps) {
        super(props);
        const { columns, dataSource, width, height } = props;
        this.state = {
            columns,
            dataSource,
            tableWidth: width || 0,
            tableHeight: height || 0,
        };
        this.config = getDefaultTableConfig(props);
        this.memoizeFormatColumns = memoizeOne(getFormatColumns);
        this.memoizeLeftColumns = memoizeOne(getLeftColumns);
        this.memoizeRightColumns = memoizeOne(getRightColumns);
        this.memoizeColumns = memoizeOne(getShowColumns);
        this.memoizeLeftWidth = memoizeOne(getLeftWidth);
        this.memoizeTotalWidth = memoizeOne(getTotalWidth);
        this.memoizeTotalHeight = memoizeOne(getTotalHeight);
        this.memoizeData = memoizeOne(this.filterData);
    }

    componentDidUpdate(prevProps: Readonly<TableProps>): void {
        if (
            JSON.stringify(this.props.dataSource) !== JSON.stringify(prevProps.dataSource)
        ) {
            this.recomputeGridSize();
        }
    }

    // 获取表格显示数据
    filterData = (columns: ColumnProps[], dataSource: RowProps[]) => {
        if (columns.length === 0 || dataSource.length === 0) {
            return [];
        }
        const cloneData = _.cloneDeep(dataSource);
        cloneData.map((item: any) => {
            item.rowData = item.rowData.filter((item2: any) => {
                return columns.some((temp: any) => {
                    return temp.columnName === item2.colName;
                });
            });
            return item;
        });
        return cloneData;
    };

    // 获取每列的宽度
    getColumnWidth = (
        { columns, showColumns }: { columns: ColumnProps[]; showColumns: ColumnProps[] },
        { index }: { index: number },
    ) => {
        const { tableWidth = 0 } = this.state;
        const { columnWidth } = this.config;
        const { totalWidth, configWidth, defaultWidthLen } = this.memoizeTotalWidth(columns, columnWidth);
        let colWidth = columnWidth;
        if (totalWidth < tableWidth) {
            colWidth = _.floor((tableWidth - configWidth) / defaultWidthLen);
        }
        const columnObj = showColumns[index];
        if (columnObj && columnObj.width) {
            return columnObj.width;
        }
        return colWidth;
    };

    // 重新计算单元格大小
    recomputeGridSize = () => {
        if (this.grid1 && this.grid2) {
            this.grid1.recomputeGridSize();
            this.grid2.recomputeGridSize();
        }
        if (this.grid3 && this.grid4) {
            this.grid3.recomputeGridSize();
            this.grid4.recomputeGridSize();
        }
        if (this.grid5 && this.grid6) {
            this.grid5.recomputeGridSize();
            this.grid6.recomputeGridSize();
        }
    };
    // 页面大小变化回调
    onResize = ({ width, height }: { width: number; height: number }) => {
        this.setState(
            {
                tableWidth: this.props.width || width,
                tableHeight: this.props.height || height,
            },
            this.recomputeGridSize,
        );
    };

    // 下拉加载
    onScroll = ({ clientHeight, scrollHeight, scrollTop }: any) => {
        const height = clientHeight + scrollTop || 0;
        const { onScroll, distanceToLoad = 0 } = this.props;
        if (scrollTop > 0 && height >= scrollHeight - distanceToLoad && typeof onScroll === 'function') {
            onScroll();
        }
    };

    // 列伸缩结束
    onDragResizedCb = (columns: ColumnProps[]) => {
        this.setState(
            {
                columns,
            },
            this.recomputeGridSize,
        );
    };
    // 拖拽自定义固定列前置动作
    onResizeStartLeftDragFixed = () => {
        // 拖动开始，将表格滚动回最左端
        if (this.grid4) {
            this.grid4.scrollToPosition({ scrollLeft: 0 });
        }
    };
    // 拖拽自定义固定列后置动作
    onResizeStopLeftDragFixed = (columns: ColumnProps[]) => {
        this.setState(
            {
                columns,
            },
            this.recomputeGridSize,
        );
    };
    // 拖拽自定义固定列前置动作
    onResizeStartRightDragFixed = () => {
        // 拖动开始，将表格滚动回最右端
        const { columns } = this.state;
        const showColumns = this.memoizeColumns(columns);
        if (this.grid4) {
            this.grid4.scrollToCell({ columnIndex: showColumns.length - 1 });
        }
    };
    // 拖拽自定义固定列后置动作
    onResizeStopRightDragFixed = (columns: ColumnProps[]) => {
        this.setState(
            {
                columns,
            },
            this.recomputeGridSize,
        );
    };
    // 拖拽滚动表格
    onDragSortedMove = (direction: string, step: number) => {
        // 拖动超过视图范围，将表格左右滚动
        if (this.grid4) {
            if (direction === 'right') {
                if (this.grid4.state.scrollLeft >= this.grid4.getTotalColumnsWidth() - this.state.tableWidth - 100) {
                    return;
                }
                this.grid4.scrollToPosition({ scrollLeft: this.grid4.state.scrollLeft + step });
            } else {
                if (this.grid4.state.scrollLeft <= 0) {
                    return;
                }
                this.grid4.scrollToPosition({ scrollLeft: this.grid4.state.scrollLeft - step });
            }
        }
    };
    // 拖拽排序回调
    onDragSortedCb = (columns: ColumnProps[]) => {
        this.setState(
            {
                columns,
            },
            this.recomputeGridSize,
        );
    };
    // 渲染表头
    renderHeaderCell = (
        { showColumns, position }: { showColumns: ColumnProps[]; position?: string },
        { columnIndex, key, style }: any,
    ) => {
        if (showColumns.length === 0) return null;
        const {
            sortConfig,
            showIndex,
            rowSelection,
            dataSource,
            canResized = true,
            onDragResized,
            canSorted,
            onDragSorted,
            tableId,
            cachedFeAttr,
            leftMargin,
        } = this.props;
        const { columns } = this.state;
        const formatColumns = this.memoizeFormatColumns(columns, cachedFeAttr, tableId);
        const {
            columnType = 1,
            columnName,
            columnChsName = '',
            columnAttrObj = {},
            sortFlag,
            questionText,
            icon,
            requiredFlag,
            orderNo,
        } = showColumns[columnIndex];
        return (
            <DragResized
                key={key}
                columnName={columnName}
                style={style}
                tableId={tableId}
                canResized={canResized}
                onDragResized={onDragResized}
                cachedFeAttr={cachedFeAttr}
                onDragResizedCb={this.onDragResizedCb}
                columns={formatColumns}
                position={position}
            >
                <DragSorted
                    columnName={columnName}
                    columnChsName={columnChsName}
                    orderNo={orderNo}
                    canSorted={canSorted}
                    onDragSorted={onDragSorted}
                    onDragSortedMove={this.onDragSortedMove}
                    onDragSortedCb={this.onDragSortedCb}
                    cachedFeAttr={cachedFeAttr}
                    tableId={tableId}
                    columns={formatColumns}
                    position={position}
                >
                    <Column
                        columnType={String(columnType)}
                        columnName={columnName}
                        columnChsName={columnChsName}
                        columnAttrObj={columnAttrObj}
                        sortFlag={sortFlag}
                        sortConfig={sortConfig}
                        columnIndex={columnIndex}
                        showIndex={position === 'right' ? false : showIndex}
                        questionText={questionText}
                        rowSelection={position === 'right' ? false : rowSelection}
                        dataSource={dataSource}
                        icon={icon}
                        required={requiredFlag}
                        leftMargin={leftMargin}
                    />
                </DragSorted>
            </DragResized>
        );
    };

    // 渲染数据
    renderBodyCell = (
        {
            showColumns,
            showData,
            position = 'center',
        }: { showColumns: ColumnProps[]; showData: RowProps; position?: string },
        { columnIndex, key, rowIndex, style }: any,
    ) => {
        const { columns, dataSource, tableHeight = 0 } = this.state;
        const { headerHeight, rowHeight } = this.config;
        const {
            emitChangeCell,
            paginationConfig,
            showIndex,
            showExpand,
            emptyPlaceholder,
            cellEditable,
            rowSelection,
            contentMenu,
            rowClassName,
            rowStyle,
            onEmitMsg,
            tableId,
            renderFirstLeft,
            bordered = false,
        } = this.props;
        if (showColumns.length === 0 || showData.length === 0) {
            return;
        }
        const record: any = dataSource[rowIndex]; // 行数据
        const rowData: any = showData[rowIndex]; // 行数据
        const columnConfig: any = showColumns[columnIndex]; // 列属性
        // const columnData: any = rowData.rowData[columnIndex]; // 列数据
        const columnData: any = rowData.rowData.find((temp) => {
            return temp.colName === columnConfig.columnName;
        }); // 列数据

        const cellData: any = columnData && columnData.cellValueList; // 列数据

        const { cellClassName, cellStyle } = columnConfig;

        const rowClassNameStr = getMergeClassName(styles.bodyRow, rowClassName, { rowIndex });
        const rowStyleObj = getMergeStyle({}, rowStyle, { rowIndex });

        // 默认边框覆盖掉传过来的样式
        const cellBorderStyle: any = {
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none',
            borderBottom: borderStyle,
        };
        if (bordered) {
            cellBorderStyle.borderRight = borderStyle;
            if (columnIndex === 0) {
                cellBorderStyle.borderLeft = borderStyle;
            }
        }
        const cellClassNameStr = getMergeClassName(styles.bodyCell, cellClassName, {
            columnIndex,
            columnConfig,
            columnData,
            cellData,
            record,
        });
        const cellStyleObj = getMergeStyle({ ...style, ...cellBorderStyle }, cellStyle, {
            columnIndex,
            columnConfig,
            columnData,
            cellData,
        });

        let maxPopHeight = (tableHeight - headerHeight - rowHeight - 10) / 2;
        if (maxPopHeight > 250) {
            maxPopHeight = 250;
        }

        return (
            <Cell
                key={key}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                columnConfig={columnConfig}
                value={cellData}
                columnData={columnData}
                record={record}
                emitChangeCell={emitChangeCell}
                cellClassName={classNames(rowClassNameStr, cellClassNameStr)}
                cellStyle={{ ...rowStyleObj, ...cellStyleObj }}
                columns={columns}
                paginationConfig={paginationConfig}
                showIndex={position === 'right' ? false : showIndex}
                showExpand={position === 'right' ? false : showExpand}
                emptyPlaceholder={emptyPlaceholder}
                cellEditable={cellEditable}
                rowSelection={position === 'right' ? false : rowSelection}
                contentMenu={contentMenu}
                cellKey={key}
                position={position}
                onEmitMsg={onEmitMsg}
                tableId={tableId}
                maxPopHeight={maxPopHeight}
                renderFirstLeft={renderFirstLeft}
            />
        );
    };

    render() {
        const { loading, noDataPlaceholder, loadComp, canFixed, tableId, cachedFeAttr, onDragFixed } = this.props;
        const { columns, dataSource, tableWidth = 0, tableHeight = 0 } = this.state;
        const { overscanColumnCount, overscanRowCount, rowHeight, headerHeight, columnWidth } = this.config;
        const scrollbarWidth = scrollbarSize() || 0;
        const formatColumns = this.memoizeFormatColumns(columns, cachedFeAttr, tableId);
        const showColumns = this.memoizeColumns(formatColumns);
        const leftColumns = this.memoizeLeftColumns(showColumns);
        const rightColumns = this.memoizeRightColumns(showColumns);
        // 有隐藏列时，修正数据与列头不匹配问题
        const showData = this.memoizeData(showColumns, dataSource);
        const leftData = this.memoizeData(leftColumns, dataSource);
        const rightData = this.memoizeData(rightColumns, dataSource);
        // 左侧固定列数量
        const leftCount = leftColumns.length;
        const rightCount = rightColumns.length;
        const columnCount = showColumns.length;
        const rowCount = showData.length;
        const leftWidth = this.memoizeLeftWidth(leftColumns, showColumns, columnWidth, tableWidth);
        const rightWidth = this.memoizeLeftWidth(rightColumns, showColumns, columnWidth, tableWidth);
        const tableBodyHeight: number = tableHeight - headerHeight;
        const { totalWidth } = this.memoizeTotalWidth(showColumns, columnWidth);
        const totalHeight = this.memoizeTotalHeight(dataSource, rowHeight);
        let realWidth = tableWidth;
        let paddingRight = 0;
        if (rowCount > 0 && totalHeight > tableBodyHeight) {
            realWidth = tableWidth + scrollbarWidth;
            paddingRight = scrollbarWidth;
        }
        return (
            <Consumer>
                {({ locale }) => (
                    <ScrollSync>
                        {({ onScroll, scrollLeft, scrollTop }: any) => {
                            return (
                                <div
                                    className={styles.tableContainer}
                                    style={{
                                        paddingRight,
                                    }}
                                    id={`apolloTable_${tableId}`}
                                >
                                    {totalWidth > tableWidth && leftCount > 0 && (
                                        <div
                                            className={styles.leftSideContainer}
                                            style={{
                                                width: `${leftWidth}px`,
                                                height: `${tableBodyHeight - scrollbarWidth + headerHeight}px`,
                                            }}
                                        >
                                            {
                                                // 左侧表头
                                                <div
                                                    className={styles.leftSideHeaderContainer}
                                                    style={{
                                                        left: 0,
                                                    }}
                                                >
                                                    <Grid
                                                        ref={(dom: any) => {
                                                            this.grid1 = dom;
                                                        }}
                                                        className={styles.headerGrid}
                                                        columnWidth={this.getColumnWidth.bind(this, {
                                                            columns: showColumns,
                                                            showColumns: leftColumns,
                                                        })}
                                                        columnCount={leftCount}
                                                        width={leftWidth}
                                                        rowHeight={headerHeight}
                                                        rowCount={1}
                                                        height={headerHeight}
                                                        cellRenderer={this.renderHeaderCell.bind(this, {
                                                            showColumns: leftColumns,
                                                            position: 'left',
                                                        })}
                                                    />
                                                </div>
                                            }
                                            {
                                                // 左侧固定列
                                                <div
                                                    className={styles.leftSideGridContainer}
                                                    style={{
                                                        left: 0,
                                                        top: headerHeight,
                                                    }}
                                                >
                                                    <Grid
                                                        ref={(dom: any) => {
                                                            this.grid2 = dom;
                                                        }}
                                                        className={styles.sideGrid}
                                                        overscanRowCount={overscanRowCount}
                                                        cellRenderer={this.renderBodyCell.bind(this, {
                                                            showColumns: leftColumns,
                                                            showData: leftData,
                                                            position: 'left',
                                                        })}
                                                        columnWidth={this.getColumnWidth.bind(this, {
                                                            columns: showColumns,
                                                            showColumns: leftColumns,
                                                        })}
                                                        onScroll={(...arg: Array<Object>) => {
                                                            onScroll({ scrollTop: arg[0].scrollTop });
                                                            this.onScroll(arg[0]);
                                                        }}
                                                        columnCount={leftCount}
                                                        width={leftWidth + scrollbarWidth}
                                                        rowHeight={getRowHeight.bind(this, {
                                                            dataSource,
                                                            rowHeight,
                                                        })}
                                                        rowCount={rowCount}
                                                        height={tableBodyHeight - scrollbarWidth}
                                                        scrollTop={scrollTop}
                                                    />
                                                </div>
                                            }
                                        </div>
                                    )}
                                    {canFixed && (
                                        <LeftDragFixed
                                            tableId={tableId}
                                            initLeft={leftWidth}
                                            initTop={headerHeight}
                                            tableWidth={tableWidth}
                                            showColumns={showColumns}
                                            columnWidth={columnWidth}
                                            columns={formatColumns}
                                            onResizeStart={this.onResizeStartLeftDragFixed}
                                            onResizeStop={this.onResizeStopLeftDragFixed}
                                            onDragFixed={onDragFixed}
                                            cachedFeAttr={cachedFeAttr}
                                        />
                                    )}
                                    <div className={styles.centerContainer}>
                                        <AutoSizer onResize={this.onResize}>
                                            {({ width, height }: any) => {
                                                return (
                                                    <div>
                                                        {
                                                            // 中部表头
                                                            <div
                                                                style={{
                                                                    backgroundColor: 'rgba(246, 246, 246, 1)',
                                                                    height: headerHeight,
                                                                    width,
                                                                }}
                                                            >
                                                                <Grid
                                                                    ref={(dom: any) => {
                                                                        this.grid3 = dom;
                                                                    }}
                                                                    className={styles.headerGrid}
                                                                    overscanColumnCount={overscanColumnCount}
                                                                    columnWidth={this.getColumnWidth.bind(this, {
                                                                        columns: showColumns,
                                                                        showColumns,
                                                                    })}
                                                                    columnCount={columnCount}
                                                                    width={width}
                                                                    rowHeight={headerHeight}
                                                                    rowCount={1}
                                                                    height={headerHeight}
                                                                    scrollLeft={scrollLeft}
                                                                    cellRenderer={this.renderHeaderCell.bind(this, {
                                                                        showColumns,
                                                                        position: 'center',
                                                                    })}
                                                                />
                                                            </div>
                                                        }
                                                        {
                                                            // 中部内容
                                                            <div
                                                                style={{
                                                                    height: tableBodyHeight,
                                                                    width: tableWidth,
                                                                }}
                                                            >
                                                                {rowCount > 0 ? (
                                                                    <Grid
                                                                        ref={(dom: any) => {
                                                                            this.grid4 = dom;
                                                                        }}
                                                                        className={styles.centerGrid}
                                                                        overscanColumnCount={overscanColumnCount}
                                                                        overscanRowCount={overscanRowCount}
                                                                        columnWidth={this.getColumnWidth.bind(this, {
                                                                            columns: showColumns,
                                                                            showColumns,
                                                                        })}
                                                                        columnCount={columnCount}
                                                                        width={realWidth}
                                                                        rowHeight={getRowHeight.bind(this, {
                                                                            dataSource,
                                                                            rowHeight,
                                                                        })}
                                                                        rowCount={rowCount}
                                                                        onScroll={(...arg: Array<Object>) => {
                                                                            onScroll(...arg);
                                                                            this.onScroll(arg[0]);
                                                                        }}
                                                                        scrollTop={scrollTop}
                                                                        height={tableBodyHeight}
                                                                        cellRenderer={this.renderBodyCell.bind(this, {
                                                                            showColumns,
                                                                            showData,
                                                                            position: 'center',
                                                                        })}
                                                                    />
                                                                ) : (
                                                                    columnCount > 0 &&
                                                                    !loading && (
                                                                        <Empty
                                                                            className={styles.defaultEmpty}
                                                                            description={
                                                                                noDataPlaceholder || locale.empty
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </AutoSizer>
                                    </div>
                                    {false && (
                                        <RightDragFixed
                                            tableId={tableId}
                                            initLeft={tableWidth - rightWidth}
                                            initTop={headerHeight}
                                            tableWidth={tableWidth}
                                            showColumns={showColumns}
                                            columnWidth={columnWidth}
                                            columns={formatColumns}
                                            paddingRight={paddingRight}
                                            onResizeStart={this.onResizeStartRightDragFixed}
                                            onResizeStop={this.onResizeStopRightDragFixed}
                                            onDragFixed={onDragFixed}
                                            cachedFeAttr={cachedFeAttr}
                                        />
                                    )}
                                    {totalWidth > tableWidth && rightCount > 0 && (
                                        <div
                                            className={styles.rightSideContainer}
                                            style={{
                                                width: `${rightWidth}px`,
                                                height: `${tableBodyHeight - scrollbarWidth + headerHeight}px`,
                                                right: paddingRight,
                                            }}
                                        >
                                            {
                                                // 右侧表头
                                                <div
                                                    className={styles.rightSideHeaderContainer}
                                                    style={{
                                                        right: 0,
                                                    }}
                                                >
                                                    <Grid
                                                        ref={(dom: any) => {
                                                            this.grid5 = dom;
                                                        }}
                                                        className={styles.headerGrid}
                                                        columnWidth={this.getColumnWidth.bind(this, {
                                                            columns: showColumns,
                                                            showColumns: rightColumns,
                                                        })}
                                                        columnCount={rightCount}
                                                        width={rightWidth}
                                                        rowHeight={headerHeight}
                                                        rowCount={1}
                                                        height={headerHeight}
                                                        cellRenderer={this.renderHeaderCell.bind(this, {
                                                            showColumns: rightColumns,
                                                            position: 'right',
                                                        })}
                                                    />
                                                </div>
                                            }
                                            {
                                                // 右侧固定列
                                                <div
                                                    className={styles.rightSideGridContainer}
                                                    style={{
                                                        position: 'absolute',
                                                        right: 0,
                                                        top: headerHeight,
                                                        marginRight: -scrollbarWidth,
                                                    }}
                                                >
                                                    <Grid
                                                        ref={(dom: any) => {
                                                            this.grid6 = dom;
                                                        }}
                                                        className={styles.sideGrid}
                                                        overscanRowCount={overscanRowCount}
                                                        cellRenderer={this.renderBodyCell.bind(this, {
                                                            showColumns: rightColumns,
                                                            showData: rightData,
                                                            position: 'right',
                                                        })}
                                                        columnWidth={this.getColumnWidth.bind(this, {
                                                            columns: showColumns,
                                                            showColumns: rightColumns,
                                                        })}
                                                        onScroll={(...arg: Array<Object>) => {
                                                            onScroll({ scrollTop: arg[0].scrollTop });
                                                            this.onScroll(arg[0]);
                                                        }}
                                                        columnCount={rightCount}
                                                        width={rightWidth + scrollbarWidth}
                                                        rowHeight={getRowHeight.bind(this, {
                                                            dataSource,
                                                            rowHeight,
                                                        })}
                                                        rowCount={rowCount}
                                                        height={tableBodyHeight - scrollbarWidth}
                                                        scrollTop={scrollTop}
                                                    />
                                                </div>
                                            }
                                        </div>
                                    )}
                                    <div className={styles.fillHandleWrapper} />
                                    <div className={styles.loading} style={{ top: `${tableBodyHeight / 2}px` }}>
                                        {loading && (loadComp ? loadComp : <Spin />)}
                                    </div>
                                    <div className={styles.widthHandleWrapper} id={`dividerWrap_${tableId}`}>
                                        <div className={styles.widthHandle} id={`divider_${tableId}`} />
                                    </div>
                                    <div id="columnCopyDiv" className={styles.columnCopyDiv} />
                                </div>
                            );
                        }}
                    </ScrollSync>
                )}
            </Consumer>
        );
    }
}
