import React from 'react';
import { Cascader } from 'antd';
import './style.less';

/*
 * Cascader 组件
 *
 * 基于原 ant Cascader
 * 只扩展自定义样式
 * */

class BICascader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: undefined,
        };
    }

    componentDidMount() {
        this.handleValue(this.props.value);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.handleValue(nextProps.value);
        }
    }

    onChange = (val, ops) => {
        const { label, value } = this.returnFieldNames();
        if (this.props.onChange) {
            const newValue = ops
                ? ops.map((item) => {
                    return {
                        value: item[value],
                        name: item[label],
                        ...item,
                    };
                })
                : ops;
            this.onSaveValue(val);
            this.props.onChange(newValue);
        }
    };

    handleValue = (values) => {
        const newValue = Array.isArray(values)
            ? values.map((item) => {
                return item.value ? item.value : item;
            })
            : values;
        this.onSaveValue(newValue);
    };

    onSaveValue = (value) => {
        this.setState({
            value,
        });
    };

    returnFieldNames = () => {
        const initFieldNames = { label: 'label', value: 'value', children: 'children' };
        const { fieldNames = initFieldNames } = this.props;
        return fieldNames;
    };

    render() {
        const { value } = this.state;
        return (
            <div className="BICascader">
                <Cascader {...this.props} onChange={this.onChange} value={value} />
            </div>
        );
    }
}

export default BICascader;
