import React, { Component } from 'react';
import { Form } from 'antd';
import BIForm from '@/ant_components/BIForm';
import BIButton from '@/ant_components/BIButton';
import styles from './index.less';
import SubmitButton from '@/components/SubmitButton';
import { config } from '../../config';
import IconFont from '@/components/CustomIcon/IconFont';

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
        const { rowId, handleCancel } = this.props;
        if (typeof handleCancel === 'function') {
            handleCancel({ rowId });
        }
    };

    handleDelete = () => {
        const { rowId, handleDelete } = this.props;
        if (typeof handleDelete === 'function') {
            handleDelete({ data: { id: rowId } });
        }
    };

    validateRequired = (item, rule, value, callback) => {
        if (!item.requiredFlag) {
            callback();
            return;
        }
        if (!value || value.length === 0) {
            callback('必填项不能为空');
            return;
        }
        const [first] = value;
        if (!first.text && !first.value) {
            callback('必填项不能为空');
            return;
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

    render() {
        const {
            loading,
            data,
            name,
            changeParams,
            form,
            tableId,
            rowId,
            rowData,
            isShowDelBtn,
            columnConfigCallback,
        } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={styles.wrap}>
                <p className={styles.titleCls}>{name}</p>
                <div
                    id="gotop"
                    className={styles.formItemCls}
                    ref={(r) => {
                        this.wrapDom = r;
                    }}
                >
                    <BIForm onSubmit={this.handleSubmit} layout="vertical">
                        {data.map((item) => {
                            // 表单中剔除掉标题
                            if (item.historyDetailTitleFlag) {
                                return null;
                            }
                            if (!config[item.columnType]) {
                                return null;
                            }
                            const Node = config[item.columnType].component;
                            const cellData = rowData.find((cell) => {
                                return item.columnName === cell.colName;
                            });
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
                                            rowId={rowId}
                                            columnConfig={item}
                                            cellData={(cellData && cellData.cellValueList) || []}
                                            getCalendarContainer={() => {
                                                return this.wrapDom;
                                            }}
                                            getPopupContainer={() => {
                                                return this.wrapDom;
                                            }}
                                            changeParams={changeParams.bind(this, item.key)}
                                            style={{ width: '100%' }}
                                            columnConfigCallback={columnConfigCallback}
                                        />,
                                    )}
                                </FormItem>
                            );
                        })}
                    </BIForm>
                </div>
                <div className={styles.buttonWrap}>
                    <BIButton
                        onClick={this.handleDelete}
                        type="link"
                        className={styles.delBtnCls}
                        style={{ visibility: isShowDelBtn ? 'visible' : 'hidden' }}
                    >
                        删除
                    </BIButton>
                    <div>
                        <BIButton onClick={this.handleCancel} className={styles.btnCls}>
                            取消
                        </BIButton>
                        <SubmitButton
                            onClick={this.handleSubmit}
                            type="primary"
                            className={styles.btnCls}
                            loading={loading}
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
