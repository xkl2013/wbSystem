import React, { useState, useRef } from 'react';
import { Checkbox, message, Popover } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { config } from './base/config';
import { getFormat, setFormat } from './base';
import s from './Cell.less';
import { CellProps, CellDataProps } from './interface';
import FormHelper from '../utils/formHelper';
import expandIcon from '../assets/extend.png';
import { transferAttr } from './base/_utils/transferAttr';
import { emptyModel } from './base/_utils/setFormatter';
import { getGroupLevel } from '../utils/memCols';

enum EDIT_STATUS {
    'FREE', // 空闲
    'EDITING', // 编辑中
}
const Cell = (props: CellProps) => {
    const {
        columnConfig,
        cellClassName,
        cellStyle,
        record,
        columnData,
        value: cellData,
        emitChangeCell,
        columnIndex,
        rowIndex,
        paginationConfig,
        showIndex,
        showExpand,
        emptyPlaceholder,
        cellEditable,
        rowSelection,
        columns,
        contentMenu,
        onEmitMsg,
        tableId,
        maxPopHeight,
        renderFirstLeft,
        position,
    } = props;
    const {
        columnType,
        columnName,
        requiredFlag,
        renderDetailCell,
        renderEditCell,
        cellRenderProps,
        readOnlyFlag,
        columnAttrObj,
    } = columnConfig;
    const cellUnit = useRef(null);
    const [status, setStatus] = useState('detail');

    const resetEditStatus = () => {
        setStatus('detail');
        if (typeof onEmitMsg === 'function') {
            onEmitMsg({ status: EDIT_STATUS.FREE });
        }
    };

    const turnIntoEditStatus = (data: any) => {
        setStatus('edit');
        if (typeof onEmitMsg === 'function') {
            onEmitMsg({ ...data, status: EDIT_STATUS.EDITING });
        }
    };

    const changeCellData = (changedValue: any, option?: any) => {};
    /**
     *
     * @param changedValue  修改的值
     * @param optionValue   修改的原始数据
     * @param reset         是否重置编辑状态
     */
    const emitChangeCellData = (changedValue: any, optionValue: any, reset?: boolean) => {
        if (reset) {
            resetEditStatus();
            return;
        }
        let temp: CellDataProps[] = [];
        cellData &&
            cellData.map((item: CellDataProps) => {
                temp.push({ text: item.text, value: item.value });
            });
        if (temp.length === 0) {
            temp = emptyModel;
        }

        if (_.isEqual(temp, changedValue)) {
            resetEditStatus();
            return;
        }
        changeValue(changedValue, optionValue);
    };

    const changeValue = async (changedValue: any, optionValue: any) => {
        const extraData = FormHelper.changeTableData({
            item: columnConfig,
            changedKey: columnName,
            changedValue,
            originValue: optionValue,
        });
        extraData.push({
            columnCode: columnName,
            cellValueList: changedValue,
        });
        if (typeof emitChangeCell === 'function') {
            emitChangeCell({
                rowId: record.id,
                value: extraData,
            });
        }
        resetEditStatus();
    };
    // 添加行hover样式
    const onMouseEnter = () => {
        const doms = document.querySelectorAll(`.table_${tableId}.row_${rowIndex}`);
        doms.forEach((dom) => {
            dom.classList.add(s.hover);
        });
    };
    // 去除行hover样式
    const onMouseLeave = () => {
        const doms = document.querySelectorAll(`.table_${tableId}.row_${rowIndex}`);
        doms.forEach((dom) => {
            dom.classList.remove(s.hover);
        });
    };

    const renderFirst = () => {
        const { current = 1, pageSize = 20 } = paginationConfig || {};
        // 构造序号
        const getIndex = () => {
            if (typeof showIndex === 'function') {
                return showIndex(props);
            }
            return (current - 1) * pageSize + rowIndex + 1;
        };
        // 获取当前行在所选列表中的index
        const getCheckedIndex = () => {
            if (!rowSelection) {
                return -1;
            }
            const { selectedRows } = rowSelection;
            const index =
                selectedRows &&
                selectedRows.findIndex((item: any) => {
                    return item.id === record.id;
                });
            return index;
        };
        // 构造行复选框
        const getCheckbox = () => {
            const { selectedRows, onChange } = rowSelection;
            const index = getCheckedIndex();
            const checked = index > -1;
            const onToggle = () => {
                if (typeof onChange === 'function') {
                    const data = _.cloneDeep(selectedRows);
                    if (checked) {
                        data.splice(index, 1);
                    } else {
                        data.push(record);
                    }
                    onChange(data);
                }
            };
            return <Checkbox checked={checked} onClick={onToggle} />;
        };
        return (
            <div className={s.firstArea}>
                {rowSelection && (
                    <div className={classNames(s.checkbox, showIndex && s.hasNum, getCheckedIndex() > -1 && s.checked)}>
                        {getCheckbox()}
                    </div>
                )}
                {showIndex && (
                    <div
                        className={classNames(
                            s.num,
                            rowSelection && s.hasCheckbox,
                            getCheckedIndex() > -1 && s.checked,
                        )}
                    >
                        {getIndex()}
                    </div>
                )}
                {showExpand && (
                    <div className={s.expand}>
                        <img
                            onClick={showExpand.bind(null, { rowId: record.id, historyGroupId: record.historyGroupId })}
                            className={s.expandIcon}
                            alt=""
                            src={expandIcon}
                        />
                    </div>
                )}
                {renderFirstLeft && renderFirstLeft({ record })}
            </div>
        );
    };

    const selfRenderDetailCell = () => {
        // 数据为空
        let empty =
            !cellData ||
            cellData.length === 0 ||
            (cellData.length === 1 && !cellData[0].text && !cellData[0].value && cellData[0].value !== 0);
        let detailConfig;
        if (typeof renderDetailCell === 'function') {
            detailConfig = renderDetailCell({ cellData, rowData: record, columnConfig });
            const defaultConfig = config[String(columnType)];
            if (defaultConfig) {
                if (defaultConfig.getFormatter && !detailConfig.getFormatter) {
                    detailConfig.getFormatter = defaultConfig.getFormatter;
                }
                if (defaultConfig.setFormatter && !detailConfig.setFormatter) {
                    detailConfig.setFormatter = defaultConfig.setFormatter;
                }
            }
            empty = false;
        } else {
            detailConfig = config[String(columnType)] || config['1'];
        }
        if (Number(columnType) === 8) {
            empty = false;
        }
        const DetailComp: any = detailConfig.detailComp;

        const newProps = {
            ...(detailConfig.componentAttr || {}),
            ...(columnConfig.columnAttrObj || {}),
        };
        const transferColumn = transferAttr(columnType, newProps);

        const { dynamicCellConfigDTO } = columnData || {};
        // 不可编辑状态(无编辑权限、列只读、行锁定、单元格只读)
        const disabled =
            !cellEditable ||
            readOnlyFlag ||
            record.isLocked ||
            (dynamicCellConfigDTO && dynamicCellConfigDTO.readonlyFlag);
        transferColumn.disabled = disabled;
        const detail = (
            <div
                className={s.detailCell}
                onClick={() => {
                    if (disabled) {
                        return false;
                    }
                    // 获取当前节点的选中状态
                    const dom: any = cellUnit.current;
                    let selected = false;
                    if (dom && dom.getAttribute('data-selected-cell')) {
                        selected = dom.getAttribute('data-selected-cell') === '1';
                    }
                    if (selected) {
                        // 当前已选中，则进入编辑状态
                        turnIntoEditStatus({ rowId: record.id, columnCode: columnName });
                        if (dom) {
                            // 给当前dom添加编辑状态
                            dom.setAttribute('data-editing-cell', '1');
                        }
                    } else {
                        // 否则进入选中状态
                        if (dom) {
                            // 先清除所有dom的选中状态及样式
                            const doms: any = document.querySelectorAll(`.cellUnit.table_${tableId}`);
                            if (doms) {
                                doms.forEach((item: any) => {
                                    item.setAttribute('data-selected-cell', '0');
                                    item.classList.remove(s.selected);
                                });
                            }
                            // 给当前dom添加选中状态
                            dom.setAttribute('data-selected-cell', '1');
                            // 给当前dom添加选中样式
                            dom.classList.add(s.selected);
                        }
                    }
                }}
            >
                <div className={s.content}>
                    {empty ? (
                        emptyPlaceholder || '-'
                    ) : (
                        <DetailComp
                            value={cellData}
                            columns={columns}
                            rowData={record}
                            columnConfig={columnConfig}
                            componentAttr={transferColumn}
                            formatter={detailConfig.getFormatter}
                            cellRenderProps={cellRenderProps}
                            changeEdit={() => {
                                setStatus('edit');
                            }}
                        />
                    )}
                </div>
            </div>
        );

        return contentMenu ? (
            <Popover
                overlayClassName={s.menuPop}
                trigger="contextMenu"
                placement="rightTop"
                content={
                    <div role="presentation" className={s.menuContainer}>
                        {contentMenu.map((item: any, i: number) => {
                            return (
                                <div
                                    key={i}
                                    role="presentation"
                                    className={s.menu}
                                    onClick={item.onClick.bind(null, record)}
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                }
            >
                {detail}
            </Popover>
        ) : (
            detail
        );
    };

    const selfRenderEditCell = () => {
        let editConfig: any;
        if (typeof renderEditCell === 'function') {
            editConfig = renderEditCell({ cellData, rowData: record, columnConfig });
        } else {
            editConfig = config[String(columnType)] || config['1'];
        }

        const EditComp: any = editConfig.cellComp;
        const transferColumn = transferAttr(columnType, {
            ...(editConfig.componentAttr || {}),
            ...(columnConfig.columnAttrObj || {}),
        });
        const newProps = {
            ...(transferColumn || {}),
        };
        const width =
            columnIndex === 0 && position !== 'right' && record.groupLevel
                ? `${cellStyle.width - record.groupLevel * 16 - 50}px`
                : cellStyle.width;
        return (
            <div className={s.editCell} style={{ width }}>
                <EditComp
                    value={getFormat(editConfig, columnConfig, cellData)}
                    {...newProps}
                    columnConfig={columnConfig}
                    onChange={changeCellData}
                    rowData={record}
                    onEmitChange={(changedValue: any, optionValue: any, reset?: boolean) => {
                        // 校验必填项
                        if (requiredFlag && (!changedValue || changedValue.length === 0)) {
                            message.error('该字段为必填项');
                            resetEditStatus();
                            return;
                        }
                        // 校验规则
                        if (columnAttrObj.rules) {
                            for (let i = 0; i < columnAttrObj.rules.length; i++) {
                                const rule = columnAttrObj.rules[i];
                                if (rule.pattern && !rule.pattern.test(changedValue)) {
                                    message.error(rule.message || '请按正确格式填写');
                                    resetEditStatus();
                                    return;
                                }
                            }
                        }
                        const value = setFormat(editConfig, columnConfig, changedValue, optionValue);
                        emitChangeCellData(value, optionValue, reset);
                    }}
                    tableId={tableId}
                    rowId={record.id}
                    cellRenderProps={cellRenderProps}
                    style={{
                        minHeight: 40, //cellStyle.height,
                        borderRadius: 0,
                    }}
                    maxPopHeight={maxPopHeight}
                    autoFocus={true}
                    origin="table"
                />
            </div>
        );
    };
    const groupLevel = getGroupLevel(record.classList);
    const paddingLeft =
        columnIndex === 0 && position !== 'right' && record.groupLevel ? `${record.groupLevel * 16}px` : 0;
    return (
        <div
            className={classNames(
                s.cellContainer,
                `table_${tableId}`,
                `row_${rowIndex}`,
                `col_${columnIndex}`,
                cellClassName,
                ...(record.classList || []),
            )}
            style={{
                ...cellStyle,
                paddingLeft,
                paddingTop: `${groupLevel * 40}px`,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {record.classList && record.classList[0] && (
                <div
                    className={s.groupLevel}
                    style={{
                        top: 0,
                        paddingLeft: '16px',
                        background: groupLevel === 3 ? '#EEEEEE' : groupLevel === 2 ? '#EDEDED' : '#F7F9FA',
                    }}
                >
                    {columnIndex === 0 &&
                        position !== 'right' &&
                        record.groupConfig[0] &&
                        `${record.groupConfig[0].colChsName}:${record.groupTextArr[0]}`}
                </div>
            )}
            {record.classList && record.classList[1] && (
                <div
                    className={s.groupLevel}
                    style={{
                        top: record.classList[0] ? 40 : 0,
                        paddingLeft: '32px',
                        background: groupLevel === 3 ? '#F5F5F5' : '#F7F9FA',
                    }}
                >
                    {columnIndex === 0 &&
                        position !== 'right' &&
                        record.groupConfig[1] &&
                        `${record.groupConfig[1].colChsName}:${record.groupTextArr[1]}`}
                </div>
            )}
            {record.classList && record.classList[2] && (
                <div
                    className={s.groupLevel}
                    style={{
                        top: groupLevel === 3 ? 80 : groupLevel === 2 ? 40 : 0,
                        paddingLeft: '48px',
                        background: '#F7F9FA',
                    }}
                >
                    {columnIndex === 0 &&
                        position !== 'right' &&
                        record.groupConfig[2] &&
                        `${record.groupConfig[2].colChsName}:${record.groupTextArr[2]}`}
                </div>
            )}
            {columnIndex === 0 && position !== 'right' && renderFirst()}
            <div
                id={`cellUnit_${tableId}_${record.id}_${columnName}`}
                className={classNames(
                    s.cellData,
                    'cellUnit',
                    `table_${tableId}`,
                    `row_${rowIndex}`,
                    `col_${columnIndex}`,
                )}
                data-selected-cell="0"
                data-editing-cell="0"
                ref={cellUnit}
            >
                {status === 'detail' && selfRenderDetailCell()}
                {status === 'edit' && selfRenderEditCell()}
            </div>
        </div>
    );
};

export default Cell;
