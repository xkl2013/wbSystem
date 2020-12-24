/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { message, Modal } from 'antd';
import businessConfig from '@/config/business';
import ApolloTable from '@/submodule/components/apolloTable';
import { checkPathname } from '@/components/AuthButton';
import Loading from '@/ant_components/BISpin';
import s from '@/pages/business/live/session/index.less';
import Search from '@/pages/business/live/components/search';
import FilterCreateTime from '@/pages/business/live/product/filterCreateTime';
import { commonFormatColumns, updateLineData } from '@/pages/business/live/utils';
import ModalDetail from '../detail';
import ModlfyTalent from '../talentChild/modal';
import { TableCollapse, TransferProduct, ProductPicDetail, ProductPicEdit } from '@/pages/business/live/components';
import { checkoutFileType } from '@/pages/business/live/components/productPic/upload/utils';

export const emitChangeCell4Msg = async ({ rowId, value }) => {
    const { tableId, addOrUpdateDataSource } = businessConfig[37];
    const res = await addOrUpdateDataSource({ data: { tableId, id: rowId, value } });
    if (res && res.success) {
        return res;
    }
};
const getCellClass = ({ columnConfig, columnData }) => {
    if (
        columnConfig.columnName === 'talent' ||
        columnConfig.columnName === 'commissionRate' ||
        columnConfig.columnName === 'pitPrice'
    ) {
        return '';
    }
    if (columnConfig.readOnlyFlag) {
        return s.readonly;
    }
    if (columnData.dynamicCellConfigDTO && columnData.dynamicCellConfigDTO.readonlyFlag) {
        return s.readonly;
    }
};
export const formatColumns = (columns) => {
    const config = businessConfig[37];
    columns = commonFormatColumns(columns, config);
    columns.map((item) => {
        if (item.columnName === 'talent' || item.columnName === 'commissionRate' || item.columnName === 'pitPrice') {
            item.renderDetailCell = () => {
                return {
                    detailComp: ModlfyTalent,
                };
            };
            item.renderDetailForm = () => {
                return {
                    detailComp: ModlfyTalent,
                };
            };
            item.renderEditForm = () => {
                return {
                    editComp: ModlfyTalent,
                };
            };
        }
        if (item.columnName === 'productAttachment') {
            item.renderDetailCell = item.renderDetailForm = () => {
                return {
                    detailComp: ProductPicDetail,
                };
            };
            item.renderEditCell = item.renderEditForm = () => {
                return {
                    cellComp: ProductPicEdit,
                    editComp: ProductPicEdit,
                    setFormatter: (val) => {
                        if (!val || val.length === 0) return [{ text: '', value: '' }];
                        return val.map((item) => {
                            return { value: item.value, text: `${item.name}(${item.size})` };
                        });
                    },
                    getFormatter: (val) => {
                        if (!Array.isArray(val) || val.length === 0) return undefined;
                        // 过滤掉空数据
                        const newValue = val.filter((item) => {
                            return item.text || item.value || item.value === 0;
                        });
                        if (!newValue) {
                            return undefined;
                        }
                        return newValue.map((item) => {
                            let size = 0;
                            const text = item.text.replace(/\((\d+)\)$/, (s0, s1, s2) => {
                                size = s1;
                                return '';
                            });
                            return { value: item.value, name: text, size, ...checkoutFileType(item.value) };
                        });
                    },
                };
            };
        }
        item.cellClassName = getCellClass;
        return item;
    });
    return columns;
};
const Product = () => {
    const config = businessConfig[37];
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
    const modalTransferProduct = useRef(null);
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        fetchColumns();
    }, []);

    const [operateConfig, setOptConfig] = useState();
    useEffect(() => {
        fetchOperateConfig();
    }, []);

    const fetchColumns = useCallback(async () => {
        const res = await getColumnConfig({ tableId });
        if (res && res.success && res.data) {
            const arr = Array.isArray(res.data) ? res.data : [];
            setColumns(arr);
        }
    }, [tableId]);

    const onDragSorted = useCallback((newColumns) => {
        setColumns(newColumns);
    }, []);

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
        [tableId, fetchColumns],
    );

    const [dataSource, setDataSource] = useState([]);
    const [pageConfig, setPageConfig] = useState({
        pageNum: 1,
        pageSize: 50,
        total: 0,
    });
    const initialed = useRef();
    const [createDaysDiff, setCreateDaysDiff] = useState();
    useEffect(() => {
        if (initialed.current) {
            fetchDataSource({ pageNum: 1 });
        }
    }, [createDaysDiff]);
    const fetchDataSource = useCallback(
        async ({ pageNum }) => {
            await setLoading(true);
            const data = {
                pageNum: pageNum || pageConfig.pageNum,
                pageSize: pageConfig.pageSize,
            };
            if (createDaysDiff) {
                data.createDaysDiff = createDaysDiff;
            }
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
        [tableId, pageConfig.pageNum, pageConfig.pageSize, dataSource, createDaysDiff],
    );
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
    }, [tableId, fetchDataSource]);
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
        [tableId, operateConfig, fetchDataSource],
    );
    const onScroll = () => {
        if (pageConfig.pageNum * pageConfig.pageSize < pageConfig.total && !loading) {
            fetchDataSource({ pageNum: pageConfig.pageNum + 1 });
        }
    };
    const debounceScroll = _.debounce(onScroll, 400);

    const emitChangeCell = async ({ rowId, value }) => {
        const res = await addOrUpdateDataSource({ data: { tableId, id: rowId, value } });
        if (res && res.success) {
            onParentRowSync({ rowId });
        }
        return res;
    };

    const onParentRowSync = useCallback(
        async ({ rowId, value, operateType }) => {
            const updateOldIndex = dataSource.findIndex((item) => {
                return Number(item.id) === Number(rowId);
            });

            if (updateOldIndex > -1) {
                const res = await getDetail({ tableId, rowId });
                if (res && res.success && res.data) {
                    // 更新操作，只处理内存数据
                    const newDataSource = updateLineData(dataSource, {
                        index: updateOldIndex,
                        value: res.data,
                        operateType,
                        force: true,
                    });
                    setDataSource(newDataSource);
                }
            }
        },
        [setDataSource, dataSource],
    );
    const selfAddOrUpdateRow = useCallback(async ({ data, formValues, detailType }) => {
        if (detailType === 'addPage') {
            if (formValues.talent && formValues.talent.length > 0 && formValues.talent[0].text) {
                const airTableCellReferenceDtoList = [];
                for (let i = 0; i < formValues.talent.length; i++) {
                    const value = [];
                    ['talent', 'commissionRate', 'pitPrice'].map((key) => {
                        if (formValues[key]) {
                            value.push({
                                columnCode: key,
                                cellValueList: [formValues[key][i]],
                            });
                        }
                    });
                    airTableCellReferenceDtoList.push({
                        tableId: 40,
                        value,
                    });
                }
                data.value.push({
                    columnCode: 'talent',
                    airTableCellReferenceDtoList,
                });
            }
        }
        const res = await addOrUpdateDataSource({ data });
        return res;
    }, []);
    const onClickShowExpand = useCallback(
        (data) => {
            if (modalDetail && modalDetail.current) {
                modalDetail.current.showModal({ tableId, ...data });
            }
        },
        [modalDetail, tableId],
    );

    const onClickAddProduct = () => {
        if (modalDetail && modalDetail.current) {
            modalDetail.current.showModal({ tableId });
        }
    };
    const onClickImport = () => {
        window.open('product/import', '_self');
    };

    const onClickAddSession = async () => {
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
            modalTransferProduct.current.showModal(1, data);
        }
    };

    const [selectedRows, setSelectedRows] = useState([]);
    const onChangeRowSelection = (values) => {
        setSelectedRows(values);
    };

    const getFormatColumns = useCallback(
        (columns) => {
            let newColumns = formatColumns(columns);
            newColumns.map((item) => {
                if (
                    item.columnName === 'talent' ||
                    item.columnName === 'commissionRate' ||
                    item.columnName === 'pitPrice'
                ) {
                    item.cellRenderProps = {
                        onParentRowSync,
                    };
                }
            });
            return newColumns;
        },
        [onParentRowSync],
    );
    const memColumns = useMemo(() => {
        return getFormatColumns(columns);
    }, [columns, getFormatColumns]);
    const { filterConfig, sortConfig, groupConfig } = operateConfig || {};
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
                showIndex={true}
                showExpand={onClickShowExpand}
                cellEditable={checkPathname('/foreEnd/business/live/product/edit')}
                emitChangeCell={emitChangeCell}
                onScroll={debounceScroll}
                loading={loading}
                loadComp={<Loading loadingClassName={s.loading} />}
                canResized={true}
                canFixed={false}
                canSorted={false}
                onDragSorted={onDragSorted}
                cachedFeAttr={false}
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
                            label: '导入',
                            hidden: !checkPathname('/foreEnd/business/live/product/import'),
                            type: 'primary',
                            onClick: onClickImport,
                        },
                        {
                            label: '新增',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/live/product/add'),
                            onClick: onClickAddProduct,
                        },
                        {
                            label: '添加场次',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/live/product/addLive'),
                            onClick: onClickAddSession,
                        },
                        {
                            render: () => {
                                return (
                                    <Search
                                        className={s.search}
                                        filters={filterConfig}
                                        onSearch={onChangeOperateConfig}
                                        config={{
                                            colName: 'keyword',
                                            colChsName: '搜索',
                                            operationCode: 'CONTAIN',
                                        }}
                                    />
                                );
                            },
                        },
                    ],
                }}
                tableOperateConfig={{
                    buttonsGroup: [
                        {
                            render: () => {
                                return (
                                    <div className={s.totalContainer}>
                                        SKU共计：
                                        <span className={s.totalNum}>{pageConfig.total}</span>
                                    </div>
                                );
                            },
                        },
                        {
                            render: () => {
                                return (
                                    <FilterCreateTime
                                        // className={s.filterCreateTime}
                                        value={createDaysDiff}
                                        onSearch={(value) => {
                                            setCreateDaysDiff(value);
                                            initialed.current = true;
                                        }}
                                    />
                                );
                            },
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
                addOrUpdateDataSource={selfAddOrUpdateRow}
                delData={delData}
                emitChangeCell={emitChangeCell}
                formatColumns={getFormatColumns}
                noEdit={!checkPathname('/foreEnd/business/live/product/edit')}
                noDel={true}
            />
            <TransferProduct
                ref={modalTransferProduct}
                titleIndex={1}
                selectedRows={selectedRows}
                tableId={tableId}
                successCb={() => {
                    setSelectedRows([]);
                }}
            />
        </>
    );
};
export default Product;
