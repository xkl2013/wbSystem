/**
 *@author   zhangwenshuai
 *@date     2019-06-22 16:28
 * */

// 库/框架
import React, { Component } from 'react';
// 组件
import lodash from 'lodash';
import { Modal } from 'antd';
import BITable from '@/ant_components/BITable';
import BIButton from '@/ant_components/BIButton';
/*eslint-disable*/
import SelfForm from './_selfForm';
// 样式
import s from './index.less';
// 工具

// 基础数据视图
export default class FormTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            formData: {},
            type: 'add',
        };
    }

    handleSubmitFn = (e) => {
        const { onChange, value, formKey, changeParentForm, submitCallback, hiddenKey } = this.props;
        const { type, formData } = this.state;
        if (submitCallback && typeof submitCallback === 'function') {
            // 拦截提交按钮
            const backData = lodash.assign({}, formData, e);
            submitCallback(type, backData, this.hideEditFn);
            return;
        }
        const newData = [...(value || [])];
        let changedInfo = {};
        if (type === 'add') {
            if (newData.length > 0 && newData[newData.length - 1].index) {
                newData.pop();
            }
            newData.push(e);
            changedInfo = {
                type,
                oldItem: null,
                newItem: e,
            };
        } else {
            const index = newData.findIndex((item) => {
                return item.key === formData.key;
            });
            if (index > -1) {
                // 显隐导致表单丢失的key，增加默认undefined重置原数据
                if (hiddenKey && hiddenKey.length > 0) {
                    hiddenKey.map((key) => {
                        e[key] = e[key] || undefined;
                    });
                }
                // 保留源数据的信息，用于区分是请求带过来的还是新添加的
                const temp = lodash.assign({}, newData[index], e);
                newData.splice(index, 1, temp);
                changedInfo = {
                    type,
                    oldItem: value[index],
                    newItem: e,
                };
            }
        }
        onChange(newData);
        changeParentForm(formKey, newData, -1, changedInfo);
        this.hideEditFn();
    };

    // 新增一行
    showEditFn = () => {
        const { initForm } = this.props;
        const formData = (typeof initForm === 'function' && initForm({})) || {};
        this.setState({
            show: true,
            formData,
            type: 'add',
        });
    };

    // 编辑一行
    editTableLine = (record) => {
        const { initForm } = this.props;
        const formData = (typeof initForm === 'function' && initForm({ ...record })) || record;
        this.setState({
            show: true,
            formData,
            type: 'edit',
        });
    };

    // 删除一行
    delTableLine = (record) => {
        const { onChange, value, changeParentForm, formKey, delCallback } = this.props;
        Modal.confirm({
            title: '确认删除？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                if (delCallback && typeof delCallback === 'function') {
                    // 删除操作回调
                    delCallback(record);
                    return;
                }
                let newData = [...(value || [])];
                let changedInfo = {};
                const index = newData.findIndex((item) => {
                    return item.key === record.key;
                });
                if (index > -1) {
                    newData.splice(index, 1);
                    changedInfo = {
                        type: 'del',
                        oldItem: value[index],
                        newItem: null,
                    };
                }
                // 单独添加的合计行
                if (newData.length === 1 && newData[0].index) {
                    newData = [];
                }
                onChange(newData);
                changeParentForm(formKey, newData, index, changedInfo);
            },
        });
    };

    // 复制一行
    copyTableLine = (record, changeData) => {
        const { onChange, value, changeParentForm, formKey } = this.props;
        const newData = value.slice() || [];
        let item = lodash.assign({}, record, { newType: 'copy' });
        if (typeof changeData === 'function') {
            item = changeData(item);
        }
        if (value[value.length - 1].index) {
            item.key = value.length - 1;
            newData.splice(value.length - 1, 0, item);
        } else {
            item.key = value.length;
            newData.push(item);
        }
        onChange(newData);
        changeParentForm(formKey, newData);
    };

    hideEditFn = () => {
        this.setState({
            show: false,
            formData: {},
        });
    };

    // 渲染操作按钮栏
    renderBtnsFn() {
        const { addBtnText, btns, tips } = this.props;
        if (btns) {
            return (
                <div className={s.row}>
                    {btns.map((btn, i) => {
                        return (
                            <BIButton key={i} className={s.btn} onClick={btn.onClick}>
                                {btn.label}
                            </BIButton>
                        );
                    })}
                    {tips}
                </div>
            );
        }
        return (
            <div className={s.row}>
                {addBtnText === null ? null : (
                    <BIButton className={s.btn} onClick={this.showEditFn}>
                        <span className={s.addIconCls}>+</span> {addBtnText || '新增'}
                    </BIButton>
                )}
            </div>
        );
    }

    // 渲染表格组件
    renderDataFn() {
        const { value, tableCols, scroll } = this.props;
        const cols = tableCols(this);
        const data = (value && value.slice()) || [];
        data.map((item, i) => {
            return (item.key = i);
        });
        return (
            <BITable
                className={s.tableWrap}
                columns={cols}
                dataSource={data}
                bordered={true}
                pagination={false}
                scroll={scroll}
            />
        );
    }

    render() {
        const { style, disabled, formCols, addBtnText, editBtnText, children, delKeys } = this.props;
        const { show, formData, type } = this.state;
        return (
            <div className={s.view} style={style}>
                {!disabled && this.renderBtnsFn()}
                {this.renderDataFn()}
                {children}
                {show && (
                    <SelfForm
                        maskClosable={false}
                        visible={show}
                        title={type === 'add' ? addBtnText : editBtnText}
                        cols={formCols}
                        formData={formData}
                        onCancel={this.hideEditFn}
                        handleCancel={this.hideEditFn}
                        handleSubmit={lodash.debounce(this.handleSubmitFn, 400)}
                        footer={null}
                        delKeys={delKeys}
                    />
                )}
            </div>
        );
    }
}
