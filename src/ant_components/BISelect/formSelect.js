import React from 'react';
import { Select } from 'antd';
import './style.less';
const Option = Select.Option;
/*
* Select 组件
*
* 基于原 ant Select
* 只扩展自定义样式
* */

class BISelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: undefined,
        }
    }
    componentDidMount() {
        this.handleValue(this.props.value);
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.handleValue(nextProps.value);
        }
    }
    handleValue = (values) => {
        let newValue = undefined;
        if (Array.isArray(values)) {
            newValue = values.map(item => item.value ? item.value : item)
        } else if (typeof values === 'object') {
            const { value } = values;
            newValue = value
        } else {
            newValue = values
        }
        this.onSaveValue(newValue);
    }
    onSaveValue = (value) => {
        this.setState({
            value
        })
    }
    onChange = (val, ops) => {
        let newValue = undefined;
        if (Array.isArray(ops)) {
            newValue = ops.map(item => {
                const { props: { value, children } } = item;
                return { value, name: children }
            });
        } else if (typeof ops === 'object') {
            const { props: { value, children } } = ops;
            newValue = { value, name: children }
        } else {
            newValue = val
        }
        if (this.props.onChange) {
            this.props.onChange(newValue, ops)
        }
    }


    render() {
        const { value } = this.state;
        return (
            <span className='BISelect'>
                <Select {...this.props} onChange={this.onChange} value={value}>
                    {this.props.children}
                </Select>
            </span>
        );
    }
}

export { BISelect as default };
BISelect.Option = Option;