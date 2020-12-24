import React, { Component } from 'react';
import { Popover, message, Select } from 'antd';
import classNames from 'classnames';
import memoizeOne from 'memoize-one';
import { transferAttr } from '../base/_utils/transferAttr';
import { config } from '../base/config';
import { getFormat, setFormat } from '../base';
import s from '../hide/index.less';
import styles from './index.less';
import filterIcon from '../../assets/filter.png';
import closeIcon from '../../assets/close.png';
import { Consumer } from '../context';

const TransType = ['2', '3', '4', '13', '14', '15'];
interface Props {
    columns: any;
    operate: any;
}
interface State {
    visible: boolean;
    filterConfig: any;
}
/**
 * 操作栏过滤条件控制
 * 参数
 * @filterConfig        已有的过滤条件
 * @filterColumnConfig  可以过滤的配置项
 * @onChange            变化回调
 */
export default class Filter extends Component<Props, State> {
    getMemoFilterColumns: Function;

    constructor(props: Props) {
        super(props);
        this.state = {
            visible: false,
            filterConfig: [{}],
        };
        this.getMemoFilterColumns = memoizeOne(this.getFilterColumns);
    }

    componentDidMount() {
        const {
            operate: { value },
        } = this.props;
        this.setState({
            filterConfig: value && value.length > 0 ? value : [{}],
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        const oldFilterConfig = this.props.operate.value;
        const newFilterConfig = nextProps.operate.value;
        if (JSON.stringify(oldFilterConfig) !== JSON.stringify(newFilterConfig)) {
            this.setState({
                filterConfig: newFilterConfig && newFilterConfig.length > 0 ? newFilterConfig : [{}],
            });
        }
    }

    getFilterColumns = (columns: any[]) => {
        return columns
            .filter((item) => {
                return !!item.filterFlag;
            })
            .map((ls) => {
                return {
                    ...ls,
                    columnAttrObj: {
                        ...(ls.columnAttrObj || {}),
                        disabled: false,
                        autoFocus: false,
                    },
                };
            });
    };

    getFilterLen = (filterConfig: any[] = []) => {
        const { columns } = this.props;
        const filterColumnConfig = this.getMemoFilterColumns(columns);
        return filterConfig.filter((item) => {
            const filterItem = filterColumnConfig.find((temp: any) => {
                return temp.columnName === item.colName;
            });
            return filterItem && item.colName && item.operationCode && item.colValues && item.colValues.length > 0;
        }).length;
    };

    toggleOption = () => {
        const { visible } = this.state;
        this.setState({
            visible: !visible,
        });
    };

    // 重置
    resetFilterItem = () => {
        this.setState({
            filterConfig: [{}],
        });
        this.onChange([]);
    };

    // 添加一条
    addFilterLine = () => {
        const { filterConfig } = this.state;
        filterConfig.push({});
        this.setState({
            filterConfig,
        });
    };

    // 删除一条
    delFilterItem = (index: number) => {
        let { filterConfig } = this.state;
        filterConfig.splice(index, 1);
        if (filterConfig.length === 0) {
            filterConfig = [{}];
        }
        this.setState({
            filterConfig,
        });
    };

    // 改变筛选条件
    changeFilterKey = (index: number, value: any) => {
        const { filterConfig } = this.state;
        const { columns } = this.props;
        const filterColumnConfig = this.getFilterColumns(columns);
        const filter = filterColumnConfig.find((item) => {
            return item.columnName === value;
        });
        const data = {
            colName: value,
            colChsName: filter.columnChsName,
            operationCode: filter.operator && filter.operator[0] && filter.operator[0].id,
            colValues: undefined,
        };
        filterConfig.splice(index, 1, data);
        this.setState({
            filterConfig,
        });
    };

    // 改变筛选匹配条件
    changeFilterOperate = (index: number, value: any) => {
        const { filterConfig } = this.state;
        filterConfig[index].operationCode = value;
        this.setState({
            filterConfig,
        });
    };

    // 改变筛选匹配值
    changeFilterValue = (index: number, value: any) => {
        const { filterConfig } = this.state;
        filterConfig[index].colValues = value;
        this.setState({
            filterConfig,
        });
    };

    // 保存筛选匹配值
    saveFilterList = (locale) => {
        const { filterConfig } = this.state;
        for (let i = 0; i < filterConfig.length; i++) {
            // 筛选条件值为undefined或[]或[{text:'',value:''}]都算空，不能提交
            if (
                !filterConfig[i].colName ||
                !filterConfig[i].operationCode ||
                !filterConfig[i].colValues ||
                filterConfig[i].colValues.length === 0 ||
                (!filterConfig[i].colValues && filterConfig[i].colValues !== 0) ||
                (!filterConfig[i].colValues[0].text && filterConfig[i].colValues[0].text !== 0)
            ) {
                message.error(locale.filterEmpty);
                return;
            }
        }
        this.onChange(filterConfig);
        this.toggleOption();
    };

    // 回调表格更改操作栏方法
    onChange = (changedConfig: any[]) => {
        const {
            operate: { onChange },
        } = this.props;
        if (typeof onChange === 'function') {
            onChange({ type: 'filterConfig', config: changedConfig });
        }
    };

    renderContent = (locale) => {
        const { filterConfig } = this.state;
        const { columns } = this.props;
        const filterColumnConfig = this.getFilterColumns(columns);
        return (
            <div className={styles.optionsModal}>
                {filterConfig.map((item: any, i: number) => {
                    let operateOptions = [];
                    let type = '1';
                    const filterItem = filterColumnConfig.find((temp) => {
                        return temp.columnName === item.colName;
                    });
                    if (item.colName && !filterItem) {
                        return;
                    }
                    let newProps = {};
                    if (filterItem) {
                        operateOptions = filterItem.operator;
                        type = String(filterItem.columnType);
                        if (!config[type]) {
                            type = '1';
                        }
                        delete filterItem.columnAttrObj.maxLength;
                        const { columnAttrObj } = filterItem;
                        newProps = {
                            ...(config[type].componentAttr || {}),
                            ...(columnAttrObj || {}),
                        };
                    }
                    if (TransType.includes(type)) {
                        type = '1';
                    }
                    const Comp: any = config[type].editComp;

                    const transferColumn = transferAttr(type, newProps);
                    return (
                        <div key={i} className={styles.optionItem}>
                            <div className={styles.optionLeft}>
                                <Select
                                    value={item.colName || undefined}
                                    onChange={this.changeFilterKey.bind(this, i)}
                                    style={{ width: '100%' }}
                                    placeholder={locale.select}
                                >
                                    {filterColumnConfig.map((option) => {
                                        return (
                                            <Select.Option key={option.columnName} value={option.columnName}>
                                                {option.columnChsName}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </div>
                            <div className={styles.optionMid}>
                                <Select
                                    value={item.operationCode || undefined}
                                    placeholder={locale.select}
                                    onChange={this.changeFilterOperate.bind(this, i)}
                                    style={{ width: '100%' }}
                                >
                                    {operateOptions.map((option: any) => {
                                        return (
                                            <Select.Option key={option.id} value={option.id}>
                                                {option.name}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </div>
                            <div className={styles.optionRight}>
                                <Comp
                                    style={{ width: '100%' }}
                                    value={getFormat(config[type], filterItem, item.colValues)}
                                    {...transferColumn}
                                    columnConfig={filterItem || { columnAttrObj: { autoFocus: false } }}
                                    onChange={(value: any) => {
                                        return this.changeFilterValue(i, setFormat(config[type], filterItem, value));
                                    }}
                                />
                            </div>
                            <div
                                role="presentation"
                                className={styles.optionDel}
                                onClick={this.delFilterItem.bind(this, i)}
                            >
                                <img alt="" className={styles.delIcon} src={closeIcon} />
                            </div>
                        </div>
                    );
                })}
                <div className={styles.optionItem}>
                    <div role="presentation" className={styles.add} onClick={this.addFilterLine}>
                        {locale.filterAdd}
                    </div>
                </div>
                <div className={styles.btns}>
                    <div
                        role="presentation"
                        className={classNames(styles.btn, styles.search)}
                        onClick={this.saveFilterList.bind(null, locale)}
                    >
                        {locale.filterSearch}
                    </div>
                    <div
                        role="presentation"
                        className={classNames(styles.btn, styles.reset)}
                        onClick={this.resetFilterItem}
                    >
                        {locale.filterReset}
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
        const len = this.getFilterLen(value);
        let bg = '';
        if (len > 0) {
            bg = 'rgba(247,181,0,0.1)';
        }
        return (
            <Consumer>
                {({ locale }) => {
                    const txt = locale.filter === '筛选' ? `${len}条筛选` : `Filtered by ${len} fields`;
                    return (
                        <Popover
                            overlayClassName={s.popover}
                            placement="bottomLeft"
                            title={locale.filter}
                            content={this.renderContent(locale)}
                            visible={visible}
                            onVisibleChange={this.toggleOption}
                            trigger="click"
                        >
                            <div className={s.operateContainer} style={{ background: bg }}>
                                <img alt="" className={s.operateIcon} src={filterIcon} />
                                <span className={s.operateName}>{len > 0 ? txt : locale.filter}</span>
                            </div>
                        </Popover>
                    );
                }}
            </Consumer>
        );
    }
}
