import React, { Component } from 'react';
import _ from 'lodash';
import { Popover, Button, Select } from 'antd';
import classNames from 'classnames';
import s from '../hide/index.less';
import styles from './index.less';
import groupIcon from '../../assets/group.png';
import closeIcon from '../../assets/close.png';
import { ColumnProps } from '../interface';
import { Consumer } from '../context';

interface Props {
    columns: any;
    operate: any;
}
interface State {
    visible: boolean;
    groupConfig: any;
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
            groupConfig: [],
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
            groupConfig: value && value.length > 0 ? value : [],
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        const oldGroupConfig = this.props.operate.value;
        const newGroupConfig = nextProps.operate.value;
        if (JSON.stringify(oldGroupConfig) !== JSON.stringify(newGroupConfig)) {
            this.setState({
                groupConfig: newGroupConfig && newGroupConfig.length > 0 ? newGroupConfig : [],
                temp: {
                    colName: undefined,
                    colChsName: undefined,
                    sortType: 'ASC',
                },
            });
        }
    }

    getGroupColumns = (columns: ColumnProps[]) => {
        return columns.filter((item) => {
            return !!item.groupFlag;
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
        const groupColumnConfig = this.getGroupColumns(columns);
        const group: any = groupColumnConfig.find((item) => {
            return item.columnName === value;
        });
        const newTemp = _.assign({}, temp, { colName: value, colChsName: group.columnChsName });
        this.addGroupItem(newTemp);
    };

    // 修改临时排序顺序
    changeNewSortType = (value: string) => {
        const { temp } = this.state;
        const newTemp = _.assign({}, temp, { sortType: value });
        this.addGroupItem(newTemp);
    };

    // 添加一条
    addGroupItem = async (data: any) => {
        if (data.colName && data.sortType) {
            const { groupConfig } = this.state;
            const temp = _.cloneDeep(groupConfig) || [];
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
    delGroupItem = (index: number) => {
        const { groupConfig } = this.state;
        const temp = _.cloneDeep(groupConfig);
        temp.splice(index, 1);
        this.onChange(temp);
    };

    // 重置
    resetGroupItem = () => {
        this.onChange([]);
    };

    // 改变已有排序条件
    changeGroupKey = (index: number, value: any) => {
        const { groupConfig } = this.state;
        const { columns } = this.props;
        const groupColumnConfig = this.getGroupColumns(columns);
        const temp = _.cloneDeep(groupConfig);
        temp[index].colName = value;
        const group: any = groupColumnConfig.find((item) => {
            return item.columnName === value;
        });
        temp[index].colChsName = group.columnChsName;
        this.onChange(temp);
    };

    // 改变已有排序顺序
    changeGroupType = (index: number, value: any) => {
        const { groupConfig } = this.state;
        const temp = _.cloneDeep(groupConfig);
        temp[index].sortType = value;
        this.onChange(temp);
    };

    // 回调表格更改操作栏方法
    onChange = (config: any[]) => {
        const {
            operate: { onChange },
        } = this.props;
        if (typeof onChange === 'function') {
            onChange({ type: 'groupConfig', config });
        }
    };

    getFilterConfig = () => {
        const { groupConfig, temp } = this.state;
        const { columns } = this.props;
        const groupColumnConfig = this.getGroupColumns(columns);
        const tempConfig = _.cloneDeep(groupColumnConfig);
        return tempConfig.map((item: any) => {
            item.disabled =
                groupConfig.some((group: any) => {
                    return group.colName === item.columnName;
                }) || temp.colName === item.columnName;
            return item;
        });
    };

    renderContent = (locale) => {
        const { groupConfig, temp } = this.state;
        const filterConfig = this.getFilterConfig();
        return (
            <div className={styles.optionsModal}>
                {groupConfig.map((item: any, i: number) => {
                    return (
                        <div key={i} className={styles.optionItem}>
                            <div className={styles.optionLeft}>
                                <Select
                                    value={item.colName}
                                    onChange={this.changeGroupKey.bind(this, i)}
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
                                        onClick={this.changeGroupType.bind(this, i, 'ASC')}
                                    >
                                        {locale.sortASC}
                                    </Button>
                                    <Button
                                        className={
                                            item.sortType === 'DESC'
                                                ? classNames(styles.sortBtn, styles.primary)
                                                : styles.sortBtn
                                        }
                                        onClick={this.changeGroupType.bind(this, i, 'DESC')}
                                    >
                                        {locale.sortDESC}
                                    </Button>
                                </Button.Group>
                            </div>
                            <div
                                className={styles.optionDel}
                                role="presentation"
                                onClick={this.delGroupItem.bind(this, i)}
                            >
                                <img alt="" className={styles.delIcon} src={closeIcon} />
                            </div>
                        </div>
                    );
                })}
                {groupConfig.length < 3 && (
                    <div className={styles.optionItem} key={groupConfig.length + 3}>
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
                        onClick={this.resetGroupItem}
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
                    const txt = locale.group === '分组' ? `${len}条分组` : `Grouped by ${len} fields`;
                    return (
                        <Popover
                            overlayClassName={s.popover}
                            placement="bottomLeft"
                            title={locale.group}
                            content={this.renderContent(locale)}
                            visible={visible}
                            onVisibleChange={this.toggleOption}
                            trigger="click"
                        >
                            <div className={s.operateContainer} style={{ background: bg }}>
                                <img alt="" className={s.operateIcon} src={groupIcon} />
                                <span className={s.operateName}>{len > 0 ? txt : locale.group}</span>
                            </div>
                        </Popover>
                    );
                }}
            </Consumer>
        );
    }
}
