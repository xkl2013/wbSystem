/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { message } from 'antd';
import businessConfig from '@/config/business';

import ApolloTable from '@/submodule/components/apolloTable';
import ModalDetail from '../detail';
import s from './index.less';
import { checkPathname } from '@/components/AuthButton';
import Loading from '@/ant_components/BISpin';
import { commonFormatColumns, updateLineData } from '@/pages/business/live/utils';
import BIModal from '@/ant_components/BIModal';
import { emailReg } from '@/utils/reg';
import Move from '../components/move';

export const emitChangeCell4Msg = async ({ rowId, value }) => {
    const { tableId, addOrUpdateDataSource } = businessConfig[54];
    return await addOrUpdateDataSource({ data: { tableId, id: rowId, value } });
};
export const formatColumns = (columns) => {
    const config = businessConfig[54];
    columns = commonFormatColumns(columns, config);
    return columns.map((item) => {
        if (item.columnName === 'email') {
            item.columnAttrObj.rules = [
                {
                    pattern: emailReg,
                    message: '请输入正确的邮箱',
                },
            ];
        }
        if (item.columnName === 'birthday') {
            item.columnAttrObj.disabledDate = function(current) {
                return current.isBefore('1980.1.1') || current.isAfter('2006.12.31');
            };
        }
        return item;
    });
};
const First = (props) => {
    const moveRef = useRef(null);
    const { liveId } = props.location.query;
    const config = businessConfig[54];
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
        pageSize: 50,
        total: 0,
    });

    const onChangePageNum = useCallback((page) => {
        fetchDataSource({ pageNum: page });
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
                const newPageConfig = {
                    ...pageConfig,
                    pageNum: data.pageNum,
                    total,
                };
                setDataSource(arr);
                setPageConfig(newPageConfig);
            }
            await setLoading(false);
        },
        [tableId, pageConfig, dataSource],
    );

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

    // 展开详情
    const onClickShowExpand = useCallback(
        (data) => {
            if (modalDetail && modalDetail.current) {
                modalDetail.current.showModal({ tableId, ...data });
            }
        },
        [modalDetail, tableId],
    );

    const [selectedRows, setSelectedRows] = useState([]);
    const onChangeRowSelection = (values) => {
        setSelectedRows(values);
    };

    const onClickDelLines = useCallback(() => {
        if (selectedRows.length <= 0) {
            message.warning('请选择需要删除的数据');
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
                    fetchDataSource({ pageNum: pageConfig.pageNum });
                    setSelectedRows([]);
                }
            },
        });
    }, [selectedRows]);

    // 移动
    const onClickMoveLines = useCallback(() => {
        if (selectedRows.length <= 0) {
            message.warning('请先选择数据');
            return;
        }
        moveRef.current.openModal();
    }, [selectedRows]);

    // 移动成功回调
    const moveCbk = () => {
        fetchDataSource({ pageNum: pageConfig.pageNum });
        setSelectedRows([]);
    };

    // 序号取ID
    const getId = (obj) => {
        return obj && obj.record && obj.record.id;
    };

    const { filterConfig, sortConfig, groupConfig } = operateConfig || {};
    return (
        <>
            <ApolloTable
                tableId={tableId}
                rowHeight={40}
                headerHeight={40}
                columnWidth={columnWidth}
                columns={useMemo(() => {
                    return formatColumns(columns);
                }, [columns])}
                dataSource={dataSource}
                cellEditable={checkPathname('/foreEnd/business/recruit/edit')}
                emitChangeCell={emitChangeCell}
                showIndex={getId}
                showExpand={onClickShowExpand}
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
                            hidden: !checkPathname('/foreEnd/business/recruit/del'),
                            onClick: onClickDelLines,
                        },
                        {
                            label: '移至',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/recruit/move'),
                            onClick: onClickMoveLines,
                        },
                    ],
                }}
                rowSelection={{
                    selectedRows,
                    onChange: onChangeRowSelection,
                }}
                paginationConfig={{
                    current: pageConfig.pageNum,
                    pageSize: pageConfig.pageSize,
                    total: pageConfig.total,
                    onChange: onChangePageNum,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total) => {
                        return `共${total}条`;
                    },
                    className: s.paginationContainer,
                }}
            />
            <ModalDetail
                ref={modalDetail}
                tableId={tableId}
                getData={fetchDataSource.bind(this, { pageNum: pageConfig.pageNum })}
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
                noEdit={!checkPathname('/foreEnd/business/recruit/edit')}
                noDel={!checkPathname('/foreEnd/business/recruit/del')}
            />
            <Move currKey={tableId} ids={selectedRows} ref={moveRef} moveCbk={moveCbk} />
        </>
    );
};

export default First;
