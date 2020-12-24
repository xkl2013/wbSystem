import React from 'react';
import _ from 'lodash';
// import { Divider } from 'antd';
import { config } from './config';
import { getDetail } from './detail';
import { emptyModel } from './_utils/setFormatter';
import { transferAttr } from './_utils/transferAttr';

// 此方法为高阶组件,不应再render里面频繁调用,防止频繁实例化,带来性能上的浪费
/**
 *@params(type)  string    组件type
 *@return component
 */
export const getComponent = (type) => {
    const NodeObj = config[type] || {};
    const Node = NodeObj.component || null;
    if (!Node) {
        return;
    }
    const com = class extends React.Component {
        state = {
            value: undefined,
            columnConfig: {},
        };

        componentDidMount() {
            const { value, columnConfig } = this.props;
            this.setState({ value: this.getFormat(value), columnConfig: this.formatColumnConfig(columnConfig) });
        }

        componentWillReceiveProps(nextProps) {
            const { value, columnConfig } = this.props;
            if (JSON.stringify(nextProps.value) !== JSON.stringify(value)) {
                this.setState({ value: this.getFormat(nextProps.value) });
            }
            if (JSON.stringify(nextProps.columnConfig) !== JSON.stringify(columnConfig)) {
                this.setState({ columnConfig: this.formatColumnConfig(nextProps.columnConfig) });
            }
        }

        formatColumnConfig = (columnConfig) => {
            const { columnConfigCallback } = this.props;
            if (typeof columnConfigCallback === 'function') {
                const extraAttr = columnConfigCallback({ config: columnConfig, callback: this.getCallbackData }) || {};
                _.assign(columnConfig, { extraAttr });
            }
            return columnConfig;
        };

        getCallbackData = (value) => {
            this.onChange(value);
        };

        setFormat = (values) => {
            const { columnConfig } = this.state;
            const { columnAttrObj, columnType } = columnConfig || {};
            if (!values || values.length <= 0) return undefined;
            const value = values[0];
            if (!value && value !== 0) return undefined;
            const transferColumn = transferAttr(columnType, {
                ...(NodeObj.componentAttr || {}),
                ...(columnAttrObj || {}),
            });
            if (NodeObj.setFormatter) return NodeObj.setFormatter(value, transferColumn, values[1]);
            return value;
        };

        getFormat = (value) => {
            const { columnConfig } = this.state;
            const { columnAttrObj, columnType } = columnConfig || {};
            if (!value || !Array.isArray(value) || value.length <= 0) return undefined;
            const newValue = value.filter((item) => {
                return item.value || item.value === 0 || item.label || item.text;
            });
            const transferColumn = transferAttr(columnType, {
                ...(NodeObj.componentAttr || {}),
                ...(columnAttrObj || {}),
            });
            if (NodeObj.getFormatter) {
                return NodeObj.getFormatter(newValue, transferColumn);
            }
            return newValue;
        };

        onChange = (...arg) => {
            const { onChange, changeParams } = this.props;
            // 置空默认逻辑转换为约定格式
            const value = this.setFormat(arg) || emptyModel;
            if (typeof onChange === 'function') {
                onChange(value);
            }
            if (typeof changeParams === 'function') {
                // TODO:日期类arg有两个值
                changeParams(value, arg[0], typeof arg[1] === 'boolean' && arg[1]);
            }
        };

        render() {
            const { columnConfigCallback, ...others } = this.props;
            const { columnConfig, value } = this.state;
            const { columnAttrObj, columnType, extraAttr = {} } = columnConfig || {};
            const transferColumn = transferAttr(columnType, {
                ...(NodeObj.componentAttr || {}),
                ...(columnAttrObj || {}),
            });
            const newProps = {
                ...others,
                ...(transferColumn || {}),
            };
            return <Node {...newProps} {...extraAttr} value={value} onChange={this.onChange} />;
        }
    };
    com.Detail = getDetail(type);
    return com;
};
export default {
    getComponent,
};
