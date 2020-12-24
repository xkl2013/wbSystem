import React, { Component } from 'react';
import { fromJS, Map, List, is } from 'immutable';
import { Popover, message, Tooltip } from 'antd';
import BISelect from '@/ant_components/BISelect';
import filterIcon from '@/assets/airTable/filter.png';
import closeIcon from '@/assets/airTable/close.png';
import { config } from '../../config';
import s from '../hide/index.less';
import styles from './index.less';

const TransType = ['2', '3', '4', '13', '14'];
/**
 * 操作栏过滤条件控制
 * 参数
 * @filterConfig        已有的过滤条件
 * @filterColumnConfig  可以过滤的配置项
 * @onChange            变化回调
 */
export default class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            filterConfig: props.filterConfig || [{}],
        };
    }

    componentDidMount() {
        const { filterConfig } = this.props;
        this.setState({
            filterConfig: filterConfig.length > 0 ? filterConfig : [{}],
        });
    }

    componentWillReceiveProps(nextProps) {
        const { filterConfig } = this.props;
        const x1 = fromJS(filterConfig);
        const x2 = fromJS(nextProps.filterConfig);
        if (!is(x1, x2)) {
            this.setState({
                filterConfig: nextProps.filterConfig.length > 0 ? nextProps.filterConfig : [{}],
            });
        }
    }

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
        const temp = List(filterConfig)
            .push({})
            .toJS();
        this.setState({
            filterConfig: temp,
        });
    };

    // 删除一条
    delFilterItem = (index) => {
        const { filterConfig } = this.state;
        let temp = List(filterConfig)
            .splice(index, 1)
            .toJS();
        this.onChange(temp);
        if (temp.length === 0) {
            temp = [{}];
        }
        this.setState({
            filterConfig: temp,
        });
    };

    // 改变筛选条件
    changeFilterKey = (index, value) => {
        const { filterConfig } = this.state;
        const { filterColumnConfig } = this.props;
        const filter = filterColumnConfig.find((item) => {
            return item.key === value;
        });
        const data = {
            colName: value,
            colChsName: filter.title,
            operationCode: filter.operator && filter.operator[0] && filter.operator[0].id,
            colValues: undefined,
        };
        const temp = List(filterConfig)
            .splice(index, 1, data)
            .toJS();
        this.setState({
            filterConfig: temp,
        });
    };

    // 改变筛选匹配条件
    changeFilterOperate = (index, value) => {
        const { filterConfig } = this.state;
        const data = Map(filterConfig[index])
            .set('operationCode', value)
            .toJS();
        const temp = List(filterConfig)
            .splice(index, 1, data)
            .toJS();
        this.setState({
            filterConfig: temp,
        });
    };

    // 改变筛选匹配值
    changeFilterValue = (index, value) => {
        const { filterConfig } = this.state;
        const data = Map(filterConfig[index])
            .set('colValues', value)
            .toJS();
        const temp = List(filterConfig)
            .splice(index, 1, data)
            .toJS();
        this.setState({
            filterConfig: temp,
        });
    };

    // 保存筛选匹配值
    saveFilterList = () => {
        const { filterConfig } = this.state;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < filterConfig.length; i++) {
            // 筛选条件值为undefined或[]或[{text:'',value:''}]都算空，不能提交
            if (
                !filterConfig[i].colName
                || !filterConfig[i].operationCode
                || filterConfig[i].colValues.length === 0
                || (!filterConfig[i].colValues && filterConfig[i].colValues !== 0)
                || (!filterConfig[i].colValues[0].text && filterConfig[i].colValues[0].text !== 0)
            ) {
                message.error('筛选条件不能为空');
                return;
            }
        }
        this.onChange(filterConfig);
    };

    // 回调表格更改操作栏方法
    onChange = (changedConfig) => {
        const { onChange, filterConfig } = this.props;
        const x1 = fromJS(changedConfig);
        const x2 = fromJS(filterConfig);
        if (!is(x1, x2)) {
            if (typeof onChange === 'function') {
                onChange({ type: 'filterConfig', config: changedConfig });
            }
        }
    };

    renderContent = () => {
        const { filterConfig } = this.state;
        const { filterColumnConfig } = this.props;
        return (
            <div className={styles.optionsModal}>
                {filterConfig.map((item, i) => {
                    let operateOptions = [];
                    let type = '1';
                    const filterItem = filterColumnConfig.find((temp) => {
                        return temp.key === item.colName;
                    });
                    if (filterItem) {
                        operateOptions = filterItem.operator;
                        type = String(filterItem.columnType);
                        filterItem.columnAttrObj.disabled = false;
                    }
                    if (TransType.includes(type)) {
                        type = '1';
                    }
                    const Comp = config[type] && config[type].component;
                    return (
                        <div key={i} className={styles.optionItem}>
                            <div className={styles.optionLeft}>
                                <BISelect
                                    value={item.colName || undefined}
                                    onChange={this.changeFilterKey.bind(this, i)}
                                    style={{ width: '100%' }}
                                    placeholder="请选择"
                                >
                                    {filterColumnConfig.map((option) => {
                                        return (
                                            <BISelect.Option key={option.columnName} value={option.columnName}>
                                                {option.columnChsName && option.columnChsName.length > 7 ? (
                                                    <Tooltip placement="topLeft" title={option.columnChsName}>
                                                        {option.columnChsName}
                                                    </Tooltip>
                                                ) : (
                                                    option.columnChsName
                                                )}
                                            </BISelect.Option>
                                        );
                                    })}
                                </BISelect>
                            </div>
                            <div className={styles.optionMid}>
                                <BISelect
                                    value={item.operationCode || undefined}
                                    placeholder="请选择"
                                    onChange={this.changeFilterOperate.bind(this, i)}
                                    style={{ width: '100%' }}
                                >
                                    {operateOptions.map((option) => {
                                        return (
                                            <BISelect.Option key={option.id} value={option.id}>
                                                {option.name}
                                            </BISelect.Option>
                                        );
                                    })}
                                </BISelect>
                            </div>
                            <div className={styles.optionRight}>
                                <Comp
                                    style={{ width: '100%' }}
                                    value={item.colValues || undefined}
                                    columnConfig={filterItem}
                                    onChange={this.changeFilterValue.bind(this, i)}
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
                <div className={styles.btns}>
                    <div role="presentation" className={styles.btn} onClick={this.addFilterLine}>
                        添加
                    </div>
                    <div role="presentation" className={styles.btn} onClick={this.saveFilterList}>
                        查询
                    </div>
                    <div role="presentation" className={styles.btn} onClick={this.resetFilterItem}>
                        重置
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { visible } = this.state;
        const { filterConfig } = this.props;
        const len = filterConfig.filter((item) => {
            return item.colName && item.operationCode && item.colValues && item.colValues.length > 0;
        }).length;
        let bg = '';
        if (len > 0) {
            bg = 'rgba(247,181,0,0.1)';
        }
        return (
            <Popover
                overlayClassName={s.popover}
                placement="bottomLeft"
                title="筛选条件"
                content={this.renderContent()}
                visible={visible}
                onVisibleChange={this.toggleOption}
                trigger="click"
            >
                <div className={s.operateContainer} style={{ background: bg }}>
                    <img alt="" className={s.operateIcon} src={filterIcon} />
                    <span className={s.operateName}>{len > 0 ? `${len}条筛选` : '筛选'}</span>
                </div>
            </Popover>
        );
    }
}
