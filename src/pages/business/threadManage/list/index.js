/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { message } from 'antd';
import businessConfig from '@/config/business';

import ApolloTable from '@/submodule/components/apolloTable';
import ModalDetail from '../detail';
import s from '@/pages/business/live/session/index.less';
import { checkPathname } from '@/components/AuthButton';
import Loading from '@/ant_components/BISpin';
import { commonFormatColumns, updateLineData } from '@/pages/business/live/utils';
import BIModal from '@/ant_components/BIModal';
import { TableCollapse, LiveName, WithHistory, TodayFollowFlag, ModalTalent } from '@/pages/business/live/components';
import { useMessage } from '@/pages/business/live/components/message';
import { mobileReg, emailReg } from '@/utils/reg';

export const emitChangeCell4Msg = async ({ rowId, value }) => {
    const { tableId, addOrUpdateDataSource } = businessConfig[55];
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
    const config = businessConfig[55];
    columns = commonFormatColumns(columns, config);
    return columns.map((item) => {
        if (item.columnName === 'phone') {
            item.columnAttrObj.rules = [
                {
                    pattern: mobileReg,
                    message: '请输入正确的手机号码',
                },
            ];
        }
        if (item.columnName === 'email') {
            item.columnAttrObj.rules = [
                {
                    pattern: emailReg,
                    message: '请输入正确的邮箱',
                },
            ];
        }
        return item;
    });
};
const First = (props) => {
    const { liveId } = props.location.query;
    const config = businessConfig[55];
    const {
        tableId,
        getColumnConfig,
        getDataSource,
        addOrUpdateDataSource,
        getOperateConfig,
        setOperateConfig,
        getDetail,
        delData,
        setHideConfig,
        interfaceName,
        isShowComment,
        commentSort,
        name,
        columnWidth,
    } = config;
    const modalDetail = useRef(null);
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
        [tableId, pageConfig, dataSource],
    );

    const onScroll = () => {
        if (pageConfig.pageNum * pageConfig.pageSize < pageConfig.total && !loading) {
            fetchDataSource({ pageNum: pageConfig.pageNum + 1 });
        }
    };
    const debounceScroll = _.debounce(onScroll, 400);

    const emitChangeCell = async ({ rowId, value, forceUpdate }) => {
        const res = await addOrUpdateDataSource({
            data: {
                tableId,
                businessLiveProductId: liveId,
                id: rowId,
                value,
            },
        });
        if (res && res.success) {
            if (res.data && res.data.requiredColumnNameList && res.data.requiredColumnNameList.length > 0) {
                message.warning('请补充全部必填字段，才可进行下一步操作', 5);
                onClickShowExpand({
                    rowId,
                    filterCols: res.data.requiredColumnNameList,
                });
                return;
            }
            if (forceUpdate) {
                fetchDataSource({ pageNum: 1 });
                return res;
            }
            const updateOldIndex = dataSource.findIndex((item) => {
                return Number(item.id) === Number(rowId);
            });
            if (updateOldIndex > -1) {
                let operateType = 'edit';
                const statusItem = value.find((item) => {
                    return item.columnCode === 'selectState';
                });
                // 修改状态为通过时，删除该条数据
                if (statusItem && String(statusItem.cellValueList[0].value) === '1') {
                    operateType = 'del';
                    res.operateType = 'del';
                }
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
        await emitChangeCell({
            rowId: data.id,
            value: data.value,
        });
        if (modalDetail && modalDetail.current) {
            modalDetail.current.hideForm();
        }
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
    // 新增一行
    const onClickAddFirst = () => {
        if (modalDetail && modalDetail.current) {
            modalDetail.current.showModal({ tableId });
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
                    // if (firstItem) {
                    //     firstItem.cellRenderProps = {
                    //         showHistory: onShowHistory,
                    //         addHistoryAuth: checkPathname('/foreEnd/business/live/session/first/history/add'),
                    //     };
                    // }
                    return formatColumns(columns);
                }, [columns])}
                dataSource={dataSource}
                cellEditable={checkPathname('/foreEnd/business/threadManage/edit')}
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
                        {
                            type: 'sort',
                            value: sortConfig,
                            onChange: onChangeOperateConfig,
                        },
                    ],
                    buttonsGroup: [
                        // {
                        //     label: '新增',
                        //     type: 'primary',
                        //     hidden: !checkPathname('/foreEnd/business/live/session/first/add'),
                        //     onClick: onClickAddFirst,
                        // },

                        {
                            label: '删除',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/threadManage/del'),
                            onClick: onClickDelLines,
                        },
                    ],
                }}
                // tableOperateConfig={{
                //     buttonsGroup: [
                //         {
                //             render: () => <LiveName liveId={liveId} tableId={27} />,
                //         },
                //         {
                //             render: () => <TableCollapse />,
                //         },
                //     ],
                // }}
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
                noEdit={!checkPathname('/foreEnd/business/threadManage/edit')}
                noDel={!checkPathname('/foreEnd/business/threadManage/del')}
            />
        </>
    );
};

export default First;
