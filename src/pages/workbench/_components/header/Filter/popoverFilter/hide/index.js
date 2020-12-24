import React, { Component } from 'react';
import { Switch, Popover } from 'antd';
import { fromJS, is } from 'immutable';
import Icon from '@/submodule/components/IconFont';
import s from './index.less';
import { checkoutVisible } from '../../_utils';
/**
 * 操作栏显隐控制
 * 参数
 * @configs  操作栏配置
 * @columns  表头列表配置
 * @onChange 显隐变化回调
 */
export default class Hide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            originConditions: props.originConditions || [],
        };
    }

    componentWillReceiveProps(nextProps) {
        const { originConditions } = this.props;
        const x1 = fromJS(originConditions);
        const x2 = fromJS(nextProps.originConditions);
        if (!is(x1, x2)) {
            this.setState({
                originConditions: nextProps.originConditions,
            });
        }
    }

    toggleOption = (bol) => {
        if (!bol) {
            const x1 = fromJS(this.state.originConditions);
            const x2 = fromJS(this.props.originConditions);
            if (!is(x1, x2) && this.props.setHideConfig) {
                this.props.setHideConfig(this.state.originConditions);
            }
        }
    };

    onChange = (checked, key) => {
        let { originConditions } = this.state;
        originConditions = originConditions.map((item) => {
            if (item.fieldName === key) {
                return {
                    ...item,
                    fieldConstraint: JSON.stringify({
                        visibleFlag: checked ? '1' : '2',
                    }),
                };
            }
            return item;
        });
        this.setState({ originConditions });
    };

    renderContent = () => {
        const { originConditions } = this.state;
        return (
            <div className={s.optionsModal}>
                <div className={s.optionList}>
                    {originConditions.map((item) => {
                        return (
                            <div key={item.fieldName} role="presentation" className={s.optionItem}>
                                <Switch
                                    checked={checkoutVisible(item)}
                                    size="small"
                                    onChange={(checked) => {
                                        return this.onChange(checked, item.fieldName);
                                    }}
                                />
                                <span className={s.optionName}>{item.fieldChsName}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    render() {
        return (
            <Popover
                overlayClassName={s.popover}
                placement="topLeft"
                content={this.renderContent()}
                onVisibleChange={this.toggleOption}
                trigger="click"
            >
                <span className={s.addBtn}>
                    <Icon iconFontType="iconxinzeng" />
                    {' '}
添加筛选条件
                </span>
            </Popover>
        );
    }
}
