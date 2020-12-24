import React from 'react';
import modalfy from '@/components/modalfy';
import { Form, message } from 'antd';
import ConditionsItem from './component/conditionItem';

const formItemLayout = {
    labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
    },
};

@modalfy
class setCondition extends React.Component {
    state = {
        conditions: []//定义条件,
    }
    componentDidMount() {
        this.initValue()
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.conditions) !== JSON.stringify(this.props.conditions)) {
            this.initValue(nextProps.conditions)
        }
    }
    //"OO开区间 CO前闭后开区间 CC闭区间 OC前开后闭区间 in 包含 not不包含" 
    initValue = (conditions = this.props.conditions) => {
        this.setState({ conditions });
    }
    getValue = (item) => {
        const conditions = this.state.conditions || [];
        return conditions.find(ls => ls.fieldName === item.name);
    }
    onChange = (data, name) => {
        let conditions = this.state.conditions || [];
        conditions = conditions.map(item => {
            return item.fieldName === data.fieldName ? data : item
        });
        this.setState({ conditions });
    }
    handleSubmit = (callback) => {
        const conditions = this.state.conditions || [];
        const obj = conditions.find(ls => !ls.value || !ls.value.length);
        if (obj) {
            message.warn('输入不完整');
            return
        }
        callback && callback(conditions)
    }

    renderItem = (item) => {
        return (
            <Form.Item label={item.title} key={item.name}>
                <ConditionsItem data={item} value={this.getValue(item)} fieldName={item.name} onChange={this.onChange} />
            </Form.Item>
        )
    }

    render() {
        const { variableList = [] } = this.props;
        return (
            <div id="com_generalForm">
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    {variableList.map(item => {
                        return this.renderItem(item)
                    })}

                </Form>


            </div>
        )
    }
}
export default setCondition;