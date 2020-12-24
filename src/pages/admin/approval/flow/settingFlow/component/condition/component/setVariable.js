import React from 'react';
import modalfy from '@/components/modalfy';
import CheckboxGroup from '@/ant_components/BICheckbox';
import { config } from '../conditionItems/config';

@modalfy
class AddCondition extends React.Component {
    state = {
        selectItems: this.props.variableList || [],
    }
    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (JSON.stringify(nextProps.variableList) !== JSON.stringify(JSON.stringify(this.props.variableList))) {
            this.setState({ selectItems: nextProps.variableList });
        }
    }
    checkCondtions = () => {
        const dataSource = this.props.dataSource || {};
        const approvalForm = dataSource.approvalForm || {};
        const approvalFormFields = approvalForm.approvalFormFields || [];
        return approvalFormFields.filter(item => Object.keys(config).includes(item.type))
    }
    onChange = (selectItems, ops) => {
        this.setState({ selectItems })
    }
    getItems = () => {
        return this.state.selectItems || [];
    }
    render() {
        const data = this.checkCondtions();
        return (
            <div>
                <CheckboxGroup
                    value={this.state.selectItems}
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