import React from 'react';
import { Form, Popconfirm, message } from 'antd';
import BIInput from '@/ant_components/BIInput';
import BIRadio from '@/ant_components/BIRadio';
import styles from './styles.less';
const EditableContext = React.createContext({});
export class EditableCell extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            editing: false,
        };
        this.form = null;
        this.save = (record) => {
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (this.props.buttoncallback && this.props.buttoncallback.onsave) {
                        const newObj = { ...record, ...values };
                        if (!newObj.mobilePhone && !newObj.weixinNumber) {
                            message.warn('请填写手机号码或微信号码');
                            return;
                        }
                        this.props.buttoncallback.onsave(newObj);
                    }
                }
                else
                    return;
            });
        };
        this.handleDelete = (record) => {
            if (this.props.buttoncallback && this.props.buttoncallback.ondelete) {
                this.props.buttoncallback.ondelete(record);
            }
            else
                return;
        };
        this.renderComponent = (props) => {
            const { type, edittype, options, componentattr } = props;
            const isedit = edittype === 'add';
            switch (type) {
                case 'input':
                    return React.createElement(BIInput, Object.assign({}, componentattr, { disabled: !isedit, onInput: this.save, className: styles.input }));
                case 'radio':
                    return React.createElement(BIRadio, { disabled: !isedit }, options.map((item) => React.createElement(BIRadio.Radio, { value: Number(item.id), key: Number(item.id) }, item.name)));
                case 'button':
                    return null;
                default:
                    return null;
            }
        };
        this.renderButtonGroup = (props) => {
            const { type, buttongroup, record, edittype } = props;
            const isedit = edittype === 'add';
            if (type !== 'button')
                return null;
            return (React.createElement(React.Fragment, null, buttongroup.map((item) => {
                switch (item.id) {
                    case 'delete':
                        return (React.createElement(Popconfirm, { key: item.id, title: "\u786E\u5B9A\u5220\u9664\u8054\u7CFB\u4EBA\u5417?", onConfirm: this.handleDelete.bind(this, record) },
                            React.createElement("a", { style: { marginLeft: '10px' } }, "\u5220\u9664")));
                    case 'save':
                        return isedit ? React.createElement("a", { key: item.id, onClick: this.save.bind(this, record) }, "\u4FDD\u5B58") : null;
                    default:
                        return React.createElement("a", { key: item.id }, item.name);
                }
            })));
        };
        this.click = (form) => {
            console.log(form.getFieldsValue());
        };
        this.renderCell = (form) => {
            this.form = form;
            const { dataIndex, record, rules = [], type } = this.props;
            const component = this.renderComponent(this.props);
            const buttonGroup = this.renderButtonGroup(this.props);
            return (React.createElement(React.Fragment, null,
                React.createElement(Form.Item, { style: { margin: 0 }, key: dataIndex + record.key }, component ? form.getFieldDecorator(dataIndex, {
                    rules: [...rules],
                    initialValue: record[dataIndex],
                })(component) : null),
                React.createElement(Form.Item, { style: { margin: 0 }, key: dataIndex + record.key + 1 }, buttonGroup)));
        };
    }
    render() {
        const { editable, dataIndex, title, record, index, handleSave, children, type, ...restProps } = this.props;
        return (React.createElement(React.Fragment, null,
            React.createElement("td", Object.assign({}, restProps), editable || type === 'button' ? (React.createElement("span", { className: styles.editTableTd, key: dataIndex + record.key },
                React.createElement(EditableContext.Consumer, { key: dataIndex + record.key }, this.renderCell))) : (children))));
    }
}
function mapPropsToFields(props) {
    const { params } = props;
    const returnObj = {};
    if (!params || typeof params !== 'object')
        return returnObj;
    Object.keys(params).forEach(item => {
        returnObj[item] = Form.createFormField({
            value: params[item],
        });
    });
    return returnObj;
}
const EditableRow = ({ form, index, ...props }) => (React.createElement(EditableContext.Provider, { value: form, key: index },
    React.createElement("tr", Object.assign({}, props))));
export const EditableFormRow = Form.create({ name: 'Search_Form', mapPropsToFields })(EditableRow);
