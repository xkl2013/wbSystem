import React, { Component } from 'react';
import { Checkbox } from 'antd';
import memoizeOne from 'memoize-one';
import scrollbarSize from 'dom-helpers/scrollbarSize';
import { ScrollSync, Grid, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import _ from 'lodash';
import RenderEmpty from '@/components/RenderEmpty';
import extendIcon from '@/assets/airTable/extend.png';
import IconFont from '@/components/CustomIcon/IconFont';
import styles from './index.less';
import ColumnCell from './component/column';
import Cell from './component/cell';

/**
 * 表格框架（antd-table ==》airtable）
 * 1）操作栏  header
 * 2）表头  columns
 * 3）表格-》行-》单元格
 * 4）新增行  footer
 * 5）滚动加载  onscroll监听
 */

export default class AirTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [], // 数据源
            columns: [], // 显示表头
            checked: [],
            height: document.body.clientHeight - 177 - scrollbarSize(),
            tableWidth: document.body.clientWidth - 282 - scrollbarSize(),
            overscanColumnCount: 5,
            overscanRowCount: 5,
            columnWidth: 200,
            rowHeight: 40,
            columnCount: 0,
            rowCount: 0,
            leftCount: 0,
        };
        this.leftCount = memoizeOne(this.getLeftCount);
        this.memoizeData = memoizeOne(this.filterData);
        this.indexCount = {};
    }

    componentDidMount() {
        this.initData();
        window.addEventListener('resize', this.resize, false);
    }

    componentWillReceiveProps(nextProps) {
        const { dataSource, columns, checked, columnWidth } = this.props;
        if (JSON.stringify(dataSource) !== JSON.stringify(nextProps.dataSource)) {
            this.setState({
                dataSource: nextProps.dataSource,
                rowCount: nextProps.dataSource.length,
            });
        }
        if (JSON.stringify(columns) !== JSON.stringify(nextProps.columns)) {
            const leftCount = this.leftCount(nextProps.columns);
            this.setState({
                columns: nextProps.columns,
                columnCount: nextProps.columns.length,
                leftCount,
            });
        }
        if (JSON.stringify(checked) !== JSON.stringify(nextProps.checked)) {
            this.setState({
                checked: nextProps.checked,
            });
        }
        if (columnWidth !== nextProps.columnWidth) {
            this.setState({
                columnWidth: nextProps.columnWidth,
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize, false);
    }

    initData = () => {
        const { dataSource, columns, checked, columnWidth } = this.props;
        const leftCount = this.leftCount(columns);
        this.setState({
            dataSource,
            rowCount: dataSource.length,
            columns,
            columnCount: columns.length,
            checked,
            leftCount,
            columnWidth: columnWidth || 200,
        });
    };

    // 获取左侧固定列数量
    getLeftCount = (columns) => {
        let len = 0;
        columns.map((item) => {
            if (item.fixed) {
                len += 1;
            }
        });
        return len;
    };

    // 表头隐藏时过滤数据源
    filterData = (columns, dataSource) => {
        if (columns.length === 0 || dataSource.length === 0) {
            return [];
        }
        const cloneData = _.cloneDeep(dataSource);
        let i = 0;
        this.indexCount = {};
        cloneData.map((item1) => {
            const itemData = item1;
            itemData.rowData = itemData.rowData.filter((item2) => {
                return columns.some((temp) => {
                    return temp.columnName === item2.colName;
                });
            });
            if (itemData.groupId) {
                if (this.indexCount[itemData.groupId]) {
                    this.indexCount[itemData.groupId].push(itemData.id);
                } else {
                    i += 1;
                    this.indexCount[itemData.groupId] = [itemData.id];
                }
                itemData.index = i;
            }
            return itemData;
        });
        return cloneData;
    };

    resize = () => {
        this.setState({
            height: document.body.clientHeight - 177 - scrollbarSize(),
            tableWidth: document.body.clientWidth - 282 - scrollbarSize(),
        });
    };

    // 复选框选择
    changeCheckbox = (record, flag) => {
        const { changeChecked, hasGroup } = this.props;
        const { checked, dataSource } = this.state;
        let temp = checked.slice();
        if (flag) {
            if (hasGroup) {
                const selected = dataSource.filter((item) => {
                    return item.groupId === record.groupId;
                });
                temp = temp.concat(selected);
            } else {
                temp.push(record);
            }
        } else if (hasGroup) {
            temp = temp.filter((item) => {
                return item.groupId !== record.groupId;
            });
        } else {
            const index = temp.findIndex((item) => {
                return item.id === record.id;
            });
            temp.splice(index, 1);
        }
        if (typeof changeChecked === 'function') {
            changeChecked({ checked: temp });
        }
    };

    // 检测当前分组是否全部选中
    getCheckedAll = () => {
        const { checked, dataSource } = this.state;
        const temp = checked.slice();
        const result = temp.filter((v) => {
            return dataSource.some((item) => {
                return item.id === v.id;
            });
        });
        return result.length === dataSource.length && result.length !== 0;
    };

    // 全选/反选
    changeCheckboxAll = () => {
        const { checked, dataSource } = this.state;
        const { changeChecked } = this.props;
        const temp = checked.slice();
        const flag = this.getCheckedAll();
        let result = [];
        if (flag) {
            result = temp.concat(dataSource).filter((v) => {
                return (
                    temp.some((item) => {
                        return item.id === v.id;
                    })
                    && !dataSource.some((item) => {
                        return item.id === v.id;
                    })
                );
            });
        } else {
            result = temp.concat(
                dataSource.filter((v) => {
                    return !temp.some((item) => {
                        return item.id === v.id;
                    });
                }),
            );
        }
        if (typeof changeChecked === 'function') {
            changeChecked({ checked: result });
        }
    };

    // 获取列的宽度
    getColumnWidth = ({ index }) => {
        const { columns, columnCount, tableWidth } = this.state;
        const clumnObj = columns[index];
        if (clumnObj && clumnObj.width) {
            return clumnObj.width;
        }
        let { columnWidth } = this.state;
        if (columnCount > 0 && columnCount * columnWidth < tableWidth) {
            // 表格宽度不足一屏时，按屏幕宽度平分每列宽度
            columnWidth = parseInt(Math.floor(tableWidth / columnCount), 10);
        }
        return columnWidth;
    };

    // 下拉加载
    onScrollRow = ({ clientHeight, scrollTop }) => {
        const height = clientHeight + scrollTop || 0;
        const { dataSource = [], rowHeight = 40 } = this.state;
        const { onScroll } = this.props;
        const offset = 100;
        if (dataSource.length === 0) return;
        if (height + offset >= dataSource.length * rowHeight && typeof onScroll === 'function') {
            onScroll();
        }
    };

    // 渲染表头
    renderHeaderCell = ({ columnIndex, key, style }) => {
        const { columns } = this.state;
        if (columns.length === 0) return null;
        const obj = columns[columnIndex] || {};
        if (columnIndex === 0) {
            return (
                <div key={key} className={styles.leftHeaderCell} style={{ ...style, width: obj.width || style.width }}>
                    <div className={styles.cellNo}>
                        <Checkbox checked={this.getCheckedAll()} onClick={this.changeCheckboxAll} />
                    </div>
                    <div className={styles.cellContent}>
                        <ColumnCell {...obj} />
                    </div>
                </div>
            );
        }
        return (
            <div className={styles.leftHeaderCell} key={key} style={{ ...style, width: obj.width || style.width }}>
                <ColumnCell {...obj} />
            </div>
        );
    };

    // 渲染首列复选框
    renderCheckbox = (record, rowIndex) => {
        const { checked } = this.state;
        const { hasGroup } = this.props;
        const flag = checked.some((item) => {
            return item.id === record.id;
        });
        let checkbox = flag ? (
            <Checkbox checked={true} onClick={this.changeCheckbox.bind(this, record, false)} />
        ) : (
            <>
                <Checkbox
                    className={styles.unchecked}
                    checked={false}
                    onClick={this.changeCheckbox.bind(this, record, true)}
                />
                <div className={styles.no}>{record.index || rowIndex + 1}</div>
            </>
        );
        if (hasGroup) {
            if (
                this.indexCount[record.groupId][Math.floor((this.indexCount[record.groupId].length - 1) / 2)]
                !== record.id
            ) {
                // 填充透明的复选框使样式保持一致
                checkbox = <Checkbox style={{ opacity: 0 }} />;
            }
        }
        return checkbox;
    };

    // 渲染数据
    renderBodyCell = (data, { columnIndex, key, rowIndex, style }) => {
        const { columns, dataSource } = this.state;
        const {
            updateData,
            hasGroup,
            showForm,
            delData,
            getData,
            extraMenu,
            noAdd,
            noEdit,
            noDel,
            noCopy,
            tableId,
            flush,
            showHistory,
            rowIndexList,
            columnConfigCallback,
            cellRender,
        } = this.props;
        if (columns.length === 0 || data.length === 0) {
            return;
        }
        const record = data[rowIndex]; // 过滤掉隐藏项并追加行号的行数据，只在渲染逻辑中使用
        const originRecord = dataSource[rowIndex]; // 原始行数据，真实使用的数据
        const columnObj = columns[columnIndex]; // 列属性
        const columnData = record.rowData[columnIndex]; // 列数据
        columnObj.dynamicCellConfigDTO = columnData.dynamicCellConfigDTO;
        originRecord.rowIndex = rowIndex;
        let className = styles.indexCell;
        // 只读列不可编辑样式
        if (columnObj.readOnlyFlag || record.isLocked || noEdit) {
            className += ` ${styles.disabled}`;
        }
        // 审核中
        const inApproval = Number(record.approvalStatus) === 1 || Number(record.approvalStatus) === 5;
        if (inApproval) {
            className += ` ${styles.approval}`;
        }
        const extraBgStyle = {};
        let extraIndexCellStyle = {};
        let extraCellContentStyle = {};
        if (rowIndexList && rowIndexList.length > 0 && rowIndexList.includes(rowIndex)) {
            extraBgStyle.borderLeft = '1px solid #FF5363';
        }
        if (hasGroup) {
            if (columnObj.splitFlag) {
                // 正常列额外样式
                extraIndexCellStyle = {
                    borderTop:
                        this.indexCount[record.groupId][0] !== record.id ? '1px solid #F7F7F7' : '1px solid #e8e8e8',
                    borderBottom: rowIndex + 1 < data.length ? 0 : '1px solid #e8e8e8',
                };
            } else {
                // 不可拆分列额外样式
                extraIndexCellStyle = {
                    borderTop: this.indexCount[record.groupId][0] !== record.id ? 0 : '1px solid #e8e8e8',
                    borderBottom: rowIndex + 1 < data.length ? 0 : '1px solid #e8e8e8',
                };
                // 不可拆分列数据样式
                extraCellContentStyle = {
                    display:
                        this.indexCount[record.groupId][
                            Math.floor((this.indexCount[record.groupId].length - 1) / 2)
                        ] !== record.id
                            ? 'none'
                            : 'auto',
                };
            }
        }
        if (columnIndex === 0) {
            return (
                <div
                    key={key}
                    className={className}
                    style={{
                        ...style,
                        ...extraIndexCellStyle,
                        ...extraBgStyle,
                    }}
                >
                    <div className={styles.cellNo}>
                        {this.renderCheckbox(record, rowIndex)}
                        <div className={styles.showFormBtnCls}>
                            {record.isLocked && <IconFont className={styles.lockIcon} type="iconliebiaoye-suoding" />}
                            {inApproval && <IconFont className={styles.approvalLockIcon} type="iconshenpizhong" />}
                            <img
                                alt="edit"
                                className={styles.showFormBtn}
                                src={extendIcon}
                                onClick={showForm.bind(this, { rowId: record.id })}
                            />
                        </div>
                    </div>
                    <div className={styles.cellContent} style={extraCellContentStyle}>
                        <Cell
                            overlayClassName={
                                columnData && columnData.cellValueList && columnData.cellValueList.length > 0
                                    ? styles.firstCell
                                    : styles.empty
                            }
                            columns={columns}
                            columnObj={columnObj}
                            columnConfigCallback={columnConfigCallback}
                            record={originRecord}
                            cellValueList={columnData && columnData.cellValueList}
                            updateData={updateData}
                            showForm={showForm}
                            delData={delData}
                            hasGroup={hasGroup}
                            getData={getData}
                            extraMenu={extraMenu}
                            noAdd={noAdd}
                            noEdit={noEdit}
                            noDel={noDel}
                            noCopy={noCopy}
                            tableId={tableId}
                            flush={flush}
                            cellRender={cellRender}
                        />
                        {(tableId === 1 || tableId === 14) && (
                            <div
                                className={styles.historyCount}
                                role="presentation"
                                onClick={showHistory.bind(this, {
                                    rowId: originRecord.id,
                                    rowData: originRecord.rowData,
                                    initType: 'detail',
                                })}
                            >
                                {record.groupHistoryCount && record.groupHistoryCount > 1 && (
                                    <span className={styles.countNo}>
                                        {`(${record.groupHistoryCount > 99 ? '99+' : record.groupHistoryCount})`}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {(tableId === 1 || tableId === 14) && (
                        <div
                            className={styles.addCls}
                            role="presentation"
                            onClick={showHistory.bind(this, {
                                rowId: originRecord.id,
                                rowData: originRecord.rowData,
                                initType: 'add',
                            })}
                        >
                            <IconFont className={styles.addIcon} type="iconxinzeng" />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div
                key={key}
                className={className}
                style={{
                    ...style,
                    ...extraIndexCellStyle,
                }}
            >
                <div className={styles.cellContent} style={extraCellContentStyle}>
                    <Cell
                        columns={columns}
                        columnObj={columnObj}
                        columnConfigCallback={columnConfigCallback}
                        record={originRecord}
                        cellValueList={columnData && columnData.cellValueList}
                        updateData={updateData}
                        showForm={showForm}
                        delData={delData}
                        hasGroup={hasGroup}
                        getData={getData}
                        extraMenu={extraMenu}
                        noAdd={noAdd}
                        noEdit={noEdit}
                        noDel={noDel}
                        noCopy={noCopy}
                        tableId={tableId}
                        flush={flush}
                        cellRender={cellRender}
                    />
                </div>
            </div>
        );
    };

    render() {
        const {
            columnCount,
            tableWidth,
            overscanColumnCount,
            overscanRowCount,
            rowHeight,
            rowCount,
            columns,
            checked,
            dataSource,
            leftCount,
        } = this.state;
        let { height, columnWidth } = this.state;
        const {
            changeChecked,
            operateConfig: { groupConfig },
            hasGroup,
            scrollToRow,
            scrollToAlignment,
        } = this.props;
        if (dataSource.length * rowHeight < height) {
            // 表格行数少于一屏高度时，高度增加横向滚动条高度
            height = dataSource.length * rowHeight + scrollbarSize();
        }
        if (columnCount > 0 && columnCount * columnWidth < tableWidth) {
            // 表格宽度不足一屏时，按屏幕宽度平分每列宽度
            columnWidth = parseInt(Math.floor(tableWidth / columnCount), 10);
        }
        // 有隐藏列时，修正数据与列头不匹配问题
        const data = this.memoizeData(columns, dataSource);

        return (
            <>
                <ScrollSync>
                    {({ onScroll, scrollLeft, scrollTop }) => {
                        return (
                            <div className={styles.GridRow}>
                                <div
                                    className={styles.LeftSideContainer}
                                    style={{
                                        width: `${columnWidth * leftCount}px`,
                                        height: `${height - scrollbarSize() + rowHeight}px`,
                                    }}
                                >
                                    {
                                        // 左侧表头
                                        <div
                                            className={styles.LeftSideGridContainer}
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                backgroundColor: 'rgba(246, 246, 246, 1)',
                                                borderLeft: groupConfig.length > 0 ? 'none' : '1px solid #e8e8e8',
                                            }}
                                        >
                                            <Grid
                                                className={styles.HeaderGrid}
                                                columnData={columns}
                                                columnWidth={this.getColumnWidth}
                                                columnCount={leftCount}
                                                width={columnWidth * leftCount}
                                                rowHeight={rowHeight}
                                                rowCount={1}
                                                height={rowHeight}
                                                checked={checked}
                                                changeChecked={changeChecked}
                                                groupConfig={groupConfig}
                                                dataSource={dataSource}
                                                cellRenderer={this.renderHeaderCell}
                                            />
                                        </div>
                                    }
                                    {
                                        // 左侧固定列
                                        <div
                                            className={styles.LeftSideGridContainer}
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: rowHeight,
                                                borderLeft: groupConfig.length > 0 ? 'none' : '1px solid #e8e8e8',
                                            }}
                                        >
                                            <Grid
                                                className={styles.LeftSideGrid}
                                                overscanRowCount={overscanRowCount}
                                                cellRenderer={this.renderBodyCell.bind(this, data)}
                                                columnWidth={this.getColumnWidth}
                                                columnCount={leftCount}
                                                width={columnWidth * leftCount}
                                                rowHeight={rowHeight}
                                                rowCount={rowCount}
                                                height={height - scrollbarSize()}
                                                scrollTop={scrollTop}
                                                checked={checked}
                                                dataSource={dataSource}
                                                columns={columns}
                                                hasGroup={hasGroup}
                                            />
                                        </div>
                                    }
                                </div>
                                <div className={styles.GridColumn}>
                                    <AutoSizer disableHeight>
                                        {({ width }) => {
                                            // 如果列太少不满一屏时，列头宽度按列计算
                                            // eslint-disable-next-line max-len
                                            let headerWidth = width;
                                            if (dataSource.length * rowHeight > height) {
                                                // 表格行数大于一屏的高度时出现竖向滚动条，此时宽度减出滚动条宽度
                                                headerWidth -= scrollbarSize();
                                            }
                                            return (
                                                <div>
                                                    {
                                                        // 右侧表头
                                                        <div
                                                            style={{
                                                                backgroundColor: 'rgba(246, 246, 246, 1)',
                                                                height: rowHeight,
                                                                width: headerWidth,
                                                            }}
                                                        >
                                                            <Grid
                                                                className={styles.HeaderGrid}
                                                                overscanColumnCount={overscanColumnCount}
                                                                columnData={columns}
                                                                columnWidth={this.getColumnWidth}
                                                                columnCount={columnCount}
                                                                width={headerWidth}
                                                                rowHeight={rowHeight}
                                                                rowCount={1}
                                                                height={rowHeight}
                                                                scrollLeft={scrollLeft}
                                                                cellRenderer={this.renderHeaderCell}
                                                                checked={checked}
                                                            />
                                                        </div>
                                                    }
                                                    {
                                                        // 右侧内容
                                                        <div
                                                            style={{
                                                                height,
                                                                width,
                                                            }}
                                                        >
                                                            <Grid
                                                                className={styles.BodyGrid}
                                                                overscanColumnCount={overscanColumnCount}
                                                                overscanRowCount={overscanRowCount}
                                                                dataSource={dataSource}
                                                                columnWidth={this.getColumnWidth}
                                                                columnCount={columnCount}
                                                                width={width}
                                                                rowHeight={rowHeight}
                                                                rowCount={rowCount}
                                                                height={height}
                                                                onScroll={(...arg) => {
                                                                    onScroll(...arg);
                                                                    this.onScrollRow(...arg);
                                                                }}
                                                                cellRenderer={this.renderBodyCell.bind(this, data)}
                                                                columns={columns}
                                                                hasGroup={hasGroup}
                                                                checked={checked}
                                                                scrollToRow={scrollToRow}
                                                                scrollToAlignment={scrollToAlignment}
                                                            />
                                                        </div>
                                                    }
                                                </div>
                                            );
                                        }}
                                    </AutoSizer>
                                </div>
                            </div>
                        );
                    }}
                </ScrollSync>
                {dataSource.length === 0 && RenderEmpty()}
            </>
        );
    }
}
