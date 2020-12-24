import React from 'react';
import styles from './styles.less';
import { Form } from 'antd';
import BIInput from '@/ant_components/BIInput';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BICheckbox from '@/ant_components/BICheckbox';
import { STAFF_STATUS, EMPLOY_TYPE, JOB_POSITION, RESIDENCS_TYPE, SEX_TYPE } from '@/utils/enum';
import FormFilterButton from '@/components/form-FilterButton2';
import OrgTreeSelect from '@/components/orgTreeSelect';
import _ from 'lodash';
import moment from 'moment';
const { BIRangePicker } = BIDatePicker;
const formJson = [[{
            key: 'userName',
            initValue: undefined,
            component: OrgTreeSelect,
            componentAttr: {
                className: styles.input,
                placeholder: '请输入名字',
                mode: 'user'
            }
        }, {
            key: 'employeePosition',
            initValue: undefined,
            component: BIInput,
            componentAttr: {
                className: styles.input,
                placeholder: '请输入岗位',
            }
        }, {
            key: 'userDepartmentId',
            initValue: undefined,
            component: OrgTreeSelect,
            componentAttr: {
                className: styles.input,
                placeholder: '请输入部门',
                mode: 'org'
            },
            componentChildren: null,
        }, {}], [{
            key: 'employeeContractStart',
            initValue: undefined,
            component: BIRangePicker,
            componentAttr: {
                className: styles.input,
                placeholder: ['合同开始开始日期', '合同开始结束日期'],
            }
        }, {
            key: 'employeeContractEnd',
            initValue: undefined,
            component: BIRangePicker,
            componentAttr: {
                className: styles.input,
                placeholder: ['合同结束开始日期', '合同结束结束日期'],
            }
        }, {
            key: 'employeeEmploymentDate',
            initValue: undefined,
            component: BIRangePicker,
            componentAttr: {
                className: styles.input,
                placeholder: ['入职开始日期', '入职结束日期'],
            }
        }, {
            key: 'employeeLeaveDate',
            initValue: undefined,
            component: BIRangePicker,
            componentAttr: {
                className: styles.input,
                placeholder: ['离职开始日期', '离职结束日期'],
            },
            componentChildren: null,
        }]];
function formatUser(obj) {
    let name = obj.label;
    if (typeof name != 'string') {
        name = obj.label.props.children;
    }
    return { id: obj.value, name };
}
function formatArr(arr, options) {
    let temp = [];
    arr.map((key) => {
        temp.push({ id: key, name: options.find((item) => item.id == key).name });
    });
    return temp;
}
function formatForm(formData) {
    // console.log(formData)
    let result = [];
    Object.keys(formData).map((key) => {
        if (!formData[key]) {
            return;
        }
        switch (key) {
            case 'userName':
            case 'userDepartmentId':
                result.push({ key, value: formatUser(formData[key]) });
                break;
            case 'employeeStatusList':
                result.push({ key, value: formatArr(formData[key], STAFF_STATUS) });
                break;
            case 'employeeEmploymentFormList':
                result.push({ key, value: formatArr(formData[key], EMPLOY_TYPE) });
                break;
            case 'employeePositionLevelList':
                result.push({ key, value: formatArr(formData[key], JOB_POSITION) });
                break;
            case 'employeeHouseholdTypeList':
                result.push({ key, value: formatArr(formData[key], RESIDENCS_TYPE) });
                break;
            case 'userGenderList':
                result.push({ key, value: formatArr(formData[key], SEX_TYPE) });
                break;
            case 'employeeContractStart':
            case 'employeeContractEnd':
            case 'employeeEmploymentDate':
            case 'employeeLeaveDate':
                let temp = [];
                formData[key].map((time, index) => {
                    temp.push({ id: index, name: moment(time).format('YYYY-MM-DD') });
                });
                result.push({ key, value: temp });
                break;
            default:
                result.push({ key, value: formData[key] });
                break;
        }
    });
    return result;
}
function removeItem(formData, removeItem) {
    // console.log(formData)
    let data = _.assign({}, formData);
    let item = data[removeItem.key];
    if (Array.isArray(item)) {
        if (moment.isMoment(item[0])) {
            data[removeItem.key] = undefined;
            // item.splice(removeItem.id, 1);
        }
        else {
            let index = item.findIndex((t) => t == removeItem.id);
            if (index > -1) {
                item.splice(index, 1);
            }
        }
    }
    else {
        data[removeItem.key] = undefined;
    }
    return data;
}
class FilterForm extends React.Component {
    constructor() {
        super(...arguments);
        this.onSubmit = () => {
            this.props.form.validateFields((err, fieldsValue) => {
                if (err)
                    return;
                this.onChangeParams(fieldsValue);
            });
        };
        this.onResert = () => {
            console.log('重置');
            if (this.props.onChangeParams) {
                this.props.onChangeParams({});
            }
        };
        this.onRemoveItem = (values) => {
            const { params } = this.props;
            let newData = removeItem(params, values);
            if (this.props.onChangeParams) {
                this.props.onChangeParams(newData);
            }
        };
        this.onChangeParams = (values) => {
            if (this.props.onChangeParams) {
                this.props.onChangeParams(values);
            }
        };
        this.renderInputitem = () => {
            const { getFieldDecorator } = this.props.form;
            return formJson.map((item, index) => {
                return (React.createElement("div", { className: styles.inputRowWrap, key: index }, item.map(((ls, num) => {
                    const { component, key, initValue, componentChildren, componentAttr = {}, ...others } = ls;
                    return (React.createElement("span", { className: styles.inputItemCls, key: key + num }, !ls.component ? null : getFieldDecorator(ls.key, {
                        initialValue: ls.initValue,
                    })(React.createElement(ls.component, Object.assign({ key: key + ls.id, className: ls.className, placeholder: ls.placeholder || '请输入' }, componentAttr, others), componentChildren ? componentChildren : null))));
                }))));
            });
        };
    }
    render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        return (React.createElement("div", { className: styles.formCotainer },
            React.createElement(Form, { layout: "inline", className: "ant-advanced-search-form" },
                this.renderInputitem(),
                React.createElement("div", { className: styles.selectRowWrap },
                    React.createElement("span", { className: styles.itemLabel }, "\u5458\u5DE5\u72B6\u6001:"),
                    React.createElement("span", { className: styles.checkboxGroup }, getFieldDecorator('employeeStatusList', {
                        initialValue: undefined,
                    })(React.createElement(BICheckbox, { name: "radiogroup", onChange: (value) => {
                            console.log(value);
                        } }, STAFF_STATUS.map((item) => React.createElement(BICheckbox.Checkbox, { key: item.id, value: item.id, className: styles.radio }, item.name)))))),
                React.createElement("div", { className: styles.selectRowWrap },
                    React.createElement("span", { className: styles.itemLabel }, "\u8058\u7528\u5F62\u5F0F:"),
                    React.createElement("span", { className: styles.checkboxGroup }, getFieldDecorator('employeeEmploymentFormList', {
                        initialValue: undefined,
                    })(React.createElement(BICheckbox, { name: "radiogroup" }, EMPLOY_TYPE.map((item) => React.createElement(BICheckbox.Checkbox, { key: item.id, value: item.id, className: styles.radio }, item.name)))))),
                React.createElement("div", { className: styles.selectRowWrap },
                    React.createElement("span", { className: styles.itemLabel }, "\u804C\u522B:"),
                    React.createElement("span", { className: styles.checkboxGroup }, getFieldDecorator('employeePositionLevelList', {
                        initialValue: undefined,
                    })(React.createElement(BICheckbox, { name: "radiogroup" }, JOB_POSITION.map((item) => React.createElement(BICheckbox.Checkbox, { key: item.id, value: item.id, className: styles.radio }, item.name)))))),
                React.createElement("div", { className: styles.selectRowWrap },
                    React.createElement("span", { className: styles.itemLabel }, "\u6237\u53E3\u6027\u8D28:"),
                    React.createElement("span", { className: styles.checkboxGroup }, getFieldDecorator('employeeHouseholdTypeList', {
                        initialValue: undefined,
                    })(React.createElement(BICheckbox, { name: "radiogroup" }, RESIDENCS_TYPE.map((item) => React.createElement(BICheckbox.Checkbox, { key: item.id, value: item.id, className: styles.radio }, item.name)))))),
                React.createElement("div", { className: styles.selectRowWrap },
                    React.createElement("span", { className: styles.itemLabel }, "\u6027\u522B:"),
                    React.createElement("span", { className: styles.checkboxGroup }, getFieldDecorator('userGenderList', {
                        initialValue: undefined,
                    })(React.createElement(BICheckbox, { name: "radiogroup" }, SEX_TYPE.map((item) => React.createElement(BICheckbox.Checkbox, { key: item.id, value: item.id, className: styles.radio }, item.name)))))),
                React.createElement("div", { className: styles.selectRowWrap },
                    React.createElement("span", { className: styles.itemLabel }, "\u5E74\u9F84:"),
                    React.createElement("span", { className: styles.checkboxGroup },
                        getFieldDecorator('ageMin', {
                            initialValue: undefined,
                        })(React.createElement(BIInput, { className: styles.ageInput, placeholder: '\u8BF7\u8F93\u5165' })),
                        React.createElement("span", { className: styles.line }),
                        getFieldDecorator('ageMax', {
                            initialValue: undefined,
                        })(React.createElement(BIInput, { className: styles.ageInput, placeholder: '\u8BF7\u8F93\u5165' }))))),
            React.createElement("div", null,
                React.createElement(FormFilterButton, { onSubmit: this.onSubmit, onResert: this.onResert, onRemoveItem: this.onRemoveItem, chooseItems: formatForm(getFieldsValue()) }))));
    }
}
function onFieldsChange(props, fields) {
    if (props.onChange) {
        const params = {};
        Object.keys(fields).forEach(item => {
            const { value } = fields[item];
            params[item] = value;
        });
        props.onChange(params);
    }
}
function mapPropsToFields(props) {
    const { params } = props;
    const returnObj = {};
    if (!params || typeof params !== 'object')
        return returnObj;
    Object.keys(params).forEach(item => {
        let value = params[item];
        if (Array.isArray(params[item])) {
            value = params[item].slice();
        }
        returnObj[item] = Form.createFormField({
            value
        });
    });
    return returnObj;
}
function onValuesChange(props, changedValues, allValues) {
    props.formChange(allValues);
}
export default Form.create({ name: 'horizontal_login', mapPropsToFields, onValuesChange })(FilterForm);
