import React, { Component } from 'react';
import _ from 'lodash';
import { Popover } from 'antd';
import BISelect from '@/ant_components/BISelect';
import s from '../hide/index.less';
import styles from './index.less';
import groupIcon from '@/assets/airTable/group.png';
import closeIcon from '@/assets/airTable/close.png';

/**
 * 操作栏显隐控制
 * 参数
 * @configs  操作栏配置
 * @columns  表头列表配置
 * @onChange 显隐变化回调
 */
export default class SetGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            groupConfig: props.groupConfig,
            groupColumnConfig: props.groupColumnConfig,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { groupConfig, groupColumnConfig } = this.props;
        if (groupConfig !== nextProps.groupConfig || groupColumnConfig !== nextProps.groupColumnConfig) {
            this.setState({
                groupConfig: nextProps.groupConfig,
                groupColumnConfig: nextProps.groupColumnConfig,
            });
        }
    }

    toggleOption = () => {
        const { visible } = this.state;
        this.setState({
            visible: !visible,
        });
    };

    // 改变分组条件
    changeSortKey = (index, value) => {
        const { groupConfig, groupColumnConfig } = this.state;
        const temp = _.cloneDeep(groupConfig);
        temp[index].colName = value;
        const group = groupColumnConfig.find((item) => {
            return item.key === value;
        });
        temp[index].colChsName = group.title;
        this.onChange(temp);
    };

    // 添加一条
    addGroupItem = (value) => {
        const { groupConfig, groupColumnConfig } = this.state;
        const temp = _.cloneDeep(groupConfig) || [];
        const group = groupColumnConfig.find((item) => {
            return item.key === value;
        });
        temp.push({
            colName: value,
            colChsName: group.title,
            sortType: 'ASC',
        });
        this.onChange(temp);
    };

    // 删除一条
    delGroupItem = (index) => {
        const { groupConfig } = this.state;
        const temp = _.cloneDeep(groupConfig);
        temp.splice(index, 1);
        this.onChange(temp);
    };

    // 改变排序
    changeSortType = (index, value) => {
        const { groupConfig } = this.state;
        const temp = _.cloneDeep(groupConfig);
        temp[index].sortType = value;
        this.onChange(temp);
    };

    // 回调表格更改操作栏方法
    onChange = (config) => {
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
            onChange({ type: 'groupConfig', config });
        }
    };

    getFilterConfig = () => {
        const { groupConfig, groupColumnConfig } = this.state;
        const temp = _.cloneDeep(groupColumnConfig);
        return temp.map((item) => {
            const itemData = item;
            itemData.disabled = groupConfig.some((group) => {
                return group.colName === item.columnName;
            });
            return item;
        });
    };

    renderContent = () => {
        const { groupConfig } = this.state;
        const filterConfig = this.getFilterConfig();
        return (
            <div className={styles.optionsModal}>
                {groupConfig.map((item, i) => {
                    return (
                        <div key={i} className={styles.optionItem}>
                            <div className={styles.optionLeft}>{`${i > 0 ? '然后' : ''}按照`}</div>
                            <div className={styles.optionMid}>
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
                            <div className={styles.optionRight}>进行分组</div>
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
                    <div className={styles.optionItem}>
                        <div className={styles.optionLeft}>{`${groupConfig.length > 0 ? '然后' : ''}按照`}</div>
                        <div className={styles.optionMid}>
                            <BISelect
                                placeholder="请选择"
                                value={undefined}
                                onChange={this.addGroupItem}
                                style={{ width: '100%' }}
                            >
                                {filterConfig.map((item) => {
                                    return (
                                        <BISelect.Option
                                            key={item.columnName}
                                            disabled={item.disabled}
                                            value={item.columnName}
                                        >
                                            {item.columnChsName}
                                        </BISelect.Option>
                                    );
                                })}
                            </BISelect>
                        </div>
                        <div className={styles.optionRight}>进行分组</div>
                    </div>
                )}
                <div className={styles.btns} />
            </div>
        );
    };

    render() {
        const { visible, groupConfig } = this.state;
        const len = groupConfig.length;
        let bg = '';
        if (len > 0) {
            bg = 'rgba(30,201,50,0.1)';
        }
        return (
            <Popover
                overlayClassName={s.popover}
                placement="bottomLeft"
                title="分组查看"
                content={this.renderContent()}
                visible={visible}
                onVisibleChange={this.toggleOption}
                trigger="click"
            >
                <div className={s.operateContainer} style={{ background: bg }}>
                    <img alt="" className={s.operateIcon} src={groupIcon} />
                    <span className={s.operateName}>{len > 0 ? `${len}个分组` : '分组查看'}</span>
                </div>
            </Popover>
        );
    }
}
