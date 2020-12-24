/**
 *@author   zhangwenshuai
 *@date     2019-06-22 13:33
 * */

// 库/框架
import React, { Component } from 'react';
// 组件
import BITable from '@/ant_components/BITable';
import BIButton from '@/ant_components/BIButton';
import SelfForm from './selfForm';
// 样式
import s from './index.less';
// 工具
import { columnsFn } from './tableColum';

// 基础数据视图
export default class SelfTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    showBudgets = () => {
        this.setState({
            show: true,
        });
    };

    hideBudgets = () => {
        this.setState({
            show: false,
        });
    };

    changeBudgets = (values) => {
        const { onChange } = this.props;
        onChange(values);
        this.hideBudgets();
    };

    changeInput = (key, record, e) => {
        const { value, onChange } = this.props;
        const newList = value.slice();
        const talent = newList.find((item) => {
            return (
                Number(item.talentId) === Number(record.talentId)
                && Number(item.talentType) === Number(record.talentType)
            );
        });
        talent[key] = e;
        onChange({ projectBudgets: newList });
    };

    changeRadio = (key, record, e) => {
        const { value, onChange } = this.props;
        const newList = value.slice();
        const talent = newList.find((item) => {
            return (
                Number(item.talentId) === Number(record.talentId)
                && Number(item.talentType) === Number(record.talentType)
            );
        });
        talent[key] = e.target.value;
        onChange({ projectBudgets: newList });
    };

    // 渲染操作按钮栏
    renderBtns = () => {
        const btns = [{ label: '添加艺人', onClick: this.showBudgets }];
        return (
            <div className={s.row}>
                {btns.map((item, i) => {
                    const { label, onClick } = item;
                    const style = {};
                    if (i === 0) {
                        style.marginRight = '0';
                    }
                    return (
                        <BIButton style={style} key={i} className={s.btn} onClick={onClick}>
                            <span className={s.addIconCls}>+</span>
                            <span className={s.labelText}>{label}</span>
                        </BIButton>
                    );
                })}
            </div>
        );
    };

    // 渲染表格组件
    renderData() {
        const { value, title, style } = this.props;
        const cols = columnsFn(this);
        return (
            <BITable
                className={s.tableWrap}
                style={style}
                rowKey={(item) => {
                    return `${item.talentId}_${item.talentType}`;
                }}
                columns={cols}
                dataSource={value}
                bordered={true}
                pagination={false}
                title={title}
            />
        );
    }

    render() {
        const { style, value, editable, noBtn, projectingId } = this.props;
        const { show } = this.state;

        return (
            <div className={s.view} style={style}>
                {editable && !noBtn && this.renderBtns()}
                {this.renderData()}
                {this.props.children}
                {show && (
                    <SelfForm
                        visible={show}
                        title="添加艺人"
                        handleSubmit={this.changeBudgets}
                        handleCancel={this.hideBudgets}
                        onCancel={this.hideBudgets}
                        footer={null}
                        formData={{ projectBudgets: value || [] }}
                        projectingId={projectingId}
                    />
                )}
            </div>
        );
    }
}
