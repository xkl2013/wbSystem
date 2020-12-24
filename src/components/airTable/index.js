/* eslint-disable */
import React, { Component } from 'react';
import _ from 'lodash';
import { Collapse } from 'antd';
import memoizeOne from 'memoize-one';

import BIModal from '@/ant_components/BIModal';
import BISpin from '@/ant_components/BISpin';
import {
    getColumnConfig as defaultGetColumnConfig,
    getOperateConfig as defaultGetOperateConfig,
    setOperateConfig as defaultSetOperateConfig,
    setHideConfig as defaultSetHideConfig,
    getDataSource as defaultGetDataSource,
    addOrUpdateDataSource as defaultAddOrUpdateDataSource,
    getDetail as defaultGetDetail,
    delData as defaultDelData,
} from '@/services/airTable';
import { getKeys } from '@/utils/utils';
import { getModuleFromTableId } from '@/config/business';
import groupDown from '@/assets/airTable/groupDown.png';
import groupRight from '@/assets/airTable/groupRight.png';
import ModalDetail from './detail';
import ModalHistory from './history';
import Table from './component/table';
import styles from './index.less';
import OperateConfig from './component/operate';

// 复制table与原table映射，获取原tableId
export const getOriginTableId = (tableId) => {
    if (!tableId) {
        return tableId;
    }
    const module = getModuleFromTableId(tableId);
    if (module && module.originTableId) {
        return module.originTableId;
    }
    return tableId;
};
/**
 *
 * @param {*} config
 * @param {*} dataSource
 * @params {*renderGroupText} 自定义渲染分组名称
 */
// 分组数据格式化 TODO：待优化
const formatData = (config, dataSource) => {
    const groupConfig = _.cloneDeep(config);
    const result1 = [];
    const map1 = {};
    let group = groupConfig.shift();
    // 第一层数据封装，分组数据存dataSource，展示数据存children
    dataSource.map((item) => {
        const group1 = item.rowData.find((temp) => {
            return temp.colName === group.colName;
        });
        const arr1 = [];
        const arr2 = [];
        group1.cellValueList.map((temp) => {
            arr1.push(temp.value);
            arr2.push(temp.text);
        });
        const groupKey = arr1.join('_');
        const groupText = arr2.join('_');
        if (map1[groupKey]) {
            map1[groupKey].dataSource.push(item);
        } else {
            map1[groupKey] = {
                dataSource: [item],
                groupName: group1.colChsName,
                groupKey,
                groupText,
                groupConfig: group1,
            };
            result1.push(map1[groupKey]);
        }
    });
    // 第二层数据封装，分组数据存dataSource，展示数据存children
    if (groupConfig.length > 0) {
        group = groupConfig.shift();
        result1.map((item) => {
            const itemData = item;
            const result2 = [];
            const map2 = {};
            item.dataSource.map((item2) => {
                const group2 = item2.rowData.find((a) => {
                    return a.colName === group.colName;
                });
                const arr1 = [];
                const arr2 = [];
                group2.cellValueList.map((temp) => {
                    arr1.push(temp.value);
                    arr2.push(temp.text);
                });
                const groupKey = arr1.join('_');
                const groupText = arr2.join('_');
                if (map2[groupKey]) {
                    map2[groupKey].dataSource.push(item2);
                } else {
                    map2[groupKey] = {
                        dataSource: [item2],
                        groupName: group2.colChsName,
                        groupKey,
                        groupText,
                        groupConfig: group2,
                    };
                    result2.push(map2[groupKey]);
                }
            });
            itemData.children = result2;
        });
    }
    // 第三层数据封装，分组数据存dataSource，展示数据存children
    if (groupConfig.length > 0) {
        group = groupConfig.shift();
        result1.map((item1) => {
            item1.children.map((item2) => {
                const itemData = item2;
                const result3 = [];
                const map3 = {};
                item2.dataSource.map((item3) => {
                    const group3 = item3.rowData.find((a) => {
                        return a.colName === group.colName;
                    });
                    const arr1 = [];
                    const arr2 = [];
                    group3.cellValueList.map((item) => {
                        arr1.push(item.value);
                        arr2.push(item.text);
                    });
                    const groupKey = arr1.join('_');
                    const groupText = arr2.join('_');
                    if (map3[groupKey]) {
                        map3[groupKey].dataSource.push(item3);
                    } else {
                        map3[groupKey] = {
                            dataSource: [item3],
                            groupName: group3.colChsName,
                            groupKey,
                            groupText,
                            groupConfig: group3,
                        };
                        result3.push(map3[groupKey]);
                    }
                });
                itemData.children = result3;
            });
        });
    }
    return result1;
};
const memoizeData = memoizeOne(formatData);

class AirTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: props.dataSource || [], // 数据源
            operateConfig: props.operateConfig || {
                filterConfig: [],
                groupConfig: [],
                sortConfig: [],
            }, // 操作栏
            columnConfig: props.columnConfig || [], // 全部表头
            showColumnConfig: [], // 显示表头
            filterColumnConfig: [], // 筛选表头
            groupColumnConfig: [], // 分组表头
            sortColumnConfig: [], // 排序表头
            tableId: props.tableId || 1, // 表格唯一标识
            pageConfig: {
                // 分页配置
                pageNum: 1,
                pageSize: 50,
                hasNextPage: false,
                nextPage: 2,
            },
            checked: [], // 选中行数据
            isGettingData: false,
            expand: true,
            editRowId: null,
            searchValue: undefined,
            searchCol: null,
        };
        this.tableContainerRef = React.createRef();
    }

    componentDidMount() {
        if (!this.props.tableId) {
            return null;
        }
        this.init();
    }

    componentWillReceiveProps(nextProps) {
        // 切换table时，重新初始化表格
        const { tableId } = this.props;
        if (nextProps.tableId && nextProps.tableId !== tableId) {
            this.setState(
                {
                    tableId: nextProps.tableId,
                },
                this.init,
            );
        }
    }

    // 初始化，获取配置保存后，获取数据
    init = () => {
        // this.getData(true);
        this.getColumnConfig();
        this.getOperateConfig();
    };

    // 调接口获取表头配置
    getColumnConfig = async () => {
        const { tableId } = this.state;
        const { getColumnConfig, formatColumns } = this.props;
        let func = defaultGetColumnConfig;
        if (typeof getColumnConfig === 'function') {
            func = getColumnConfig;
        }
        const response = await func({ tableId: getOriginTableId(tableId) });
        if (response && response.success && response.data) {
            let columnConfig = response.data;
            let searchCol = null;
            // 构造前端关键数据
            columnConfig.map((item) => {
                const temp = item;
                temp.key = item.columnName;
                temp.dataIndex = item.columnName;
                temp.title = item.columnChsName;
                temp.type = item.columnType;
                temp.entity = item.entityFlag;
                item.columnAttrObj =
                    formatColumns && typeof formatColumns === 'function'
                        ? formatColumns(item.columnAttrObj, item)
                        : item.columnAttrObj;
                if (temp.searchFlag) {
                    searchCol = temp;
                }
                return temp;
            });
            // 排序 TODO
            columnConfig.sort((a, b) => {
                return a.orderNo - b.orderNo;
            });
            // 过滤在表格中隐藏的字段
            columnConfig = columnConfig.filter((ls) => {
                return ls.hideScope !== 'LIST';
            });
            // 显示
            const showColumnConfig = columnConfig.filter((item) => {
                return !!item.showStatus;
            });
            const filterColumnConfig = columnConfig.filter((item) => {
                return !!item.filterFlag;
            });
            const groupColumnConfig = columnConfig.filter((item) => {
                return !!item.groupFlag;
            });
            const sortColumnConfig = columnConfig.filter((item) => {
                return !!item.sortFlag;
            });
            this.setState({
                columnConfig,
                showColumnConfig,
                filterColumnConfig,
                groupColumnConfig,
                sortColumnConfig,
                searchCol,
            });
        }
    };

    // 调接口保存表头配置
    updateColumnConfig = async ({ data }) => {
        const { tableId } = this.state;
        const { setHideConfig } = this.props;
        let func = defaultSetHideConfig;
        if (typeof setHideConfig === 'function') {
            func = setHideConfig;
        }
        const response = await func({ tableId: getOriginTableId(tableId), data });
        if (response && response.success) {
            this.getColumnConfig();
        }
    };

    // 调接口获取操作栏配置
    getOperateConfig = async () => {
        const { tableId } = this.state;
        const { getOperateConfig } = this.props;
        let func = defaultGetOperateConfig;
        if (typeof getOperateConfig === 'function') {
            func = getOperateConfig;
        }
        const response = await func({ tableId: getOriginTableId(tableId) });
        if (response && response.success && response.data) {
            const { filterList, groupList, sortList } = response.data;
            await this.setState({
                operateConfig: {
                    filterConfig: filterList || [],
                    groupConfig: groupList || [],
                    sortConfig: sortList || [],
                },
            });
            this.getData({ isClean: true, isGroup: groupList && groupList.length > 0 });
        }
    };

    // 调接口设置操作栏配置
    setOperateConfig = async ({ config }) => {
        const { tableId } = this.state;
        const { setOperateConfig } = this.props;
        let func = defaultSetOperateConfig;
        if (typeof setOperateConfig === 'function') {
            func = setOperateConfig;
        }
        const response = await func({ tableId: getOriginTableId(tableId), data: config });
        if (response && response.success) {
            this.getOperateConfig();
        }
    };

    // 分页获取数据
    getData = async ({ isClean, isGroup, editRowId }) => {
        const {
            tableId,
            dataSource,
            pageConfig,
            operateConfig: { groupConfig },
            searchValue,
            searchCol,
        } = this.state;
        const rowId = editRowId || this.state.editRowId;
        const { getDataSource } = this.props;
        this.setState({ isGettingData: true });
        const group = isGroup !== undefined ? isGroup : groupConfig.length > 0;
        const extraData = {
            pageNum: isClean ? 1 : pageConfig.nextPage,
            pageSize: group ? 10000 : pageConfig.pageSize,
        };
        if (searchCol) {
            extraData[searchCol.columnName] = searchValue;
        }
        // 已经获取过的数据
        const data = isClean ? [] : dataSource;
        let func = defaultGetDataSource;
        if (typeof getDataSource === 'function') {
            func = getDataSource;
        }
        const response = await func({ tableId, data: extraData });
        if (response && response.success && response.data) {
            const { list, total } = response.data;
            const newPage = {
                ...pageConfig,
                hasNextPage: total > pageConfig.pageNum * pageConfig.pageSize,
                nextPage: pageConfig.pageNum + 1,
            };
            if (rowId) {
                const flag = list.some((item) => {
                    return item.id === rowId;
                });
                if (!flag) {
                    BIModal.warning({
                        title: '基于现有筛选或排序条件该条记录不会在当前页面显示',
                    });
                }
            }
            this.setState({
                dataSource: data.concat(list),
                pageConfig: newPage,
                editRowId: null,
            });
        }
        if (isClean) {
            this.setState({ checked: [] });
        }
        this.setState({ isGettingData: false });
    };

    addOrUpdateDataSource = async ({ rowId, value }) => {
        const { tableId } = this.state;
        const { addOrUpdateDataSource } = this.props;
        let func = defaultAddOrUpdateDataSource;
        if (typeof addOrUpdateDataSource === 'function') {
            func = addOrUpdateDataSource;
        }
        const response = await func({ tableId, data: { id: rowId, value } });
        if (response && response.success && response.data) {
            const editRowId = response.data;
            await this.setState({ editRowId });
            this.getData({ isClean: true });
        }
    };

    // 调接口修改数据
    updateData = ({ rowId, value }) => {
        const result = [];
        if (Array.isArray(value)) {
            value.map((item) => {
                const temp = item;
                if (temp.cellValueList) {
                    // 兼容接口跟数据字段不一致问题
                    temp.columnCode = temp.columnCode || temp.colName;
                    if (temp.cellValueList.length === 0) {
                        temp.cellValueList.push({ text: '', value: '' });
                    }
                    result.push(temp);
                }
            });
        }
        this.addOrUpdateDataSource({ rowId, value: result });
    };

    // 改变操作栏配置
    updateOperateConfig = ({ type, config }) => {
        const { operateConfig } = this.state;
        const temp = _.cloneDeep(operateConfig);
        temp[type] = config;
        const newConfig = {
            filterList: temp.filterConfig,
            groupList: temp.groupConfig,
            sortList: temp.sortConfig,
        };
        this.setOperateConfig({ config: newConfig });
    };

    // 改变操作栏显隐配置
    updateHideConfig = ({ config }) => {
        const data = {
            configType: 1, // 隐藏字段配置标识
            configAttr: JSON.stringify(config),
        };
        this.updateColumnConfig({ data });
    };

    // 滚动加载
    onScroll = () => {
        const { pageConfig, isGettingData } = this.state;
        const { hasNextPage, pageNum } = pageConfig;
        if (!hasNextPage || isGettingData) return;
        this.setState({ pageConfig: { ...pageConfig, pageNum: pageNum + 1 } }, () => {
            this.getData({ isClean: false, isGroup: false });
        });
    };

    // 显示行编辑表单
    showForm = ({ rowId, rowData }) => {
        const { tableId } = this.state;
        if (this.modalDetail && this.modalDetail.showModal) {
            this.modalDetail.showModal({
                tableId,
                rowId,
                rowData,
            });
        }
    };

    // 显示行编辑表单
    showHistory = ({ rowId, rowData, initType }) => {
        const { tableId } = this.state;
        if (this.modalHistory && this.modalHistory.showModal) {
            this.modalHistory.showModal({
                tableId,
                rowId,
                rowData,
                initType,
            });
        }
    };

    changeChecked = ({ checked }) => {
        this.setState({
            checked,
        });
    };

    changeExpand = (expand) => {
        this.setState({
            expand,
        });
    };

    // 操作栏上按钮的刷新回调
    flush = () => {
        this.setState({
            checked: [],
        });
        this.getData({ isClean: true });
    };

    // 搜索栏按下enter搜索
    onPressEnter = (searchValue) => {
        this.setState({ searchValue }, () => {
            this.getData({ isClean: true });
        });
    };

    // 渲染表格
    renderTable = (dataSource) => {
        const { showColumnConfig, operateConfig, checked } = this.state;
        const {
            hasGroup,
            extraMenu,
            noAdd,
            noEdit,
            noDel,
            noCopy,
            tableId,
            delData,
            columnWidth,
            scrollToRow,
            scrollToAlignment,
            rowIndexList,
            columnConfigCallback,
            cellRender,
        } = this.props;
        return (
            <Table
                columns={showColumnConfig}
                dataSource={dataSource}
                updateData={this.updateData}
                showForm={this.showForm}
                sortConfig={operateConfig.sortConfig}
                checked={checked}
                changeChecked={this.changeChecked}
                onScroll={this.onScroll}
                operateConfig={operateConfig}
                hasGroup={hasGroup}
                delData={delData || defaultDelData}
                getData={this.getData}
                flush={this.flush}
                extraMenu={extraMenu}
                noAdd={noAdd}
                noEdit={noEdit}
                noDel={noDel}
                noCopy={noCopy}
                tableId={tableId}
                columnWidth={columnWidth}
                showHistory={this.showHistory}
                scrollToRow={scrollToRow}
                scrollToAlignment={scrollToAlignment}
                rowIndexList={rowIndexList}
                columnConfigCallback={columnConfigCallback}
                cellRender={cellRender}
            />
        );
    };

    // 渲染分组箭头
    renderGroupArrow = ({ isActive }) => {
        return isActive ? (
            <img alt="" style={{ width: '11px' }} src={groupDown} />
        ) : (
            <img alt="" style={{ width: '8px' }} src={groupRight} />
        );
    };

    // 渲染分组名称
    renderGroupText = (item) => {
        const { renderGroupText } = this.props;
        const { columnConfig } = this.state;
        const col = columnConfig.find((temp) => {
            return temp.columnName === item.groupConfig.colName;
        });
        const options = col && col.columnAttrObj && col.columnAttrObj.options;
        const groupText = (text) => {
            if (renderGroupText) return renderGroupText(text, col);
            return text;
        };
        if (options) {
            const option = options.find((temp) => {
                return String(temp.id) === String(item.groupKey);
            });
            if (option && option.color) {
                return (
                    <div className={styles.groupTextColor} style={{ background: `#${option.color}` }}>
                        {groupText(item.groupText)}
                    </div>
                );
            }
            return <div className={styles.groupTextColorNormal}>{groupText(item.groupText)}</div>;
        }
        return <div className={styles.groupTextNormal}>{groupText(item.groupText)}</div>;
    };

    // 渲染分组长度
    renderGroupLen = (data) => {
        const { hasGroup } = this.props;
        let len = 0;
        if (hasGroup) {
            const groupIds = getKeys(data, 'groupId');
            len = groupIds.length;
        } else {
            len = data.length;
        }
        return <span className={styles.groupNumber}>{`${len}项`}</span>;
    };

    // 渲染分组
    renderGroup = () => {
        const {
            dataSource,
            operateConfig: { groupConfig },
            expand,
        } = this.state;
        if (!groupConfig || groupConfig.length === 0) {
            return <div className={styles.tableC}>{this.renderTable(dataSource)}</div>;
        }
        const aa = memoizeData(groupConfig, dataSource);
        if (aa.length === 0) {
            // 没数据时渲染表头
            return <div className={styles.tableC}>{this.renderTable(dataSource)}</div>;
        }
        // TODO 动态修改分组背景色
        let groupBg;
        let groupFloor1Bg;
        let groupFloor2Bg;
        let groupFloor3Bg;
        let borderColor = '#CBCBCB';
        switch (groupConfig.length) {
            case 1:
                groupBg = '#F5F5F5';
                groupFloor1Bg = '#F7F9FA';
                groupFloor2Bg = '';
                groupFloor3Bg = '';
                borderColor = '#DBDBDB';
                break;
            case 2:
                groupBg = '#EBEBEB';
                groupFloor1Bg = '#EDEDED';
                groupFloor2Bg = '#F7F9FA';
                groupFloor3Bg = '';
                borderColor = '#DBDBDB';
                break;
            case 3:
                groupBg = '#E8E8E8';
                groupFloor1Bg = '#EEEEEE';
                groupFloor2Bg = '#F5F5F5';
                groupFloor3Bg = '#F7F9FA';
                borderColor = '#DBDBDB';
                break;
            default:
                break;
        }
        const firstKeys = [];
        const secondKeys = [];
        const thirdKeys = [];
        return (
            <div className={styles.groupContainer} style={{ background: groupBg }}>
                {aa.map((item1, i) => {
                    if (expand) {
                        firstKeys.push(i);
                    }
                    return (
                        <Collapse
                            // defaultActiveKey={'0'}
                            // defaultActiveKey={firstKeys}
                            key={i}
                            className={styles.groupFloor1}
                            style={{ background: groupFloor1Bg, borderColor }}
                            expandIcon={this.renderGroupArrow}
                        >
                            <Collapse.Panel
                                key={i}
                                header={
                                    <div className={styles.floorContainer}>
                                        <div className={styles.groupName}>{item1.groupName}</div>
                                        <div className={styles.groupText}>
                                            {this.renderGroupText(item1)}
                                            {this.renderGroupLen(item1.dataSource)}
                                        </div>
                                    </div>
                                }
                            >
                                {item1.children
                                    ? item1.children.map((item2, j) => {
                                          if (expand) {
                                              secondKeys.push(`${i}_${j}`);
                                          }
                                          return (
                                              <Collapse
                                                  // defaultActiveKey={'0_0'}
                                                  // defaultActiveKey={secondKeys}
                                                  key={`${i}_${j}`}
                                                  className={styles.groupFloor2}
                                                  style={{
                                                      background: groupFloor2Bg,
                                                      borderColor,
                                                  }}
                                                  expandIcon={this.renderGroupArrow}
                                              >
                                                  <Collapse.Panel
                                                      key={`${i}_${j}`}
                                                      header={
                                                          <div className={styles.floorContainer}>
                                                              <div className={styles.groupName}>{item2.groupName}</div>
                                                              <div className={styles.groupText}>
                                                                  {this.renderGroupText(item2)}
                                                                  {/* {item2.groupText} */}
                                                                  {this.renderGroupLen(item2.dataSource)}
                                                              </div>
                                                          </div>
                                                      }
                                                  >
                                                      {item2.children
                                                          ? item2.children.map((item3, k) => {
                                                                if (expand) {
                                                                    thirdKeys.push(`${i}_${j}_${k}`);
                                                                }
                                                                return (
                                                                    <Collapse
                                                                        // defaultActiveKey={'0_0_0'}
                                                                        // defaultActiveKey={thirdKeys}
                                                                        key={`${i}_${j}_${k}`}
                                                                        className={styles.groupFloor3}
                                                                        style={{
                                                                            background: groupFloor3Bg,
                                                                            borderColor,
                                                                        }}
                                                                        expandIcon={this.renderGroupArrow}
                                                                    >
                                                                        <Collapse.Panel
                                                                            key={`${i}_${j}_${k}`}
                                                                            header={
                                                                                <div className={styles.floorContainer}>
                                                                                    <div className={styles.groupName}>
                                                                                        {item3.groupName}
                                                                                    </div>
                                                                                    <div className={styles.groupText}>
                                                                                        {this.renderGroupText(item3)}
                                                                                        {/* {item3.groupText} */}
                                                                                        {this.renderGroupLen(
                                                                                            item3.dataSource,
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                        >
                                                                            {this.renderTable(item3.dataSource)}
                                                                        </Collapse.Panel>
                                                                    </Collapse>
                                                                );
                                                            })
                                                          : this.renderTable(item2.dataSource)}
                                                  </Collapse.Panel>
                                              </Collapse>
                                          );
                                      })
                                    : this.renderTable(item1.dataSource)}
                            </Collapse.Panel>
                        </Collapse>
                    );
                })}
            </div>
        );
    };

    render() {
        const {
            operateConfig,
            columnConfig,
            filterColumnConfig,
            groupColumnConfig,
            sortColumnConfig,
            isGettingData,
            checked,
            tableId,
            searchCol,
        } = this.state;
        const {
            name,
            isShowComment,
            btns,
            noAdd,
            noEdit,
            noDel,
            noCopy,
            interfaceName,
            commentSort,
            hasGroup,
            operateMenu,
            getDetail,
            getColumnConfig,
            addOrUpdateDataSource,
            delData,
            appendData,
            getHistoryData,
            moreBtns,
            columnConfigCallback,
            cellRender,
            formatColumns,
        } = this.props;
        return (
            <BISpin spinning={isGettingData}>
                <div className={styles.container}>
                    <OperateConfig
                        operateMenu={operateMenu}
                        operateConfig={operateConfig}
                        columnConfig={columnConfig}
                        filterColumnConfig={filterColumnConfig}
                        groupColumnConfig={groupColumnConfig}
                        sortColumnConfig={sortColumnConfig}
                        onChange={this.updateOperateConfig}
                        updateHideConfig={this.updateHideConfig}
                        changeExpand={this.changeExpand}
                        showForm={this.showForm}
                        btns={btns}
                        noAdd={noAdd}
                        checked={checked}
                        flush={this.flush}
                        searchCol={searchCol}
                        onPressEnter={this.onPressEnter}
                        moreBtns={moreBtns}
                    />
                    <div className={styles.tableContainer} ref={this.tableContainerRef}>
                        {this.renderGroup()}
                    </div>
                    <ModalDetail
                        ref={(dom) => {
                            this.modalDetail = dom;
                        }}
                        tableId={tableId}
                        getData={this.getData}
                        interfaceName={interfaceName}
                        commentSort={commentSort}
                        name={name}
                        isShowComment={isShowComment}
                        noEdit={noEdit}
                        noDel={noDel}
                        hasGroup={hasGroup}
                        getDetail={getDetail || defaultGetDetail}
                        getColumnConfig={getColumnConfig || defaultGetColumnConfig}
                        addOrUpdateDataSource={addOrUpdateDataSource || defaultAddOrUpdateDataSource}
                        delData={delData || defaultDelData}
                        columnConfigCallback={columnConfigCallback}
                        cellRender={cellRender}
                        formatColumns={formatColumns}
                    />
                    <ModalHistory
                        ref={(dom) => {
                            this.modalHistory = dom;
                        }}
                        tableId={tableId}
                        getData={this.getData}
                        interfaceName={interfaceName}
                        commentSort={commentSort}
                        name={name}
                        isShowComment={isShowComment}
                        noEdit={noEdit}
                        noCopy={noCopy}
                        getDetail={getDetail || defaultGetDetail}
                        getColumnConfig={getColumnConfig || defaultGetColumnConfig}
                        addOrUpdateDataSource={addOrUpdateDataSource || defaultAddOrUpdateDataSource}
                        delData={delData || defaultDelData}
                        appendData={appendData}
                        getHistoryData={getHistoryData}
                        columnConfigCallback={columnConfigCallback}
                        cellRender={cellRender}
                        formatColumns={formatColumns}
                    />
                </div>
            </BISpin>
        );
    }
}

export default AirTable;
