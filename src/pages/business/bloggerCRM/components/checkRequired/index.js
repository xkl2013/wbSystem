import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Spin } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import BIButton from '@/ant_components/BIButton';
import SubmitButton from '@/components/SubmitButton';
import ApolloTable from '@/submodule/components/apolloTable';
import { getModuleFromTableId } from '@/config/business';
import { updateLineData } from '@/pages/business/live/utils';
import { addProductToLive, batchAddOrUpdate, moveProductToLive } from '@/pages/business/live/product/service';
import s from './index.less';

/**
 * 场次移至，不需要检验必填的情况（从低往高需检测，反之不检测）
 * @param cur           当前表
 * @param dest          目标表
 * @returns {boolean}
 */
const noNeedCheckRequired = (cur, dest) => {
    let arr = [];
    switch (cur) {
        case 28:
        case 34:
            arr = [28, 34];
            break;
        case 29:
        case 35:
            arr = [28, 34, 29, 35];
            break;
        case 30:
        case 36:
            arr = [28, 34, 29, 35, 30, 36];
            break;
        case 31:
        case 37:
            arr = [28, 34, 29, 35, 30, 36, 31, 37];
            break;
        default:
            break;
    }
    return arr.includes(dest);
};
/**
 * 检测单元格是否为空
 * @param rowData       行数据
 * @param columnName    检测的单元格key
 * @returns {boolean}
 */
const checkNull = (rowData, columnName) => {
    const data = rowData.find((item) => {
        return item.colName === columnName;
    });
    if (!data) {
        return true;
    }
    const { cellValueList } = data;
    // 没有值、空数组、数组有一个原生且元素中text、value都是空，三种情况都视为空数据
    return (
        !cellValueList
        || cellValueList.length === 0
        || (cellValueList.length === 1 && !cellValueList[0].text && !cellValueList[0].value)
    );
};
/**
 * 获取所选条目中有未完整填写的条目
 * @param data          需检测的数据列表
 * @param columns       必填列配置列表
 * @param first         是否时初始化检测
 * @returns {{lostRows: *不完整的行列, successRows: *成功的行, lostRowData: *不完整的行数据}}
 */
export const getLostRows = ({ data, columns, first }) => {
    // 不完整的数据，作为表格数据
    const lostRowData = [];
    // 不完整的行、列，作为检测依据
    const lostRows = [];
    // 完整数据的行ID，可直接执行当前操作
    const successRows = [];
    data.map((item) => {
        const lostCols = [];
        const lost = {};
        columns.map((temp) => {
            // 当前表中没有的字段补齐
            if (
                !item.rowData.some((x) => {
                    return x.colName === temp.columnName;
                })
            ) {
                item.rowData.push({
                    colName: temp.columnName,
                    cellValueList: [],
                });
            }
            if (checkNull(item.rowData, temp.columnName)) {
                lostCols.push(temp.columnName);
            }
        });
        if (lostCols.length > 0) {
            lost.lostCols = lostCols;
            lost.rowId = item.id;
            // 记录未填的行、列，实时更新
            lostRows.push(lost);
            if (first) {
                // 初始化时获取检测未通过数据作为表格数据
                lostRowData.push(item);
            }
        } else if (first) {
            // 初始化时获取检测通过的数据
            successRows.push(item.id);
        }
    });
    return {
        lostRows,
        lostRowData,
        successRows,
    };
};

/**
 * 检测结束时的提示
 * @param success       成功的行列表
 * @param total         总共的行
 * @param handleSubmit  成功回调
 */
function checkTip(success, total, handleSubmit) {
    if (success.length === total.length) {
        message.success('校验通过', 1, handleSubmit);
    } else {
        message.warning('请补充全部必填字段，才可进行下一步操作', 5);
    }
}

/**
 * 检测该table是否处于编辑状态
 * @param tableId
 * @returns {boolean}
 */
function checkEditing(tableId) {
    const doms = document.querySelectorAll(`.cellUnit.table_${tableId}`);
    let editing = false;
    if (doms) {
        for (let i = 0; i < doms.length; i++) {
            // 检测当前是否有编辑中的组件，没有则重置编辑框（因业务需求，可能直接删除掉当前编辑单元格的编辑状态）
            if (doms[i].getAttribute('data-editing-cell') === '1') {
                editing = true;
                break;
            }
        }
    }
    return editing;
}

function getSelectState(flag, tableId) {
    if (flag === 'initial') {
        if (tableId === 30 || tableId === 36) {
            return [{ text: '未排序', value: '3' }];
        }
        return [{ text: '待定', value: '2' }];
    }
    if (flag === 'pass') {
        if (tableId === 30 || tableId === 36) {
            return [{ text: '已排序', value: '4' }];
        }
        return [{ text: '通过', value: '1' }];
    }
}

/**
 * 该组件用于统一多种操作的必填字段校验流程（校验实际为前端校验，后端没有校验，因此为不安全校验）
 * 因人员流动，后端逻辑无法及时更新，操作流程由前端使用原有接口进行组合调用实现（会有逻辑中断无法回滚的bug）
 * 1、产品库商品添加（toLive+update）
 *      1、将商品添加到筛选表，返回商品id与筛选表中主键id映射map
 *      2、校验未通过数据，待用户补全后，根据1中map更新目标筛选表中的数据
 * 2、场次表商品移至（move+update）
 *      1、当前筛选表移到目标筛选表，商品筛选表后端实际为一张表，move操作只更新外键依赖关系，因此主键id不变
 *      2、校验未通过数据，待用户补全后，根据1中id更新目标筛选表中的数据
 * 3、场次表商品复制（toLive+update）
 *      1、根据productId（新增映射字段）找到产品库中商品，执行产品库商品添加操作
 * 4、场次表商品通过（update+update）
 *      1、更新状态字段，后端将执行通过操作（通过前后id不变）
 *      2、校验未通过数据，待用户补全后，根据1中id更新目标筛选表中的数据
 */
const CheckRequired = (props) => {
    const {
        selectedRows, curTableId, tableId, liveId, titleIndex, handleCancel, handleSubmit,
    } = props;
    const config = getModuleFromTableId(tableId);
    const { getColumnConfig, formatColumns, noEdit } = config;
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        if (tableId) {
            if (titleIndex === 2 || titleIndex === 3) {
                // 移动、复制存在不需检测的情况
                if (noNeedCheckRequired(curTableId, tableId)) {
                    if (titleIndex === 2) {
                        const successRows = selectedRows.map((item) => {
                            return item.id;
                        });
                        moveToLive(successRows);
                    } else {
                        copyToLive(selectedRows);
                    }
                } else {
                    fetchColumns();
                }
            } else {
                fetchColumns();
            }
        }
    }, [curTableId, tableId, selectedRows]);
    const fetchColumns = useCallback(async () => {
        const res = await getColumnConfig({ tableId });
        if (res && res.success && res.data) {
            const arr = Array.isArray(res.data) ? res.data : [];
            const filterColumns = arr
                .filter((item) => {
                    // 过滤出必填字段
                    return item.requiredFlag;
                })
                .map((item) => {
                    item.fixed = '';
                    item.showStatus = 1;
                    return item;
                });
            setColumns(filterColumns);
            initLostRows(filterColumns);
        }
    }, [tableId]);
    const [dataSource, setDataSource] = useState([]);
    const [rows, setLostRows] = useState([]);
    // 更新错误行
    const updateLostRows = (data) => {
        const { lostRows } = getLostRows({ data, columns });
        setLostRows(lostRows);
        // 强制table刷新
        setColumns([...columns]);
    };
    // 初始化
    const initLostRows = (columns) => {
        const { lostRows, lostRowData, successRows } = getLostRows({
            data: _.cloneDeep(selectedRows),
            columns,
            first: true,
        });
        setLostRows(lostRows);
        setDataSource(lostRowData);
        setColumns([...columns]);
        if (successRows.length > 0) {
            if (titleIndex === 1) {
                successToLive(successRows);
            } else if (titleIndex === 2) {
                moveToLive(successRows);
            } else if (titleIndex === 3) {
                const copyValues = selectedRows.filter((item) => {
                    return successRows.includes(item.id);
                });
                copyToLive(copyValues);
            } else if (titleIndex === 4) {
                updateToLive(successRows[0]);
            }
        }
    };

    // 将完整的数据直接插入场次
    const successToLive = async (ids, needReturn) => {
        const values = { businessProductIds: ids, businessLiveId: liveId, groupId: tableId };
        const res = await addProductToLive(values);
        if (res && res.success) {
            if (needReturn) {
                return res;
            }
            checkTip(values.businessProductIds, selectedRows, handleSubmit);
        }
    };
    // 将完整的数据直接移至场次
    const moveToLive = async (ids, needReturn) => {
        const values = { businessLiveProductIds: ids, businessLiveId: liveId, groupId: tableId };
        const res = await moveProductToLive(values);
        if (res && res.success) {
            if (needReturn) {
                return res;
            }
            checkTip(values.businessLiveProductIds, selectedRows, handleSubmit);
        }
    };
    // 复制操作（toLive+update）
    const copyToLive = async (values) => {
        const ids = values.map((item) => {
            return item.productId;
        });
        const resp = await successToLive(ids, true);
        if (resp && resp.success) {
            const data = [];
            values.map((item) => {
                const value = [];
                item.rowData.map((temp) => {
                    if (temp.colName !== 'selectState') {
                        value.push({
                            ...temp,
                            columnCode: temp.colName,
                        });
                        // temp.cellValueList = getSelectState('initial', tableId);
                    }
                });
                const one = {
                    businessLiveProductId: liveId,
                    tableId,
                    value,
                    id: resp.data[item.productId],
                };
                data.push(one);
            });
            const res = await batchAddOrUpdate(data);
            if (res && res.success) {
                checkTip(values, selectedRows, handleSubmit);
            }
        }
    };
    // 修改通过/已排序字段
    const updateToLive = async (id, needReturn) => {
        const { addOrUpdateDataSource } = getModuleFromTableId(curTableId);
        const value = [
            {
                columnCode: 'selectState',
                cellValueList: getSelectState('pass', curTableId),
            },
        ];
        const res = await addOrUpdateDataSource({
            data: { tableId: curTableId, businessLiveProductId: liveId, id, value },
        });
        if (res && res.success) {
            if (needReturn) {
                return res;
            }
            message.success('校验通过', 1, handleSubmit);
        }
    };
    // 通过操作两步更新
    const updateCurrTable = async (id, value) => {
        const { addOrUpdateDataSource } = getModuleFromTableId(curTableId);
        // 第一步执行通过操作
        const resp = await updateToLive(id, true);
        if (resp && resp.success) {
            // 第二步更新目标表中数据为最新数据
            const res = await addOrUpdateDataSource({
                data: { tableId, businessLiveProductId: liveId, id, value },
            });
            if (res && res.success) {
                message.success('校验通过', 1, handleSubmit);
            }
        }
    };
    // 表格单元格更新，本地操作数据，不调接口
    const emitChangeCell = async ({ rowId, value }) => {
        const updateOldIndex = dataSource.findIndex((item) => {
            return Number(item.id) === Number(rowId);
        });
        const lostRow = rows.find((item) => {
            return Number(item.rowId) === Number(rowId);
        });
        if (updateOldIndex > -1) {
            value.map((item) => {
                if (lostRow && lostRow.lostCols.includes(item.columnCode)) {
                    const updateItem = dataSource[updateOldIndex].rowData;
                    const index = updateItem.findIndex((temp) => {
                        return temp.colName === item.columnCode;
                    });
                    if (index === -1) {
                        // 原来没有的字段，新增
                        updateItem.push({
                            ...item,
                            colName: item.columnCode,
                        });
                        const addDataSource = updateLineData(dataSource, {
                            index: updateOldIndex,
                            value: { id: rowId, rowData: updateItem },
                            force: true,
                        });
                        setDataSource(addDataSource);
                        updateLostRows(addDataSource);
                        return;
                    }
                }
                // 已有字段更新操作，只处理内存数据
                const editDataSource = updateLineData(dataSource, {
                    index: updateOldIndex,
                    value: { rowData: [item] },
                });
                setDataSource(editDataSource);
                updateLostRows(editDataSource);
            });
        }
    };
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        if (submitting && rows.length === 0) {
            patchAdd();
        }
    }, [submitting, rows]);
    // 批量新增（未通过数据+补齐数据）
    const patchAdd = async () => {
        if (rows.length > 0) {
            if (rows.length === 1 && rows[0].lostCols.length === 1) {
                // 解决最后一个必填字段修改后未触发onBlur，直接点击提交的bug
                if (checkEditing(tableId)) {
                    setSubmitting(true);
                    return;
                }
            }
            message.warning('请补充全部必填字段，才可进行下一步操作', 5);
            return;
        }
        setSubmitting(false);
        let data = [];
        dataSource.map((item) => {
            const value = [];
            item.rowData.map((temp) => {
                // 修改操作不修改状态字段
                if (temp.colName !== 'selectState') {
                    // 产品新增场次时，不修改坑位费和佣金比例
                    if (!(titleIndex === 1 && (temp.colName === 'pitPrice' || temp.colName === 'commissionRate'))) {
                        value.push({
                            ...temp,
                            columnCode: temp.colName,
                        });
                    }
                }
            });
            const one = {
                businessLiveProductId: liveId,
                tableId,
                value,
                businessProductId: item.id,
            };
            // 复制操作需要根据productId建立关联（冗余字段，前端使用）
            if (titleIndex === 3) {
                one.businessProductId = item.productId;
            }
            data.push(one);
        });
        if (data.length === 0) {
            if (typeof handleSubmit === 'function') {
                handleSubmit();
            }
            return;
        }
        if (titleIndex === 4) {
            await updateCurrTable(dataSource[0].id, data[0].value);
            return;
        }
        const ids = data.map((item) => {
            return item.businessProductId;
        });
        let func = successToLive;
        if (titleIndex === 2) {
            func = moveToLive;
        }
        const resp = await func(ids, true);
        if (resp && resp.success) {
            data = data.map((item) => {
                return {
                    ...item,
                    // 移至时id不变，复制时id为新
                    id: titleIndex === 2 ? item.businessProductId : resp.data[item.businessProductId],
                };
            });
        }
        const res = await batchAddOrUpdate(data);
        if (res && res.success) {
            if (typeof handleSubmit === 'function') {
                handleSubmit();
            }
        }
    };
    // 动态更改表格错误样式
    const getCellClass = useCallback(
        ({ columnConfig, columnData, record }) => {
            if (columnConfig.readOnlyFlag) {
                return s.readonly;
            }
            if (columnData && columnData.dynamicCellConfigDTO && columnData.dynamicCellConfigDTO.readonlyFlag) {
                return s.readonly;
            }
            const lostRow = rows.find((item) => {
                return Number(item.rowId) === Number(record.id);
            });
            if (lostRow && lostRow.lostCols.includes(columnConfig.columnName)) {
                return s.error;
            }
        },
        [rows],
    );
    return (
        <div className={s.container}>
            <ApolloTable
                className={classNames(s.table, dataSource.length === 0 && s.hidden)}
                tableClassName={s.tableCls}
                tableId={tableId}
                columns={useMemo(() => {
                    const newCols = formatColumns(columns);
                    return newCols.map((item) => {
                        if (Number(item.columnType) === 3) {
                            item.columnAttrObj.getDetail = null;
                        }
                        item.cellClassName = getCellClass;
                        return item;
                    });
                }, [columns])}
                dataSource={dataSource}
                height={500}
                rowHeight={40}
                headerHeight={40}
                cellEditable={!noEdit}
                emitChangeCell={emitChangeCell}
            />
            {dataSource.length === 0 && (
                <div className={s.loading}>
                    <Spin />
                    <p className={s.loadingTip}>校验中...</p>
                </div>
            )}
            {dataSource.length > 0 && (
                <div className={s.btnContainer}>
                    <BIButton onClick={handleCancel} className={s.btnCls}>
                        上一步
                    </BIButton>
                    <SubmitButton onClick={patchAdd} type="primary" className={s.btnCls}>
                        提交
                    </SubmitButton>
                </div>
            )}
        </div>
    );
};
export default CheckRequired;
