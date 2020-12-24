import React from 'react';
import _ from 'lodash';
// import HandleBehavior from 'apollo_form_pase';
import HandleBehavior from './handleBehavior';

const HehaviorHOC = (Com) => {
    class Index extends React.Component {
        state = {
            formData: [],
        };

        behaviorInstance = null;

        componentDidMount() {
            this.initFormData(this.props.formData);
        }

        initFormData = (formData) => {
            const newData = _.cloneDeep(formData);
            this.behaviorInstance = new HandleBehavior({
                formData: newData,
                changeCallBack: this.changeFormData,
                changeValue: this.changeValue,
            });
            this.behaviorInstance.initBehavior(this.props.value);
            this.setState({ formData: this.behaviorInstance.formData || [] });
        };

        handleBehavior = ({ currentValue: changedValues, componentData, eventType }) => {
            if (this.behaviorInstance.handleBehavior) {
                this.behaviorInstance.handleBehavior({
                    currentValue: changedValues,
                    componentData,
                    eventType,
                    formData: this.state.formData,
                });
            }
            this.setState({ formData: this.behaviorInstance.formData });
            return this.behaviorInstance.formData;
        };

        changeValue = (currentObj, targetObj = {}) => {
            let val = this.props.value || [];
            val = val.map((ls) => {
                if (ls.fieldId === targetObj.fieldId) {
                    return { ...ls, fieldValue: targetObj.fieldValue };
                }
                return { ...ls };
            });
            if (this.props.onChange) this.props.onChange(val);
        };

        onChange = (values, changedValues) => {
            if (this.props.onChange) this.props.onChange(values);
            const { formData } = this.state;
            const params = Object.keys(changedValues)[0];
            const componentData = formData.find((ls) => {
                return ls.name === params;
            }) || {};
            setTimeout(() => {
                this.handleBehavior({
                    currentValue: (
                        values.find((ls) => {
                            return ls.fieldId === componentData.id;
                        }) || {}
                    ).fieldValue,
                    componentData,
                    eventType: 'onChange',
                });
            }, 0);
        };

        changeFormData = (formData) => {
            this.setState({ formData });
        };

        UNSAFE_componentWillReceiveProps(nextProps) {
            if (JSON.stringify(nextProps.formData) !== JSON.stringify(this.props.formData)) {
                this.initFormData(nextProps.formData);
            }
        }

        render() {
            const { formData } = this.state;
            const { forwardedRef, ...rest } = this.props;
            return <Com {...rest} ref={forwardedRef} formData={formData} onChange={this.onChange} />;
        }
    }
    return React.forwardRef((props, ref) => {
        return <Index {...props} forwardedRef={ref} />;
    });
};
export default HehaviorHOC;
