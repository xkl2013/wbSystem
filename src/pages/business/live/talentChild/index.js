/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import businessConfig from '@/config/business';
import { getChildDataSource } from './service';
import IconFont from '@/components/CustomIcon/IconFont';
import ApolloTable from '@/submodule/components/apolloTable';
import Loading from '@/ant_components/BISpin';
import s from '@/pages/business/live/session/index.less';
import { commonFormatColumns, updateLineData } from '@/pages/business/live/utils';
import ModalDetail from '../detail';
import selfStyle from './index.less';
import { message } from 'antd';
import Operate from './operate';

export const formatColumns = (columns, from) => {
    columns = commonFormatColumns(columns, businessConfig[51]);
    if (from !== 'session' && columns.length > 0 && columns[columns.length - 1].columnName !== 'operate') {
        columns.push({
            columnName: 'operate',
            columnChsName: '操作',
            hideScope: 'EDIT,DETAIL,ADD',
            enableStatus: 1,
            showStatus: 1,
            readOnlyFlag: 1,
            renderDetailCell: () => {
                return {
                    detailComp: Operate,
                };
            },
            width: 80,
            cellClassName: () => {
                return '';
            },
        });
    }
    return columns;
};
const Product = (props) => {
    const { parentRowId, onParentRowSync, form, getInstanceDetail, from } = props;
    const config = businessConfig[51];
    const {
        tableId,
        getColumnConfig,
        getDataSource,
        addOrUpdateDataSource,
        getDetail,
        delData,
        interfaceName,
        isShowComment,
        commentSort,
        name,
        columnWidth,
    } = config;
    const modalDetail = useRef(null);
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        fetchColumns();
    }, []);

    const fetchColumns = useCallback(async () => {
        const res = await getColumnConfig({ tableId });
        if (res && res.success && res.data) {
            const arr = Array.isArray(res.data) ? res.data : [];
            setColumns(arr);
        }
    }, [tableId]);
    const [dataSource, setDataSource] = useState([]);
    const [pageConfig, setPageConfig] = useState({
        pageNum: 1,
        pageSize: 30,
        total: 0,
    });
    const getInitDataSource = useCallback(() => {
        if (form && columns.length > 0) {
            const parentData = form.getFieldsValue();
            const list = [];
            if (parentData.talent && parentData.talent.length > 0 && parentData.talent[0].text) {
                for (let i = 0; i < parentData.talent.length; i++) {
                    const rowData = [];
                    columns.map((col) => {
                        const key = col.columnName;
                        if (parentData[key]) {
                            rowData.push({
                                colName: key,
                                cellValueList: [parentData[key][i]],
                            });
                        }
                    });
                    list.push({
                        id: i + 1,
                        rowData,
                    });
                }
            }
            setDataSource(list);
        }
    }, [columns]);
    useEffect(() => {
        if (!parentRowId) {
            getInitDataSource();
        }
    }, [parentRowId, getInitDataSource]);
    const fetchDataSource = useCallback(
        async ({ pageNum }) => {
            if (!parentRowId) {
                return;
            }
            await setLoading(true);
            const data = {
                pageNum: pageNum || pageConfig.pageNum,
                pageSize: pageConfig.pageSize,
                parentProductId: parentRowId,
            };
            let func = getDataSource;
            if (from === 'session') {
                func = getChildDataSource;
            }
            const res = await func({ tableId, data });
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
        [tableId, pageConfig.pageNum, pageConfig.pageSize, dataSource],
    );
    useEffect(() => {
        fetchDataSource({ pageNum: 1 });
    }, []);
    const onScroll = () => {
        if (pageConfig.pageNum * pageConfig.pageSize < pageConfig.total && !loading) {
            fetchDataSource({ pageNum: pageConfig.pageNum + 1 });
        }
    };
    const debounceScroll = _.debounce(onScroll, 400);

    const emitChangeCell = async ({ rowId, value }) => {
        selfAddOrUpdateLine({ data: { tableId, id: rowId, value } });
    };

    const onClickAddProduct = () => {
        if (modalDetail && modalDetail.current) {
            modalDetail.current.showModal({ tableId });
        }
    };

    const selfAddOrUpdateLine = async ({ data }) => {
        if (!parentRowId) {
            const updateOldIndex = dataSource.findIndex((item) => {
                return Number(item.id) === Number(data.id);
            });
            let newDataSource = dataSource;
            if (updateOldIndex > -1) {
                // 更新操作，只处理内存数据
                newDataSource = updateLineData(dataSource, {
                    index: updateOldIndex,
                    value: { id: data.id, rowData: data.value },
                });
            } else {
                // 新增操作
                let id = 1;
                if (dataSource.length > 0) {
                    id = dataSource[dataSource.length - 1].id + 1;
                }
                const rowData = data.value.map((item) => {
                    return { ...item, colName: item.columnCode };
                });
                newDataSource = updateLineData(dataSource, {
                    value: { id, rowData },
                    operateType: 'add',
                    insert: 'after',
                });
            }
            setDataSource(newDataSource);

            let parentData = {};
            newDataSource.map((item) => {
                item.rowData.map((temp) => {
                    if (temp.colName === 'talent' && !temp.cellValueList[0].value) {
                        temp.cellValueList[0].value = temp.cellValueList[0].text;
                    }
                    if (parentData[temp.colName]) {
                        parentData[temp.colName].push(temp.cellValueList[0]);
                    } else {
                        parentData[temp.colName] = [temp.cellValueList[0]];
                    }
                });
            });
            if (form) {
                form.setFieldsValue(parentData);
            }
            return {
                success: true,
            };
        }
        data.value.map((temp) => {
            if (temp.columnCode === 'talent' && !temp.cellValueList[0].value) {
                temp.cellValueList[0].value = temp.cellValueList[0].text;
            }
            return temp;
        });
        const res = await addOrUpdateDataSource({
            data: {
                ...data,
                parentRowId,
            },
        });
        if (res && res.success) {
            message.success('操作成功');
            fetchDataSource({ pageNum: 1 });
            if (typeof onParentRowSync === 'function') {
                onParentRowSync({ rowId: parentRowId, operateType: 'edit' });
            }
            if (typeof getInstanceDetail === 'function') {
                getInstanceDetail({ rowId: parentRowId, tableId: 26 });
            }
        }
        return res;
    };

    const selfDelLine = async ({ data }) => {
        if (!parentRowId) {
            const updateOldIndex = dataSource.findIndex((item) => {
                return Number(item.id) === Number(data.id);
            });
            let newDataSource = dataSource;
            if (updateOldIndex > -1) {
                // 更新操作，只处理内存数据
                newDataSource = updateLineData(dataSource, { index: updateOldIndex, operateType: 'del' });
            }
            setDataSource(newDataSource);
            let parentData = {};
            newDataSource.map((item) => {
                item.rowData.map((temp) => {
                    if (parentData[temp.colName]) {
                        parentData[temp.colName].push(temp.cellValueList[0]);
                    } else {
                        parentData[temp.colName] = [temp.cellValueList[0]];
                    }
                });
            });
            if (form) {
                form.setFieldsValue(parentData);
            }
            return {
                success: true,
            };
        }
        if (dataSource.length === 1) {
            message.error('至少保留一条数据');
            return;
        }
        const res = await delData({
            data: {
                ...data,
                tableId,
                parentRowId,
            },
        });
        if (res && res.success) {
            message.success('操作成功');
            fetchDataSource({ pageNum: 1 });
            if (typeof onParentRowSync === 'function') {
                onParentRowSync({ rowId: parentRowId, operateType: 'edit' });
            }
            if (typeof getInstanceDetail === 'function') {
                getInstanceDetail({ rowId: parentRowId, tableId: 26 });
            }
        }
        return res;
    };
    const getFormatColumns = useCallback(
        (columns) => {
            let newColumns = formatColumns(columns, from);
            if (newColumns.length > 0 && newColumns[newColumns.length - 1].columnName === 'operate') {
                newColumns[newColumns.length - 1].cellRenderProps = {
                    onDel: selfDelLine,
                };
            }
            return newColumns;
        },
        [selfDelLine, from],
    );
    const memColumns = useMemo(() => {
        return getFormatColumns(columns);
    }, [columns, getFormatColumns]);
    return (
        <>
            <ApolloTable
                tableId={tableId}
                className={selfStyle.table}
                tableClassName={selfStyle.innerTable}
                rowHeight={40}
                headerHeight={40}
                columnWidth={columnWidth}
                columns={memColumns}
                dataSource={dataSource}
                cellEditable={from !== 'session'}
                emitChangeCell={emitChangeCell}
                loading={loading}
                loadComp={<Loading loadingClassName={s.loading} />}
                onScroll={debounceScroll}
            />
            {from === 'session' || dataSource.length >= 5 ? null : (
                <div className={selfStyle.addContainer} onClick={onClickAddProduct}>
                    <IconFont className={selfStyle.addIcon} type="iconxinzeng" />
                    <span className={selfStyle.addTip}>添加意向主播</span>
                </div>
            )}
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
                addOrUpdateDataSource={selfAddOrUpdateLine}
                delData={delData}
                formatColumns={getFormatColumns}
                noEdit={false}
                noDel={true}
            />
        </>
    );
};

export default Product;
