import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Checkbox, Tooltip } from 'antd';
import _ from 'lodash';
import s from './Column.less';
import { ColumnProps } from './interface';

export default class TableColumn extends PureComponent<ColumnProps> {
    changeSort = (type: string) => {
        const { sortConfig = {}, columnName, columnChsName } = this.props;
        const { onChange } = sortConfig;
        if (typeof onChange === 'function') {
            const newSort = { colChsName: columnChsName, colName: columnName, sortType: type };
            onChange({ type: 'sortConfig', config: [newSort] });
        }
    };

    removeSort = () => {
        const { sortConfig = {}, columnName } = this.props;
        const { value, onChange } = sortConfig;
        if (typeof onChange === 'function') {
            const newArr = value.filter((item: any) => {
                return item.colName !== columnName;
            });
            onChange({ type: 'sortConfig', config: newArr });
        }
    };

    getCheckbox = () => {
        const { rowSelection, dataSource } = this.props;
        const { selectedRows, onChange } = rowSelection;
        let checked = false;
        if (dataSource.length > 0 && selectedRows.length > 0) {
            for (let i = 0; i < dataSource.length; i++) {
                if (
                    !selectedRows.some((item) => {
                        return item.id === dataSource[i].id;
                    })
                ) {
                    break;
                }
                if (i === dataSource.length - 1) {
                    checked = true;
                }
            }
        }
        const onToggle = () => {
            if (typeof onChange === 'function') {
                const data = _.cloneDeep(selectedRows);
                dataSource.map((item: any) => {
                    const index = data.findIndex((temp: any) => {
                        return temp.id === item.id;
                    });
                    if (checked) {
                        index > -1 && data.splice(index, 1);
                    } else {
                        index === -1 && data.push(item);
                    }
                });

                onChange(data);
            }
        };
        return <Checkbox checked={checked} onClick={onToggle} />;
    };

    render() {
        const {
            columnChsName,
            columnName,
            sortFlag,
            sortConfig,
            showIndex,
            columnIndex,
            questionText,
            remark,
            rowSelection,
            icon,
            required,
            leftMargin = 0,
        } = this.props;
        const { value = [] } = sortConfig || {};
        const sort = value.find((item: any) => {
            return item.colName === columnName;
        });
        const { sortType }: { sortType: string } = sort || {};
        let marginLeft: any = 0;
        if (columnIndex === 0 && (rowSelection || showIndex)) {
            marginLeft = `${leftMargin + 36}px`;
            if (!rowSelection) {
                marginLeft = `${leftMargin + 70}px`;
            }
        }
        const tip = remark || questionText;
        return (
            <div className={s.colContainer}>
                {rowSelection && columnIndex === 0 && <div className={s.checkbox}>{this.getCheckbox()}</div>}
                <div className={s.colBrief} style={{ marginLeft }}>
                    {icon && <div className={s.colIcon}>{icon()}</div>}
                    <span className={required ? classNames(s.colTitle, s.required) : s.colTitle}>
                        {columnChsName}
                        {tip && (
                            <Tooltip title={tip}>
                                <div className={s.tipContainer}>?</div>
                            </Tooltip>
                        )}
                    </span>
                    {sortConfig && !!sortFlag && (
                        <div className={s.sortArrowGroup}>
                            <div
                                className={sortType === 'ASC' ? classNames(s.upArrow, s.selected) : s.upArrow}
                                onClick={() => {
                                    if (sortType === 'ASC') {
                                        this.removeSort();
                                        return;
                                    }
                                    this.changeSort('ASC');
                                }}
                            />
                            <div
                                className={sortType === 'DESC' ? classNames(s.downArrow, s.selected) : s.downArrow}
                                onClick={() => {
                                    if (sortType === 'DESC') {
                                        this.removeSort();
                                        return;
                                    }
                                    this.changeSort('DESC');
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
