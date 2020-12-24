import React, { Component } from 'react';
import _ from 'lodash';
import { Popover, Button, Tooltip } from 'antd';
import BISelect from '@/ant_components/BISelect';
import BIButton from '@/ant_components/BIButton';
import sortIcon from '@/assets/airTable/sort.png';
import closeIcon from '@/assets/airTable/close.png';
import s from '../hide/index.less';
import styles from './index.less';

/**
 * 操作栏显隐控制
 * 参数
 * @configs  操作栏配置
 * @columns  表头列表配置
 * @onChange 显隐变化回调
 */
export default class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            sortConfig: props.sortConfig,
            sortColumnConfig: props.sortColumnConfig,
            temp: {
                // 临时排序数据，不上传接口
                colName: undefined,
                colChsName: undefined,
                sortType: 'ASC',
            },
        };
    }

    componentWillReceiveProps(nextProps) {
        const { sortConfig, sortColumnConfig } = this.props;
        if (sortConfig !== nextProps.sortConfig || sortColumnConfig !== nextProps.sortColumnConfig) {
            this.setState({
                sortConfig: nextProps.sortConfig,
                sortColumnConfig: nextProps.sortColumnConfig,
            });
        }
    }

    toggleOption = () => {
        const { visible } = this.state;
        this.setState({
            visible: !visible,
        });
    };

    // 修改临时排序条件
    changeColName = (value) => {
        const { sortColumnConfig, temp } = this.state;
        const sort = sortColumnConfig.find((item) => {
            return item.key === value;
        });
        const newTemp = _.assign({}, temp, { colName: value, colChsName: sort.title });
        this.addSortItem(newTemp);
    };

    // 修改临时排序顺序
    changeNewSortType = (value) => {
        const { temp } = this.state;
        const newTemp = _.assign({}, temp, { sortType: value });
        this.addSortItem(newTemp);
    };

    // 添加一条
    addSortItem = (data) => {
        if (data.colName && data.sortType) {
            this.setState({
                temp: {
                    colName: undefined,
                    sortType: 'ASC',
                },
            });
            const { sortConfig } = this.state;
            const temp = _.cloneDeep(sortConfig) || [];
            temp.push(data);
            // 条件填齐后回调保存
            this.onChange(temp);
        } else {
            this.setState({
                temp: data,
            });
        }
    };

    // 删除一条
    delSortItem = (index) => {
        const { sortConfig } = this.state;
        const temp = _.cloneDeep(sortConfig);
        temp.splice(index, 1);
        this.onChange(temp);
    };

    // 重置
    resetSortItem = () => {
        this.onChange([]);
    };

    // 改变已有排序条件
    changeSortKey = (index, value) => {
        const { sortConfig, sortColumnConfig } = this.state;
        const temp = _.cloneDeep(sortConfig);
        temp[index].colName = value;
        const sort = sortColumnConfig.find((item) => {
            return item.key === value;
        });
        temp[index].colChsName = sort.title;
        this.onChange(temp);
    };

    // 改变已有排序顺序
    changeSortType = (index, value) => {
        const { sortConfig } = this.state;
        const temp = _.cloneDeep(sortConfig);
        temp[index].sortType = value;
        this.onChange(temp);
    };

    // 回调表格更改操作栏方法
    onChange = (config) => {
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
            onChange({ type: 'sortConfig', config });
        }
    };

    getFilterConfig = () => {
        const { sortConfig, sortColumnConfig, temp } = this.state;
        const tempConfig = _.cloneDeep(sortColumnConfig);
        return tempConfig.map((item) => {
            const itemData = item;
            itemData.disabled = sortConfig.some((sort) => {
                return sort.colName === item.columnName;
            }) || temp.colName === item.columnName;
            return itemData;
        });
    };

    renderContent = () => {
        const { sortConfig, temp } = this.state;
        const filterConfig = this.getFilterConfig();
        return (
            <div className={styles.optionsModal}>
                {sortConfig.map((item, i) => {
                    return (
                        <div key={i} className={styles.optionItem}>
                            <div className={styles.optionLeft}>
                                <BISelect
                                    value={item.colName}
                                    onChange={this.changeSortKey.bind(this, i)}
                                    style={{ width: '100%' }}
                                >
                                    {filterConfig.map((option) => {
                                        return (
                                            <BISelect.Option
                                                key={option.columnName}
                                                disabled={option.disabled}
                                                value={option.columnName}
                                            >
                                                {option.columnChsName}
                                            </BISelect.Option>
                                        );
                                    })}
                                </BISelect>
                            </div>
                            <div className={styles.optionMid}>
                                <Button.Group>
                                    <BIButton
                                        className={styles.sortBtn}
                                        type={item.sortType === 'ASC' ? 'primary' : 'default'}
                                        onClick={this.changeSortType.bind(this, i, 'ASC')}
                                    >
                                        正序
                                    </BIButton>
                                    <BIButton
                                        className={styles.sortBtn}
                                        type={item.sortType === 'DESC' ? 'primary' : 'default'}
                                        onClick={this.changeSortType.bind(this, i, 'DESC')}
                                    >
                                        倒序
                                    </BIButton>
                                </Button.Group>
                            </div>
                            <div
                                className={styles.optionDel}
                                role="presentation"
                                onClick={this.delSortItem.bind(this, i)}
                            >
                                <img alt="" className={styles.delIcon} src={closeIcon} />
                            </div>
                        </div>
                    );
                })}
                {sortConfig.length < 3 && (
                    <div className={styles.optionItem}>
                        <div className={styles.optionLeft}>
                            <BISelect
                                value={temp.colName}
                                placeholder="请选择"
                                onChange={this.changeColName}
                                style={{ width: '100%' }}
                            >
                                {filterConfig.map((item) => {
                                    return (
                                        <BISelect.Option
                                            key={item.columnName}
                                            disabled={item.disabled}
                                            value={item.columnName}
                                        >
                                            {item.columnChsName && item.columnChsName.length > 7 ? (
                                                <Tooltip placement="topLeft" title={item.columnChsName}>
                                                    {item.columnChsName}
                                                </Tooltip>
                                            ) : (
                                                item.columnChsName
                                            )}
                                        </BISelect.Option>
                                    );
                                })}
                            </BISelect>
                        </div>
                        <div className={styles.optionMid}>
                            <Button.Group>
                                <BIButton
                                    className={styles.sortBtn}
                                    type={temp.sortType === 'ASC' ? 'primary' : 'default'}
                                    onClick={this.changeNewSortType.bind(this, 'ASC')}
                                >
                                    正序
                                </BIButton>
                                <BIButton
                                    className={styles.sortBtn}
                                    type={temp.sortType === 'DESC' ? 'primary' : 'default'}
                                    onClick={this.changeNewSortType.bind(this, 'DESC')}
                                >
                                    倒序
                                </BIButton>
                            </Button.Group>
                        </div>
                    </div>
                )}
                <div className={styles.btns}>
                    <div role="presentation" className={styles.btn} onClick={this.resetSortItem}>
                        重置
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { visible, sortConfig } = this.state;
        const len = sortConfig.length;
        let bg = '';
        if (len > 0) {
            bg = 'rgba(92,153,255,0.2)';
        }
        return (
            <Popover
                overlayClassName={s.popover}
                placement="bottomLeft"
                title="排序方式"
                content={this.renderContent()}
                visible={visible}
                onVisibleChange={this.toggleOption}
                trigger="click"
            >
                <div className={s.operateContainer} style={{ background: bg }}>
                    <img alt="" className={s.operateIcon} src={sortIcon} />
                    <span className={s.operateName}>{len > 0 ? `${len}条排序` : '排序'}</span>
                </div>
            </Popover>
        );
    }
}
