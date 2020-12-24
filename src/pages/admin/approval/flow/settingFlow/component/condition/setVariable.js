import React from 'react';
import modalfy from '@/components/modalfy';
import CheckboxGroup from '@/ant_components/BICheckbox';
import { config } from './component/conditionItems/config';
import { message } from 'antd';

@modalfy
class AddCondition extends React.Component {
    state = {
        value: [],
    }
    componentDidMount() {
        this.initValue(this.props.value)
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initValue(nextProps.value);
        }
    }
    initValue = (value) => {
        this.setState({ value: value.map(ls => ls.name) })
    }
    onChange = (value, ops) => {
        this.setState({ value })
    }
    onSubmit = (callback) => {
        if (!this.state.value || !this.state.value.length) {
            message.warn('请选择变量');
            return;
        }
        const variableList = this.props.variableList || [];
        const newValue = this.state.value.map(ls => (variableList.find(item => item.name === ls) || {}));
        callback && callback(newValue);
    }

    render() {
        const data = this.props.variableList || [];
        const value = this.state.value || [];
        return (
            <div>
                <CheckboxGroup
                    value={value}
                    onChange={this.onChange}
                >
                    {data.map(item => (
                        <CheckboxGroup.Checkbox value={item.name} key={item.name}>{item.title}</CheckboxGroup.Checkbox>
                    ))}
                </CheckboxGroup>


            </div>
        )
    }
}
export default AddCondition
