import React, { Component } from 'react';
import _ from 'lodash';
import { Popover, Button, Select } from 'antd';
import classNames from 'classnames';
import s from '../hide/index.less';
import styles from './index.less';
import sortIcon from '../../assets/sort.png';
import closeIcon from '../../assets/close.png';
import { ColumnProps } from '../interface';
import { Consumer } from '../context';

interface Props {
    columns: any;
    operate: any;
}
interface State {
    visible: boolean;
    sortConfig: any;
    temp: any;
}
/**
 * 操作栏显隐控制
 * 参数
 * @configs  操作栏配置
 * @columns  表头列表配置
 * @onChange 显隐变化回调
 */
export default class Sort extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visible: false,
            sortConfig: [],
            temp: {
                // 临时排序数据，不上传接口
                colName: undefined,
                colChsName: undefined,
                sortType: 'ASC',
            },
        };
    }

    componentDidMount() {
        const {
            operate: { value },
        } = this.props;
        this.setState({
            sortConfig: value && value.length > 0 ? value : [],
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        const oldSortConfig = this.props.operate.value;
        const newSortConfig = nextProps.operate.value;
        if (JSON.stringify(oldSortConfig) !== JSON.stringify(newSortConfig)) {
            this.setState({
                sortConfig: newSortConfig && newSortConfig.length > 0 ? newSortConfig : [],
                temp: {
                    colName: undefined,
                    colChsName: undefined,
                    sortType: 'ASC',
                },
            });
        }
    }

    getSortColumns = (columns: ColumnProps[]) => {
        return columns.filter((item) => {
            return !!item.sortFlag;
        });
    };

    toggleOption = () => {
        const { visible } = this.state;
        this.setState({
            visible: !visible,
        });
    };

    // 修改临时排序条件
    changeColName = (value: string) => {
        const { temp } = this.state;
        const { columns } = this.props;
        const sortColumnConfig = this.getSortColumns(columns);
        const sort: any = sortColumnConfig.find((item) => {
            return item.columnName === value;
        });
        const newTemp = _.assign({}, temp, { colName: value, colChsName: sort.columnChsName });
        this.addSortItem(newTemp);
    };

    // 修改临时排序顺序
    changeNewSortType = (value: string) => {
        const { temp } = this.state;
        const newTemp = _.assign({}, temp, { sortType: value });
        this.addSortItem(newTemp);
    };

    // 添加一条
    addSortItem = async (data: any) => {
        if (data.colName && data.sortType) {
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
    delSortItem = (index: number) => {
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
    changeSortKey = (index: number, value: any) => {
        const { sortConfig } = this.state;
        const { columns } = this.props;
        const sortColumnConfig = this.getSortColumns(columns);
        const temp = _.cloneDeep(sortConfig);
        temp[index].colName = value;
        const sort: any = sortColumnConfig.find((item) => {
            return item.columnName === value;
        });
        temp[index].colChsName = sort.columnChsName;
        this.onChange(temp);
    };

    // 改变已有排序顺序
    changeSortType = (index: number, value: any) => {
        const { sortConfig } = this.state;
        const temp = _.cloneDeep(sortConfig);
        temp[index].sortType = value;
        this.onChange(temp);
    };

    // 回调表格更改操作栏方法
    onChange = (config: any[]) => {
        const {
            operate: { onChange },
        } = this.props;
        if (typeof onChange === 'function') {
            onChange({ type: 'sortConfig', config });
        }
    };

    getFilterConfig = () => {
        const { sortConfig, temp } = this.state;
        const { columns } = this.props;
        const sortColumnConfig = this.getSortColumns(columns);
        const tempConfig = _.cloneDeep(sortColumnConfig);
        return tempConfig.map((item: any) => {
            item.disabled =
                sortConfig.some((sort: any) => {
                    return sort.colName === item.columnName;
                }) || temp.colName === item.columnName;
            return item;
        });
    };

    renderContent = (locale) => {
        const { sortConfig, temp } = this.state;
        const filterConfig = this.getFilterConfig();
        return (
            <div className={styles.optionsModal}>
                {sortConfig.map((item: any, i: number) => {
                    return (
                        <div key={i} className={styles.optionItem}>
                            <div className={styles.optionLeft}>
                                <Select
                                    value={item.colName}
                                    onChange={this.changeSortKey.bind(this, i)}
                                    style={{ width: '100%' }}
                                    placeholder={locale.select}
                                >
                                    {filterConfig.map((option) => {
                                        return (
                                            <Select.Option
                                                key={option.columnName}
                                                disabled={option.disabled}
                                                value={option.columnName}
                                            >
                                                {option.columnChsName}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </div>
                            <div className={styles.optionMid}>
                                <Button.Group>
                                    <Button
                                        className={
                                            item.sortType === 'ASC'
                                                ? classNames(styles.sortBtn, styles.primary)
                                                : styles.sortBtn
                                        }
                                        onClick={this.changeSortType.bind(this, i, 'ASC')}
                                    >
                                        {locale.sortASC}
                                    </Button>
                                    <Button
                                        className={
                                            item.sortType === 'DESC'
                                                ? classNames(styles.sortBtn, styles.primary)
                                                : styles.sortBtn
                                        }
                                        onClick={this.changeSortType.bind(this, i, 'DESC')}
                                    >
                                        {locale.sortDESC}
                                    </Button>
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
                    <div className={styles.optionItem} key={sortConfig.length + 3}>
                        <div className={styles.optionLeft}>
                            <Select
                                value={temp.colName}
                                placeholder={locale.select}
                                onChange={this.changeColName}
                                style={{ width: '100%' }}
                            >
                                {filterConfig.map((item) => {
                                    return (
                                        <Select.Option
                                            key={item.columnName}
                                            disabled={item.disabled}
                                            value={item.columnName}
                                        >
                                            {item.columnChsName}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className={styles.optionMid}>
                            <Button.Group>
                                <Button
                                    className={
                                        temp.sortType === 'ASC'
                                            ? classNames(styles.sortBtn, styles.primary)
                                            : styles.sortBtn
                                    }
                                    onClick={this.changeNewSortType.bind(this, 'ASC')}
                                >
                                    {locale.sortASC}
                                </Button>
                                <Button
                                    className={
                                        temp.sortType === 'DESC'
                                            ? classNames(styles.sortBtn, styles.primary)
                                            : styles.sortBtn
                                    }
                                    onClick={this.changeNewSortType.bind(this, 'DESC')}
                                >
                                    {locale.sortDESC}
                                </Button>
                            </Button.Group>
                        </div>
                    </div>
                )}
                <div className={styles.btns}>
                    <div
                        role="presentation"
                        className={classNames(styles.btn, styles.reset)}
                        onClick={this.resetSortItem}
                    >
                        {locale.sortReset}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { visible } = this.state;
        const {
            operate: { value },
        } = this.props;
        const len = value && value.length;
        let bg = '';
        if (len > 0) {
            bg = 'rgba(92,153,255,0.2)';
        }
        return (
            <Consumer>
                {({ locale }) => {
                    const txt = locale.sort === '排序' ? `${len}条排序` : `Sorted by ${len} fields`;
                    return (
                        <Popover
                            overlayClassName={s.popover}
                            placement="bottomLeft"
                            title={locale.sort}
                            content={this.renderContent(locale)}
                            visible={visible}
                            onVisibleChange={this.toggleOption}
                            trigger="click"
                        >
                            <div className={s.operateContainer} style={{ background: bg }}>
                                <img alt="" className={s.operateIcon} src={sortIcon} />
                                <span className={s.operateName}>{len > 0 ? txt : locale.sort}</span>
                            </div>
                        </Popover>
                    );
                }}
            </Consumer>
        );
    }
}
