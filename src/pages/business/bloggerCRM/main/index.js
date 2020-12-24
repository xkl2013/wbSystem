/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { message } from 'antd';
import businessConfig from '@/config/business';

import ApolloTable from '@/submodule/components/apolloTable';
import ModalDetail from '../detail';
import s from '@/pages/business/live/session/index.less';
import Loading from '@/ant_components/BISpin';
import { filterFormatColumns, updateLineData } from '../utils';
import BIModal from '@/ant_components/BIModal';
import Notice from '@/pages/business/components/noticers';
import HistoryDetail from '../history';
import { TransferBlogger, Search, AddOrUpdateApproval, ApprovalDetail } from '../components';
import { startApproval } from '../service';
import { getCache, saveCache } from '@/submodule/components/apolloTable/utils/cache';

export const mainEmitChangeCell4Msg = async ({ rowId, value, moduleType }) => {
    const { tableId, addOrUpdateDataSource } = businessConfig[moduleType];
    return await addOrUpdateDataSource({ data: { tableId, id: rowId, value } });
};
export const mainFormatColumns = (moduleType, columns) => {
    const config = businessConfig[moduleType];
    return filterFormatColumns(columns, config);
};
const Main = (props) => {
    const { moduleType } = props;
    const config = businessConfig[moduleType];
    const {
        tableId,
        getColumnConfig,
        getDataSource,
        addOrUpdateDataSource,
        getOperateConfig,
        setOperateConfig,
        getDetail,
        delData,
        getHistoryData,
        appendData,
        setHideConfig,
        interfaceName,
        isShowComment,
        commentSort,
        name,
        columnWidth,
        noEdit,
        noDel,
        noTransfer,
        noImport,
        noApproval,
        setUserDragConfig,
    } = config;
    const modalDetail = useRef(null);
    const modalTransferProduct = useRef(null);
    const historyDetail = useRef(null);
    const modalApprovalForm = useRef(null);
    const modalApprovalDetail = useRef(null);
    const [loading, setLoading] = useState([]);
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        fetchColumns();
    }, []);
    const fetchColumns = async () => {
        const res = await getColumnConfig({ tableId });
        if (res && res.success && res.data) {
            const arr = Array.isArray(res.data) ? res.data : [];
            let sortedArr = arr.sort((a, b) => {
                return a.orderNo - b.orderNo;
            });
            let cachedCols = getCache({ tableId });
            if (cachedCols) {
                sortedArr = sortedArr.map((item) => {
                    if (!cachedCols[item.columnName]) {
                        cachedCols[item.columnName] = {
                            columnName: item.columnName,
                            width: item.width,
                            align: item.align,
                            fixed: '',
                            orderNo: Object.keys(cachedCols).length + 1,
                        };
                    }
                    return {
                        ...item,
                        ...cachedCols[item.columnName],
                    };
                });
                saveCache({ tableId, data: cachedCols });
                sortedArr = sortedArr.sort((a, b) => {
                    return a.orderNo - b.orderNo;
                });
            } else {
                sortedArr = sortedArr.map((item, i) => {
                    return {
                        ...item,
                        orderNo: i + 1,
                    };
                });
            }
            setColumns(sortedArr);
        }
    };
    const [operateConfig, setOptConfig] = useState();
    useEffect(() => {
        fetchOperateConfig();
    }, []);
    const fetchOperateConfig = useCallback(async () => {
        const response = await getOperateConfig({ tableId });
        if (response && response.success && response.data) {
            const { filterList, groupList, sortList } = response.data;
            setOptConfig({
                filterConfig: filterList || [],
                groupConfig: groupList || [],
                sortConfig: sortList || [],
            });
            fetchDataSource({ pageNum: 1 });
        }
    }, [tableId]);

    const onChangeOperateConfig = useCallback(
        async (payload) => {
            const temp = _.cloneDeep(operateConfig);
            if (Array.isArray(payload)) {
                payload.map((item) => {
                    const { type, config } = item;
                    temp[type] = config;
                });
            } else {
                const { type, config } = payload;
                temp[type] = config;
            }
            const newConfig = {
                filterList: temp.filterConfig,
                groupList: temp.groupConfig,
                sortList: temp.sortConfig,
            };
            const response = await setOperateConfig({
                tableId,
                data: newConfig,
            });
            if (response && response.success) {
                setOptConfig(temp);
                fetchDataSource({ pageNum: 1 });
            }
        },
        [tableId, operateConfig],
    );

    const onChangeHideConfig = useCallback(
        async ({ config }) => {
            const data = {
                configType: 1, // 隐藏字段配置标识
                configAttr: JSON.stringify(config),
            };
            const response = await setHideConfig({
                tableId,
                data,
            });
            if (response && response.success) {
                fetchColumns();
            }
        },
        [tableId],
    );

    const onDragSorted = useCallback(
        async (newColumns) => {
            setColumns(newColumns);
            const config = {};
            newColumns.map((item) => {
                config[item.columnName] = item.orderNo;
            });
            const data = {
                configType: 5, // 排序字段配置标识
                configAttr: JSON.stringify(config),
            };
            const response = await setUserDragConfig({
                tableId,
                data,
            });
            // if (response && response.success) {
            //     fetchColumns();
            // }
        },
        [tableId],
    );

    const [dataSource, setDataSource] = useState([]);
    const [pageConfig, setPageConfig] = useState({
        pageNum: 1,
        pageSize: 30,
        total: 0,
    });
    const [searchContent, setSearchContent] = useState('');
    const fetchDataSource = useCallback(
        async ({ pageNum, clearSearch }) => {
            await setLoading(true);
            const data = {
                pageNum: pageNum || pageConfig.pageNum,
                pageSize: pageConfig.pageSize,
            };
            if (searchContent) {
                data.searchContent = searchContent;
            }
            if (clearSearch) {
                delete data.searchContent;
            }
            const res = await getDataSource({
                tableId,
                data,
            });
            if (res && res.success && res.data) {
                const { list, total } = res.data;
                const arr = Array.isArray(list) ? list : [];
                let newList = dataSource.concat(arr);
                if (data.pageNum === 1) {
                    newList = arr;
                }
                const newPageConfig = {
                    ...pageConfig,
                    pageNum: data.pageNum,
                    total,
                };
                setDataSource(newList);
                setPageConfig(newPageConfig);
            }
            await setLoading(false);
        },
        [tableId, pageConfig, dataSource, searchContent],
    );

    const onScroll = () => {
        if (pageConfig.pageNum * pageConfig.pageSize < pageConfig.total && !loading) {
            fetchDataSource({ pageNum: pageConfig.pageNum + 1 });
        }
    };
    const debounceScroll = _.debounce(onScroll, 400);

    const emitChangeCell = async ({ rowId, value, forceUpdate = true }) => {
        const res = await addOrUpdateDataSource({
            data: {
                tableId,
                id: rowId,
                value,
            },
        });
        if (res && res.success) {
            if (forceUpdate) {
                fetchDataSource({ pageNum: 1 });
                return res;
            }
            const updateOldIndex = dataSource.findIndex((item) => {
                return Number(item.id) === Number(rowId);
            });
            if (updateOldIndex > -1) {
                let operateType = 'edit';
                // 更新操作，只处理内存数据
                const newDataSource = updateLineData(dataSource, {
                    index: updateOldIndex,
                    value: { rowData: value },
                    operateType,
                });
                setDataSource(newDataSource);
            }
        }
        return res;
    };

    const selfAddOrUpdate = async ({ data }) => {
        await emitChangeCell({
            rowId: data.id,
            value: data.value,
        });
        if (modalDetail && modalDetail.current) {
            modalDetail.current.hideForm();
        }
    };
    const historyAddOrUpdate = async ({ data }) => {
        const res = await emitChangeCell({
            rowId: data.id,
            value: data.value,
            forceUpdate: true,
        });
        return res;
    };
    const historyDelData = async ({ data }) => {
        const res = await delData({
            data,
        });
        if (res && res.success) {
            fetchDataSource({ pageNum: 1 });
        }
        return res;
    };
    const historyAppendData = async ({ data }) => {
        const res = await appendData({
            data,
        });
        if (res && res.success) {
            fetchDataSource({ pageNum: 1 });
            setSelectedRows([]);
        }
        return res;
    };
    // 展开详情
    const onClickShowExpand = useCallback(
        (data) => {
            if (modalDetail && modalDetail.current) {
                modalDetail.current.showModal({ tableId, ...data });
            }
        },
        [modalDetail, tableId],
    );
    // 导入
    const onClickImport = () => {
        window.open('import', '_self');
    };
    // 打开创建审批弹框
    const onClickApproval = () => {
        if (selectedRows.length <= 0) {
            message.warning('请先选择需要操作的数据');
            return;
        }
        if (selectedRows.length > 1) {
            message.warning('复选不能超过1条');
            return;
        }

        if (selectedRows[0].isLocked) {
            message.warning('"审批中"和已"审批通过"的数据不能操作');
            return;
        }

        if (modalApprovalForm && modalApprovalForm.current && modalApprovalForm.current.showModal) {
            const filterNewData = dataSource.filter((item) => {
                return selectedRows.some((temp) => {
                    return Number(temp.id) === Number(item.id);
                });
            });
            const data = filterNewData[0] || {};
            const formData = {};
            data.rowData &&
                data.rowData.map((item) => {
                    if (item.colName === 'talentName') {
                        formData.talentName = item.cellValueList[0] && item.cellValueList[0].text;
                    }
                    if (item.colName === 'bloggerInfo') {
                        formData.remark = item.cellValueList[0] && item.cellValueList[0].text;
                    }
                    if (item.colName === 'talentAttachment') {
                        formData.attachmentName = item.cellValueList[0] && item.cellValueList[0].text;
                        formData.attachmentUrl = item.cellValueList[0] && item.cellValueList[0].value;
                    }
                });
            modalApprovalForm.current.showModal(formData);
        }
    };

    const bus_sync_bloggerCRM = () => {
        fetchDataSource({});
    };

    // 显示审批详情
    const onShowApproval = (rowId) => {
        if (!window.bus_sync_bloggerCRM) {
            window.bus_sync_bloggerCRM = bus_sync_bloggerCRM;
        }
        window.open(`approval?rowId=${rowId}`, '_blank');
    };
    // 提交审批请求
    const onSubmitApproval = async (values) => {
        const expandId = selectedRows[0] && selectedRows[0].id;
        values.expandId = expandId;
        values.divideRateTalent = values.divideRateTalent / 100;
        values.divideRateCompany = values.divideRateCompany / 100;
        values.noticeList = Notice.getNoticeData() || [];
        const res = await startApproval({ data: values });
        if (res && res.success) {
            modalApprovalForm.current.hideModal();
            setSelectedRows([]);
            fetchDataSource({ pageNum: 1 });
        }
    };
    // 检测所选行是否锁定
    const checkLocked = () => {
        const locked = [];
        selectedRows.map((temp) => {
            if (temp.isLocked) {
                let talentCode = '',
                    talentName = '';
                temp.rowData &&
                    temp.rowData.map((item) => {
                        if (item.colName === 'talentName') {
                            talentName = item.cellValueList[0] && item.cellValueList[0].text;
                        }
                        if (item.colName === 'talentCode') {
                            talentCode = item.cellValueList[0] && item.cellValueList[0].text;
                        }
                    });
                locked.push(`${talentName}_${talentCode}`);
            }
        });
        if (locked.length > 0) {
            message.warning(`"审批中"和已"审批通过"的数据不能操作`);
            // message.warning(`复选数据中${locked.join(',')}正在审批中，不能进行操作`);
            return true;
        }
    };
    // 打开转移博主弹框
    const onClickTransferBlogger = async () => {
        if (selectedRows.length <= 0) {
            message.warning('请先选择需要操作的数据');
            return;
        }
        if (selectedRows.length > 30) {
            message.warning('复选不能超过30条');
            return;
        }
        if (checkLocked()) {
            return;
        }

        if (modalTransferProduct && modalTransferProduct.current && modalTransferProduct.current.showModal) {
            modalTransferProduct.current.showModal({ selectedRows });
        }
    };
    // 移至成功回调
    const transferSuccessCb = () => {
        // 清空选中数据
        setSelectedRows([]);
        // 重新获取当前表数据
        fetchDataSource({ pageNum: 1 });
    };

    const [selectedRows, setSelectedRows] = useState([]);
    const onChangeRowSelection = (values) => {
        setSelectedRows(values);
    };
    const onClickDelLines = useCallback(() => {
        if (selectedRows.length <= 0) {
            message.warning('请选择需要删除的数据');
            return;
        }
        if (checkLocked()) {
            return;
        }
        BIModal.confirm({
            title: `本次操作将删除${selectedRows.length}条数据，删除后无法恢复，确认删除吗？`,
            autoFocusButton: null,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                const ids = [];
                selectedRows.map((item) => {
                    ids.push(item.id);
                });
                const response = await delData({
                    tableId,
                    data: {
                        tableId,
                        ids,
                    },
                });
                if (response && response.success) {
                    message.success('删除成功');
                    fetchDataSource({ pageNum: 1 });
                    setSelectedRows([]);
                }
            },
        });
    }, [selectedRows]);
    // 打开跟进记录弹框
    const onShowHistory = ({ rowId, rowData, initType }) => {
        if (historyDetail && historyDetail.current && historyDetail.current.showModal) {
            historyDetail.current.showModal({
                tableId,
                rowId,
                rowData,
                initType,
            });
        }
    };
    const { filterConfig, sortConfig } = operateConfig || {};
    // 特殊处理表格中列配置
    const memColumns = useMemo(() => {
        let first = false;
        const newCols = columns.map((item) => {
            delete item.cellRenderProps;
            if (!first && item.showStatus && item.hideScope.indexOf('LIST') === -1) {
                item.cellRenderProps = {
                    showHistory: onShowHistory,
                    showApproval: onShowApproval,
                };
                first = true;
            }
            return item;
        });
        return mainFormatColumns(moduleType, newCols);
    }, [moduleType, columns]);
    return (
        <>
            <ApolloTable
                tableId={tableId}
                className={s.table}
                rowHeight={40}
                headerHeight={40}
                columnWidth={columnWidth}
                columns={memColumns}
                dataSource={dataSource}
                cellEditable={!noEdit}
                emitChangeCell={emitChangeCell}
                showIndex={true}
                showExpand={false}
                onScroll={debounceScroll}
                loading={loading}
                loadComp={<Loading loadingClassName={s.loading} />}
                operateConfig={{
                    menusGroup: [
                        {
                            type: 'hide',
                            onChange: onChangeHideConfig,
                        },
                        {
                            type: 'filter',
                            value: filterConfig,
                            onChange: onChangeOperateConfig,
                        },
                        {
                            type: 'sort',
                            value: sortConfig,
                            onChange: onChangeOperateConfig,
                        },
                    ],
                    buttonsGroup: [
                        {
                            label: '删除',
                            type: 'primary',
                            hidden: noDel,
                            onClick: onClickDelLines,
                        },
                        {
                            label: '移至',
                            type: 'primary',
                            hidden: noTransfer,
                            onClick: onClickTransferBlogger,
                        },
                        {
                            label: '导入',
                            hidden: noImport,
                            type: 'primary',
                            onClick: onClickImport,
                        },
                        {
                            label: '发起审批',
                            hidden: noApproval,
                            type: 'primary',
                            onClick: onClickApproval,
                        },
                        {
                            render: () => {
                                return (
                                    <Search
                                        onSearch={fetchDataSource}
                                        value={searchContent}
                                        onChange={setSearchContent}
                                    />
                                );
                            },
                        },
                    ],
                }}
                rowSelection={{
                    selectedRows,
                    onChange: onChangeRowSelection,
                }}
                canFixed={true}
                canSorted={true}
                onDragSorted={onDragSorted}
                onDragFixed={onDragSorted}
                cachedFeAttr={true}
                leftMargin={-20}
            />
            <ModalDetail
                ref={modalDetail}
                tableId={tableId}
                getData={fetchDataSource}
                interfaceName={interfaceName}
                commentSort={commentSort}
                name={name}
                isShowComment={isShowComment}
                getDetail={getDetail}
                getColumnConfig={getColumnConfig}
                addOrUpdateDataSource={selfAddOrUpdate}
                delData={delData}
                emitChangeCell={emitChangeCell}
                formatColumns={mainFormatColumns.bind(this, moduleType)}
                noEdit={noEdit}
                noDel={noDel}
            />
            <HistoryDetail
                ref={historyDetail}
                tableId={tableId}
                getData={fetchDataSource}
                interfaceName={interfaceName}
                commentSort={commentSort}
                name={name}
                isShowComment={isShowComment}
                getDetail={getDetail}
                getColumnConfig={getColumnConfig}
                addOrUpdateDataSource={historyAddOrUpdate}
                getHistoryData={getHistoryData}
                appendData={historyAppendData}
                delData={historyDelData}
                formatColumns={mainFormatColumns.bind(this, moduleType)}
                noAdd={true}
                noEdit={true}
                noDel={true}
            />
            <TransferBlogger
                ref={modalTransferProduct}
                selectedRows={selectedRows}
                tableId={tableId}
                successCb={transferSuccessCb}
            />
            <AddOrUpdateApproval ref={modalApprovalForm} onSubmit={onSubmitApproval} />
            <ApprovalDetail ref={modalApprovalDetail} />
        </>
    );
};

export default Main;
