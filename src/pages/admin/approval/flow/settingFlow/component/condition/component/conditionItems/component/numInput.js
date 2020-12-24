import React from 'react';
import Select from '@/ant_components/BISelect';
import Input from '@/ant_components/BIInput'

const consitions = [{ id: 1, name: '小于' }, { id: 2, name: '小于等于' }, { id: 3, name: '大于' }, { id: 4, name: '小于等于' }, { id: 5, name: '介于两个数之间' }];
class NumberInput extends React.Component {
    state = {
        value: this.props.value,
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.setState({ value: nextProps.value })
        }
    }
    render() {
        return (
            <div>
                <Select>
                    {consitions.map(item => (<Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>))}
                </Select>
            </div>
        )
    }
}