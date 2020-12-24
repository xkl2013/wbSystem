import React from 'react';
import { Form, Popconfirm, message } from 'antd';
import { any } from 'prop-types';
import BIInput from '@/ant_components/BIInput';
import BIRadio from '@/ant_components/BIRadio';
import styles from './styles.less';

const EditableContext = React.createContext({});

interface TableCeilProps {
    editable: boolean,
    dataIndex?: any,
    title?: string,
    record?: any,
    index?: number,
    handleSave: Function,
    edittype: string,
    rules: any,
    type: string,
    buttoncallback: any,
}
export class EditableCell extends React.Component<TableCeilProps> {
    state = {
        editing: false,
    };
    form: any = null;
    save = (record: any) => {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                if (this.props.buttoncallback && this.props.buttoncallback.onsave) {
                    const newObj = { ...record, ...values };
                    if (!newObj.mobilePhone && !newObj.weixinNumber) { message.warn('请填写手机号码或微信号码'); return }
                    this.props.buttoncallback.onsave(newObj);
                }
            } else return;
        });
    }
    private handleDelete = (record: any) => {
        if (this.props.buttoncallback && this.props.buttoncallback.ondelete) {
            this.props.buttoncallback.ondelete(record);
        } else return;
    }
    renderComponent = (props: any) => {
        const { type, edittype, options, componentattr } = props;
        const isedit = edittype === 'add';
        switch (type) {
            case 'input':
                return <BIInput {...componentattr} disabled={!isedit} onInput={this.save} className={styles.input} />
            case 'radio':
                return <BIRadio disabled={!isedit}>
                    {options.map((item: any) => < BIRadio.Radio value={Number(item.id)} key={Number(item.id)}>{item.name}</ BIRadio.Radio>)}
                </BIRadio>
            case 'button':
                return null;
            default:
                return null;
        }

    }
    renderButtonGroup = (props: any) => {
        const { type, buttongroup, record, edittype } = props;
        const isedit = edittype === 'add';
        if (type !== 'button') return null;
        return (
            <>
                {buttongroup.map((item: any) => {
                    switch (item.id) {
                        case 'delete':
                            return (
                                <Popconfirm key={item.id} title="确定删除联系人吗?" onConfirm={this.handleDelete.bind(this, record)}>
                                    <a style={{ marginLeft: '10px' }}>删除</a>
                                </Popconfirm>
                            )
                        case 'save':
                            return isedit ? <a key={item.id} onClick={this.save.bind(this, record)}>保存</a> : null;
                        default:
                            return <a key={item.id}>{item.name}</a>
                    }
                })}


            </>
        )

    }
    click = (form: any) => {
        console.log(form.getFieldsValue())
    }
    renderCell = (form: any) => {
        this.form = form;
        const { dataIndex, record, rules = [], type } = this.props;
        const component = this.renderComponent(this.props);
        const buttonGroup = this.renderButtonGroup(this.props);
        return (
            <>
                <Form.Item style={{ margin: 0 }} key={dataIndex + record.key}>
                    {component ? form.getFieldDecorator(dataIndex, {
                        rules: [...rules],
                        initialValue: record[dataIndex],
                    })(component) : null}

                </Form.Item>
                <Form.Item style={{ margin: 0 }} key={dataIndex + record.key + 1}>

                    {buttonGroup}
                </Form.Item>
            </>
        )
    }
    render() {
        const { editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children, type, ...restProps } = this.props;
        return (
            <>
                <td {...restProps}>
                    {editable || type === 'button' ? (
                        <span className={styles.editTableTd} key={dataIndex + record.key}><EditableContext.Consumer key={dataIndex + record.key}>{this.renderCell}</EditableContext.Consumer></span>
                    ) : (
                            children
                        )}
                </td>
            </>
        );
    }
}


function mapPropsToFields(props: any) {
    const { params } = props
    const returnObj: any = {};
    if (!params || typeof params !== 'object') return returnObj;
    Object.keys(params).forEach(item => {
        returnObj[item] = Form.createFormField({
            value: params[item],
        });
    })
    return returnObj
}



const EditableRow = ({ form, index, ...props }: any) => (
    <EditableContext.Provider value={form} key={index}>
        <tr {...props} />
    </EditableContext.Provider>
);
export const EditableFormRow = Form.create({ name: 'Search_Form', mapPropsToFields })(EditableRow);
