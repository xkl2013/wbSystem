import React from 'react';
import styles from './styles.less';
import { Form } from 'antd';
import BIInput from '@/ant_components/BIInput';
import FormFilterButton from '@/components/formFilterButton';
const formJson = [[{
            key: 'name1',
            initValue: undefined,
            component: BIInput,
            className: styles.input,
            placeholder: '请输入名字',
        }, {
            key: 'name2',
            initValue: undefined,
            component: BIInput,
            className: styles.input,
            placeholder: '请输入岗位',
        }, {}, {}]];
class FilterForm extends React.Component {
    constructor() {
        super(...arguments);
        this.onSubmit = () => {
            console.log('提交');
        };
        this.onResert = () => {
            console.log('重置');
        };
        this.onRemoveItem = () => {
            console.log('删除');
        };
        this.renderInputitem = () => {
            const { getFieldDecorator } = this.props.form;
            return formJson.map((item, index) => {
                return (React.createElement("div", { className: styles.inputRowWrap, key: index }, item.map(((ls, num) => {
                    const { component, key, initValue, ...others } = ls;
                    return (React.createElement("span", { className: styles.inputItemCls, key: num }, !ls.component ? null : getFieldDecorator(ls.key, {
                        initialValue: ls.initValue,
                    })(React.createElement(ls.component, Object.assign({ key: key + ls.id, className: ls.className, placeholder: ls.placeholder || '请输入' }, others)))));
                }))));
            });
        };
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (React.createElement("div", { className: styles.formCotainer },
            React.createElement(Form, { layout: "inline", className: "ant-advanced-search-form" }, this.renderInputitem()),
            React.createElement("div", null,
                React.createElement(FormFilterButton, { onSubmit: this.onSubmit, onResert: this.onResert, onRemoveItem: this.onRemoveItem }))));
    }
}
export default Form.create({ name: 'horizontal_login' })(FilterForm);
