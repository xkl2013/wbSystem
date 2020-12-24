/**
 *@author   zhangwenshuai
 *@date     2019-06-22 16:28
 **/


'use strict';
//库/框架
import React, {Component} from 'react';
//组件
import BITable from '@/ant_components/BITable';
import BIButton from '@/ant_components/BIButton';
import TableItem from '../RenderItem';
import {message, Modal} from "antd";
//样式
import s from './index.less';

//工具
function renderTitle(editable, required, title) {
    return editable && required ? <div className={s.requireTitle}>{title}</div> :
        <div className={s.noRequireTitle}>{title}</div>
}

//基础数据视图
export default class FormTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || undefined,
            rowSelection: {
                selectedRowKeys: [],
                selectedRows: [],
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({
                        rowSelection: {
                            selectedRowKeys, selectedRows, onChange: this.state.rowSelection.onChange
                        }
                    })
                }
            }
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.setState({value: nextProps.value})
        }
    }
    
    //新增一行
    addTableLine = () => {
        const {initForm, onChange} = this.props;
        let formData = typeof initForm == 'function' && initForm({}) || {};
        const {value} = this.state;
        let newData = value || [];
        if (newData.length > 0 && newData[newData.length - 1].index) {
            newData.pop()
        }
        newData.push(formData);
        onChange(newData);
        this.setState({
            value: newData
        })
    }
    
    //删除一行
    delTableLine = (record) => {
        const {onChange} = this.props;
        const {value} = this.state;
        const that = this;
        Modal.confirm({
            title: '确认删除？',
            onOk() {
                let newData = value || [];
                let index = newData.findIndex(item => item.key === record.key);
                if (index > -1) {
                    newData.splice(index, 1);
                }
                if (newData.length == 1 && newData[0].index) {
                    newData = [];
                }
                onChange(newData);
                that.setState({
                    value: newData
                })
            }
        })
    }
    //复制一行
    copyTableLine = (record) => {
        const {onChange, initForm} = this.props;
        const {value} = this.state;
        let newData = value.slice() || [];
        let formData = typeof initForm == 'function' && initForm(record) || record;
        if (value.length > 0 && value[value.length - 1].index) {
            formData.key = value.length - 1;
            newData.splice(value.length - 1, 0, formData)
        } else {
            formData.key = value.length;
            newData.push(formData);
        }
        onChange(newData);
        this.setState({
            value: newData
        })
    }
    
    onClickBtn = (btn) => {
        if (btn.mode === 'multi') {
            const {rowSelection: {selectedRows}} = this.state;
            if (selectedRows.length === 0) {
                message.warn('请至少选择一条记录');
                return;
            }
        }
        btn.onClick(this);
    }
    
    //渲染操作按钮栏
    _renderBtns() {
        const {btns, editable} = this.props;
        if (!editable || !btns || btns.length === 0) {
            return null;
        }
        return (
            <div
                className={s.row}
            >
                {
                    btns.map(btn => {
                        if (btn.render === 'function') {
                            return btn.render();
                        }
                        return (
                            <BIButton
                                {...btn}
                                className={s.btn}
                                onClick={this.onClickBtn.bind(this, btn)}
                            >
                                {btn.title}
                            </BIButton>
                        )
                    })
                }
            </div>
        );
    }
    
    //条目修改回调
    changeState = (id, key, val, force = false) => {
        const {onChange} = this.props;
        let {value} = this.state;
        if (force) {
            value[id] = val;
        } else {
            value[id][key] = val;
        }
        this.setState({value});
        //同步外层表单
        onChange(value);
    }
    
    _renderCols = () => {
        const {cols, editable} = this.props;
        let {value} = this.state;
        let newCols = typeof cols === 'function' && cols(this) || [];
        return newCols.map(col => {
            return {
                ...col,
                title: renderTitle(editable, col.required, col.title),
                render: (text, record) => {
                    return (editable && col.editable) ?
                        //编辑模式且条目可编辑
                        <TableItem col={col} onChange={this.changeState} value={text}
                                   record={record} form={value[record.key]}/> :
                        //不可编辑时渲染文本
                        (typeof col.render === 'function' ? col.render(text, record) : text);
                }
            }
        })
    }
    
    //渲染表格组件
    _renderData() {
        const {multi} = this.props;
        const {value, rowSelection} = this.state;
        
        let data = value && value.slice() || [];
        data.map((item, i) => item.key = i);
        return (
            <BITable
                rowKey="key"
                className={s.tableWrap}
                rowSelection={multi ? rowSelection : null}
                columns={this._renderCols()}
                dataSource={data}
                bordered={true}
                pagination={false}
            />
        );
    }
    
    render() {
        const {style} = this.props;
        return (
            <div className={s.view} style={style}>
                {this._renderBtns()}
                {this._renderData()}
            </div>
        );
    }
}
