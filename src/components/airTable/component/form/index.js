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
 *  */
import React, { Component } from 'react';
import { Form } from 'antd';
import BIForm from '@/ant_components/BIForm';
import BIButton from '@/ant_components/BIButton';
import SubmitButton from '@/components/SubmitButton';
import IconFont from '@/components/CustomIcon/IconFont';
import styles from './index.less';
// eslint-disable-next-line import/no-cycle
import { config } from '../../config';

const FormItem = BIForm.Item;

class FormWrap extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { rowId, form, handleSubmit } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const result = [];
                Object.keys(values).map((el) => {
                    result.push({
                        columnCode: el,
                        cellValueList: values[el],
                    });
                });
                handleSubmit({ data: { id: rowId, value: result } });
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

    validateRequired = (item, rule, value, callback) => {
        const { columnAttrObj = {} } = item;
        const { validator } = columnAttrObj;
        if (!item.requiredFlag) {
            callback();
            return;
        }
        if (!value || value.length === 0) {
            callback('必填项不能为空');
            return;
        }
        const [first] = value;
        if (!first.text && first.text !== 0 && !first.value && first.value !== 0) {
            callback('必填项不能为空');
            return;
        }
        if (validator && typeof validator === 'function') {
            const values = this.props.form.getFieldsValue();
            callback(validator({ value, values, item }));
        }
        callback();
    };

    renderLabel = (item) => {
        const { icon } = config[item.columnType];
        return (
            <span className={styles.titleContainer}>
                {icon && (typeof icon === 'string' ? <IconFont className={styles.colIcon} type={icon} /> : icon)}
                <span className={styles.itemTitle}>{item.columnChsName}</span>
            </span>
        );
    };

    renderNode = (item, cellData) => {
        const { cellRender, rowData } = this.props;
        const DomObj = config[item.columnType] || {};
        if (cellRender && typeof cellRender === 'function') {
            const obj = cellRender({ cellData, rowData, columnConfig: item });
            if (obj && obj.component) {
                return obj.component;
            }
        }
        return DomObj.component;
    };

    render() {
        const {
            loading,
            isShowDelBtn,
            data,
            btnWrapStyle,
            name,
            changeParams,
            form,
            tableId,
            rowId,
            rowData,
            columnConfigCallback,
        } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={styles.wrap}>
                <p className={styles.titleCls}>{name || '客户跟进'}</p>
                <div
                    id="gotop"
                    className={styles.formItemCls}
                    ref={(r) => {
                        this.wrapDom = r;
                    }}
                >
                    <BIForm onSubmit={this.handleSubmit} layout="vertical">
                        {data.map((item) => {
                            if (!config[item.columnType]) {
                                return null;
                            }
                            const cellData = rowData.find((cell) => {
                                return item.columnName === cell.colName;
                            });
                            const Node = this.renderNode(item, cellData);
                            if (!Node) return null;
                            return (
                                <FormItem
                                    key={item.columnName}
                                    label={this.renderLabel(item)}
                                    required={item.requiredFlag}
                                >
                                    {getFieldDecorator(item.key, {
                                        validateFirst: true,
                                        rules: [
                                            {
                                                validator: this.validateRequired.bind(this, item),
                                            },
                                        ],
                                    })(
                                        <Node
                                            tableId={tableId}
                                            rowData={rowData}
                                            rowId={rowId}
                                            columnConfig={item}
                                            columnConfigCallback={columnConfigCallback}
                                            cellData={(cellData && cellData.cellValueList) || []}
                                            getCalendarContainer={() => {
                                                return this.wrapDom;
                                            }}
                                            getPopupContainer={() => {
                                                return this.wrapDom;
                                            }}
                                            changeParams={changeParams.bind(this, item.key)}
                                            style={{ width: '100%' }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        })}
                    </BIForm>
                </div>
                <div className={styles.buttonWrap} style={btnWrapStyle}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {isShowDelBtn ? (
                            <BIButton onClick={this.handleDelete} type="link" className={styles.delBtnCls}>
                                删除
                            </BIButton>
                        ) : null}
                        <BIButton onClick={this.handleCancel} className={styles.btnCls}>
                            取消
                        </BIButton>
                        <SubmitButton
                            onClick={this.handleSubmit}
                            type="primary"
                            className={styles.btnCls}
                            loading={loading}
                            id="submitBtn" // 用于业务监听此dom节点
                        >
                            确定
                        </SubmitButton>
                    </div>
                </div>
            </div>
        );
    }
}

function mapPropsToFields(props) {
    const returnObj = {};
    props.data.forEach((el) => {
        returnObj[el.key] = Form.createFormField({
            value: el.value,
        });
    });
    return returnObj;
}

function onValuesChange(props, changedValues, allValues) {
    if (props.changeValue) {
        props.changeValue(changedValues, allValues);
    }
}

export default Form.create({ name: 'form_view', mapPropsToFields, onValuesChange })(FormWrap);
