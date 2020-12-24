/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { message } from 'antd';
import businessConfig from '@/config/business';

import ApolloTable from '@/submodule/components/apolloTable';
import s from '@/pages/business/live/session/index.less';
import ModalDetail from '../../detail';
import { checkPathname } from '@/components/AuthButton';
import Loading from '@/ant_components/BISpin';
import { filterFormatColumns, updateLineData } from '@/pages/business/live/utils';
import ShowBtn from '../../components/liveAnalyse/btn';
import BIModal from '@/ant_components/BIModal';
import HistoryDetail from '../../history';
import { TableCollapse, LiveName, ExportTable, TransferProduct } from '@/pages/business/live/components';
import MsgTransfer from '@/components/Synergy/msgTransfer';
import { useMessage } from '@/pages/business/live/components/message';

export const emitChangeCell4Msg = async ({ rowId, value }) => {
    const { tableId, addOrUpdateDataSource } = businessConfig[46];
    const res = await addOrUpdateDataSource({ data: { tableId, id: rowId, value } });
    if (res && res.success) {
        if (res.data && res.data.requiredColumnNameList && res.data.requiredColumnNameList.length > 0) {
            message.warning('请补充全部必填字段，才可进行下一步操作', 5);
            res.operateType = 'reCheck';
            res.filterCols = res.data.requiredColumnNameList;
            return res;
        }
        const statusItem = value.find((item) => {
            return item.columnCode === 'selectState';
        });
        // 修改状态为通过时，删除该条数据
        if (statusItem && String(statusItem.cellValueList[0].value) === '1') {
            res.operateType = 'del';
        }
    }
    return res;
};
export const formatColumns = (columns) => {
    const config = businessConfig[46];
    return filterFormatColumns(columns, config);
};
const Second = (props) => {
    const { liveId, roomId } = props.location.query;
    const config = businessConfig[46];
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
    } = config;
    const modalDetail = useRef(null);
    const modalTransferProduct = useRef(null);
    const historyDetail = useRef(null);
    const [loading, setLoading] = useState([]);
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        fetchColumns();
    }, []);
    const fetchColumns = async () => {
        const res = await getColumnConfig({ tableId });
        if (res && res.success && res.data) {
            const arr = Array.isArray(res.data) ? res.data : [];
            setColumns(arr);
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
            const response = await setOperateConfig({ tableId, data: newConfig });
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
            const response = await setHideConfig({ tableId, data });
            if (response && response.success) {
                fetchColumns();
            }
        },
        [tableId],
    );

    const [dataSource, setDataSource] = useState([]);
    const [pageConfig, setPageConfig] = useState({
        pageNum: 1,
        pageSize: 30,
        total: 0,
    });

    const fetchDataSource = useCallback(
        async ({ pageNum }) => {
            await setLoading(true);
            const data = {
                pageNum: pageNum || pageConfig.pageNum,
                pageSize: pageConfig.pageSize,
                liveId,
            };
            const res = await getDataSource({ tableId, data });
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
        [tableId, pageConfig, dataSource],
    );

    const onScroll = () => {
        if (pageConfig.pageNum * pageConfig.pageSize < pageConfig.total && !loading) {
            fetchDataSource({ pageNum: pageConfig.pageNum + 1 });
        }
    };
    const debounceScroll = _.debounce(onScroll, 400);

    const emitChangeCell = async ({ rowId, value, forceUpdate }) => {
        const statusItem = value.find((item) => {
            return item.columnCode === 'selectState';
        });
        // 修改状态为通过时，删除该条数据
        if (statusItem && String(statusItem.cellValueList[0].value) === '1') {
            const updateOldData = dataSource.filter((item) => {
                return Number(item.id) === Number(rowId);
            });
            if (modalTransferProduct && modalTransferProduct.current && modalTransferProduct.current.showModal) {
                modalTransferProduct.current.showModal(4, updateOldData);
            }
            return;
        }
        const res = await addOrUpdateDataSource({ data: { tableId, businessLiveProductId: liveId, id: rowId, value } });
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
    const { userEditMsg, callbackId, onEmitMsg, onReceiveMsg } = useMessage({
        liveId,
        tableId,
        dataSource,
        setDataSource,
    });
    const selfAddOrUpdate = async ({ data }) => {
        await emitChangeCell({ rowId: data.id, value: data.value });
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
    // 显示行编辑表单
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
    const onClickShowExpand = useCallback(
        (data) => {
            if (modalDetail && modalDetail.current) {
                modalDetail.current.showModal({ tableId, ...data });
            }
        },
        [modalDetail, tableId],
    );
    const onClickAddSecond = () => {
        if (modalDetail && modalDetail.current) {
            modalDetail.current.showModal({ tableId });
        }
    };

    const onClickTransferSession = async (titleIndex) => {
        if (selectedRows.length <= 0) {
            message.warning('请选择需要添加的产品');
            return;
        }
        if (selectedRows.length > 20) {
            message.warning('复选产品不能超过20条');
            return;
        }

        if (modalTransferProduct && modalTransferProduct.current && modalTransferProduct.current.showModal) {
            const data = dataSource.filter((item) => {
                return selectedRows.some((temp) => {
                    return Number(temp.id) === Number(item.id);
                });
            });
            modalTransferProduct.current.showModal(titleIndex, data);
        }
    };

    const [selectedRows, setSelectedRows] = useState([]);
    const onChangeRowSelection = (values) => {
        setSelectedRows(values);
    };
    const onClickDelLines = useCallback(() => {
        if (selectedRows.length <= 0) {
            message.warning('请选择需要删除的产品');
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
    const { filterConfig, sortConfig, groupConfig } = operateConfig || {};
    return (
        <>
            <ApolloTable
                tableId={tableId}
                className={s.table}
                rowHeight={40}
                headerHeight={40}
                columnWidth={columnWidth}
                columns={useMemo(() => {
                    const firstItem = columns.filter((temp) => temp.hideScope.indexOf('LIST') === -1)[0];
                    if (firstItem) {
                        firstItem.cellRenderProps = {
                            showHistory: onShowHistory,
                            addHistoryAuth: checkPathname('/foreEnd/business/live/bloggerSession/second/history/add'),
                        };
                    }
                    return formatColumns(columns);
                }, [columns])}
                dataSource={dataSource}
                cellEditable={checkPathname('/foreEnd/business/live/bloggerSession/second/edit')}
                emitChangeCell={emitChangeCell}
                showIndex={true}
                showExpand={onClickShowExpand}
                onScroll={debounceScroll}
                loading={loading}
                loadComp={<Loading loadingClassName={s.loading} />}
                onEmitMsg={onEmitMsg}
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
                        { type: 'sort', value: sortConfig, onChange: onChangeOperateConfig },
                    ],
                    buttonsGroup: [
                        {
                            label: '新增',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/live/bloggerSession/second/add'),
                            onClick: onClickAddSecond,
                        },
                        {
                            hidden: !checkPathname('/foreEnd/business/live/bloggerSession/second/export'),
                            render: () => (
                                <ExportTable
                                    liveId={liveId}
                                    tableId={tableId}
                                    name={name}
                                    selectedRows={selectedRows}
                                />
                            ),
                        },
                        {
                            label: '删除',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/live/bloggerSession/second/del'),
                            onClick: onClickDelLines,
                        },
                        {
                            label: '移至',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/live/bloggerSession/second/transfer'),
                            onClick: onClickTransferSession.bind(null, 2),
                        },
                        {
                            label: '复制',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/live/bloggerSession/second/transfer'),
                            onClick: onClickTransferSession.bind(null, 3),
                        },
                        {
                            render: () => <ShowBtn liveId={liveId} roomId={roomId} />,
                        },
                    ],
                }}
                tableOperateConfig={{
                    buttonsGroup: [
                        {
                            render: () => <LiveName liveId={liveId} tableId={33} />,
                        },
                        {
                            render: () => <TableCollapse />,
                        },
                    ],
                }}
                rowSelection={{
                    selectedRows,
                    onChange: onChangeRowSelection,
                }}
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
                formatColumns={formatColumns}
                noEdit={!checkPathname('/foreEnd/business/live/bloggerSession/second/edit')}
                noDel={!checkPathname('/foreEnd/business/live/bloggerSession/second/del')}
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
                formatColumns={formatColumns}
                noAdd={!checkPathname('/foreEnd/business/live/bloggerSession/second/history/add')}
                noEdit={!checkPathname('/foreEnd/business/live/bloggerSession/second/history/edit')}
                noDel={!checkPathname('/foreEnd/business/live/bloggerSession/second/history/del')}
            />
            <TransferProduct
                ref={modalTransferProduct}
                titleIndex={2}
                selectedRows={selectedRows}
                tableId={tableId}
                liveId={liveId}
                successCb={() => {
                    setSelectedRows([]);
                }}
            />
            <MsgTransfer onReceiveMsg={onReceiveMsg} userEditMsg={userEditMsg} callbackId={callbackId} />
        </>
    );
};

export default Second;
