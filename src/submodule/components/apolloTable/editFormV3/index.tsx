/**
 * 表单提交：handleSubmit: Function,
 *
 * 表单取消：handleCancel:Function
 *
 * 数据回显：mapPropsToFields:Function
 *
 * 监听表单值发生变化是的回掉：onValuesChange:Function
 *
 * 样式：propClass：object
 *
 * 增加字段：hideOperateBtn，有该字段，隐藏表单底部操作按钮
 *
 * 失去焦点：onBlurFn
 *  */
import React, { Component } from 'react';
import { Form, Button, message, Tooltip } from 'antd';
import _ from 'lodash';
import IconFont from '@/submodule/components/IconFont/IconFont';
import { emptyModel } from '../component/base/_utils/setFormatter';
import { defaultLocale } from '../locale';
import { config } from '../component/base/config';
import { transferAttr } from '../component/base/_utils/transferAttr';
import { getFormat, setFormat } from '../component/base';
import { Provider } from '../component/context';
import FormHelper from '../utils/formHelper';
import s from './index.less';

const FormItem = Form.Item;

class FormWrap extends Component {
    wrapDom: any;

    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const {
            rowId, form, handleSubmit, data, rowData, detailType,
        } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const newValues: any[] = [];
                _.keys(values).map((key) => {
                    const item = data.find((temp: any) => {
                        return temp.columnName === key;
                    });
                    const { columnType, columnAttrObj, renderEditForm, readOnlyFlag, dynamicCellConfigDTO } = item;
                    if (readOnlyFlag || (dynamicCellConfigDTO && dynamicCellConfigDTO.readonlyFlag)) {
                        return;
                    }
                    let detailConfig: any;
                    if (typeof renderEditForm === 'function') {
                        detailConfig = renderEditForm({ cellData: values[key], rowData, columnConfig: item });
                    } else {
                        detailConfig = config[String(columnType)] || config['1'];
                    }
                    const cellValueList = setFormat(detailConfig, item, values[key]);
                    const newData: any = {
                        columnCode: key,
                        cellValueList,
                    };
                    newValues.push(newData);
                });

                if (typeof handleSubmit === 'function') {
                    handleSubmit({ data: { value: newValues }, formValues: values, detailType });
                }
            }
        });
    };

    handleCancel = () => {
        const { handleCancel } = this.props;
        if (typeof handleCancel === 'function') {
            handleCancel();
        }
    };

    handleDelete = () => {
        const { rowId, handleDelete } = this.props;
        if (typeof handleDelete === 'function') {
            handleDelete({ data: { id: rowId } });
        }
    };

    renderLabel = (item) => {
        // const { icon } = config[item.columnType];
        return (
            <span className={s.titleContainer}>
                {/* icon && <div className={s.colIcon}>{icon}</div> */}
                <span className={s.itemTitle}>{item.columnChsName}</span>
                {item.columnAttrObj?.remark && (
                    <Tooltip title={item.columnAttrObj?.remark}>
                        <IconFont type="iconwenhao" className={s.remarkIcon} />
                    </Tooltip>
                )}
            </span>
        );
    };

    validateRequired = (item, rule, value, callback) => {
        // 可输可选组件清空时数据格式有问题，单独处理一下
        if (item.requiredFlag && Number(item.columnType) === 15 && typeof value === 'object') {
            if (
                !value.label
                && value.label !== 0
                && !value.text
                && value.text !== 0
                && !value.value
                && value.value !== 0
            ) {
                return callback('必填项不能为空');
            }
        }
        return callback();
    };

    renderEditForm = (item) => {
        const { getFieldDecorator } = this.props.form;
        const { rowData, rowId, getInstanceDetail, onEmitChange } = this.props;
        const {
            columnType,
            columnName,
            columnAttrObj,
            value,
            renderEditForm,
            readOnlyFlag,
            validateFirst = true,
            validateTrigger = 'onChange',
            dynamicCellConfigDTO,
            cellRenderProps,
            requiredFlag,
        } = item;
        let detailConfig: any;
        if (typeof renderEditForm === 'function') {
            detailConfig = renderEditForm({ cellData: value, rowData, columnConfig: item });
        } else {
            detailConfig = config[String(columnType)] || config['1'];
        }
        const EditComp: any = detailConfig.editComp;
        const newProps = {
            ...(detailConfig.componentAttr || {}),
            ...(columnAttrObj || {}),
        };
        const transferColumn = transferAttr(columnType, newProps);
        const disabled = readOnlyFlag || (dynamicCellConfigDTO && dynamicCellConfigDTO.readonlyFlag);
        const emitChange = (changedValue: any, optionValue: any) => {
            let temp: any[] = [];
            value
                && value.map((item: any) => {
                    temp.push({ text: item.text, value: item.value });
                });
            if (temp.length === 0) {
                temp = emptyModel;
            }
            if (_.isEqual(temp, changedValue)) {
                return;
            }
            changeValue(changedValue, optionValue);
        };
        const changeValue = async (changedValue: any, optionValue: any) => {
            const extraData = FormHelper.changeTableData({
                item,
                changedKey: columnName,
                changedValue,
                originValue: optionValue,
            });
            extraData.push({
                columnCode: columnName,
                cellValueList: changedValue,
            });
            if (typeof onEmitChange === 'function') {
                onEmitChange(extraData);
            }
        };
        return (
            <FormItem key={columnName} label={this.renderLabel(item)}>
                {getFieldDecorator(columnName, {
                    validateFirst,
                    validateTrigger,
                    rules: [
                        { required: !!item.requiredFlag, message: '必填项不能为空' },
                        { validator: this.validateRequired.bind(this, item) },
                        ...(item.columnAttrObj.rules || []),
                    ],
                    initialValue: getFormat(detailConfig, item, value),
                })(
                    <EditComp
                        {...transferColumn}
                        columnConfig={item}
                        disabled={disabled}
                        rowId={rowId}
                        onEmitChange={(changedValue: any, optionValue: any) => {
                            // 校验必填项
                            if (requiredFlag && (!changedValue || changedValue.length === 0)) {
                                // message.error('必填项不能为空');
                                return;
                            }
                            // 校验规则
                            if (columnAttrObj.rules) {
                                for (let i = 0; i < columnAttrObj.rules.length; i++) {
                                    const rule = columnAttrObj.rules[i];
                                    if (rule.pattern && !rule.pattern.test(changedValue)) {
                                        // message.error(rule.message || '请按正确格式填写');
                                        return;
                                    }
                                }
                            }
                            const value = setFormat(detailConfig, item, changedValue, optionValue);
                            emitChange(value, optionValue);
                        }}
                        rowData={{ id: rowId, rowData }}
                        cellRenderProps={cellRenderProps}
                        origin="editForm"
                        form={this.props.form}
                        getInstanceDetail={getInstanceDetail}
                        getCalendarContainer={() => {
                            return this.wrapDom;
                        }}
                        getPopupContainer={() => {
                            return this.wrapDom;
                        }}
                    />,
                )}
            </FormItem>
        );
    };

    getContext = () => {
        const { locale } = this.props;
        if (locale) {
            if (locale.context) {
                if (locale.lang && defaultLocale[locale.lang]) {
                    return { ...defaultLocale[locale.lang], ...locale.context };
                }
                return locale.context;
            }
        }
        return defaultLocale.cn;
    };

    render() {
        const {
            loading, isShowDelBtn, data, btnWrapStyle, name, colsNum, delLabel, hideOperateBtn,
        } = this.props;

        return (
            <Provider value={{ locale: this.getContext() }}>
                <div className={s.wrap}>
                    <div className={s.topWrap}>
                        <div className={s.titleCls}>{name}</div>
                    </div>
                    <div
                        id="gotop"
                        className={s.formItemCls}
                        ref={(r) => {
                            this.wrapDom = r;
                        }}
                    >
                        <Form onSubmit={this.handleSubmit} layout="vertical">
                            {data.map((item: any, i: number) => {
                                return (
                                    <div
                                        key={i}
                                        className={s.item}
                                        style={{
                                            width: `${100 / colsNum}%`,
                                            marginLeft: colsNum > 1 && i % colsNum === 0 ? '-50px' : 0,
                                            paddingLeft: colsNum > 1 ? '50px' : 0,
                                        }}
                                    >
                                        {this.renderEditForm(item)}
                                    </div>
                                );
                            })}
                        </Form>
                    </div>
                    <div className={s.bottomWrap}>
                        {isShowDelBtn && (
                            <Button onClick={this.handleDelete} type="link" className={s.delBtnCls}>
                                {delLabel || '删除'}
                            </Button>
                        )}
                        {!hideOperateBtn && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <Button onClick={this.handleCancel} className={s.btnCls}>
                                    取消
                                </Button>
                                <Button
                                    onClick={this.handleSubmit}
                                    type="primary"
                                    className={s.btnCls}
                                    loading={loading}
                                    id="submitBtn" // 用于业务监听此dom节点
                                >
                                    确定
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Provider>
        );
    }
}

export default Form.create({ name: 'editFormV3' })(FormWrap);
