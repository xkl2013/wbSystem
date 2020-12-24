import React, { Component } from 'react';
import { Form } from 'antd';
import BIForm from '@/ant_components/BIForm';
import BISelect from '@/ant_components/BISelect';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BICheckbox from '@/ant_components/BICheckbox';
import BIRadio from '@/ant_components/BIRadio';
import BIInput from '@/ant_components/BIInput';
import BITextArea from '../components/textArea';
import BIButton from '@/ant_components/BIButton';
// eslint-disable-next-line
import AssociationSearch from '@/components/associationSearch';
import IconFont from '@/components/CustomIcon/IconFont';
import styles from './index.less';
import Upload from '@/components/upload';

const FormItem = Form.Item;
const getColClass = function (cols) {
    let colClass = styles.colWrap;
    switch (cols) {
        case 2:
            colClass += ` ${styles.half}`;
            break;
        case 3:
            colClass += ` ${styles.three}`;
            break;
        case 4:
            colClass += ` ${styles.four}`;
            break;
        case 5:
            colClass += ` ${styles.five}`;
            break;
        default:
            break;
    }
    return colClass;
};

// 多维数组降维成一维数组
function reduceDimension(arr) {
    let newArr = [];
    arr.map((item) => {
        newArr = newArr.concat(Array.prototype.concat.apply([], item.columns));
    });
    return newArr;
}

class FormView extends Component {
    renderItem = (col) => {
        switch (col.type) {
            case 'select':
                return (
                    <BISelect
                        placeholder={col.placeholder || '请选择'}
                        className={styles.itemContent}
                        allowClear={!(col.allowClear && col.allowClear === 'false')}
                        disabled={col.disabled}
                        {...col.componentAttr}
                        getPopupContainer={() => {
                            return this.wrapDom;
                        }}
                    >
                        {col.options.map((option) => {
                            return (
                                <BISelect.Option value={option.id} key={option.id} disabled={!!option.disabled}>
                                    {option.name}
                                </BISelect.Option>
                            );
                        })}
                    </BISelect>
                );
            case 'selectMult':
                return (
                    <BISelect
                        className={styles.itemContent}
                        mode="multiple"
                        placeholder={col.placeholder || '请选择'}
                        disabled={col.disabled}
                        {...col.componentAttr}
                        getPopupContainer={() => {
                            return this.wrapDom;
                        }}
                    >
                        {col.options.map((option) => {
                            return (
                                <BISelect.Option value={option.id} key={option.id}>
                                    {option.name}
                                </BISelect.Option>
                            );
                        })}
                    </BISelect>
                );
            case 'radio':
                return (
                    <BIRadio className={styles.itemContent} disabled={col.disabled} {...col.componentAttr}>
                        {col.options.map((option) => {
                            return (
                                <BIRadio.Radio value={option.id} key={option.id}>
                                    {option.name}
                                </BIRadio.Radio>
                            );
                        })}
                    </BIRadio>
                );
            case 'associationSearch':
                return (
                    <AssociationSearch
                        placeholder={col.placeholder}
                        getPopupContainer={() => {
                            return this.wrapDom;
                        }}
                        disabled={col.disabled}
                        {...col.componentAttr}
                    >
                        {col.selfCom ? col.selfCom : null}
                    </AssociationSearch>
                );
            case 'checkbox':
                return (
                    <BICheckbox className={styles.itemContent} disabled={col.disabled} {...col.componentAttr}>
                        {col.options.map((option) => {
                            return (
                                <BICheckbox.Checkbox value={option.id} key={option.id}>
                                    {option.name}
                                </BICheckbox.Checkbox>
                            );
                        })}
                    </BICheckbox>
                );
            case 'date':
                return (
                    <BIDatePicker
                        className={styles.itemContent}
                        placeholder={col.placeholder}
                        disabled={col.disabled}
                        {...col.componentAttr}
                        getCalendarContainer={() => {
                            return this.wrapDom;
                        }}
                    />
                );
            case 'datetime':
                return (
                    <BIDatePicker
                        className={styles.itemContent}
                        showTime
                        disabled={col.disabled}
                        {...col.componentAttr}
                        getCalendarContainer={() => {
                            return this.wrapDom;
                        }}
                    />
                );
            case 'upload':
                return (
                    <Upload
                        className={styles.itemContent}
                        placeholder={col.placeholder}
                        disabled={col.disabled}
                        {...col.componentAttr}
                    />
                );
            case 'daterange':
                return (
                    <BIDatePicker.BIRangePicker
                        placeholder={col.placeholder}
                        // className={styles.itemContent}
                        onCalendarChange={this.changeRange.bind(this, col.key)}
                        disabled={col.disabled}
                        {...col.componentAttr}
                        getCalendarContainer={() => {
                            return this.wrapDom;
                        }}
                    />
                );
            case 'textarea':
                return (
                    <BITextArea
                        placeholder={col.placeholder}
                        className={styles.itemContent}
                        disabled={col.disabled}
                        {...col.componentAttr}
                    />
                );
            case 'custom':
                return col.component || (col.render && col.render());
            default:
                return (
                    <BIInput
                        className={styles.itemContent}
                        placeholder={col.placeholder}
                        disabled={col.disabled}
                        {...col.componentAttr}
                    />
                );
        }
    };

    changeRange = (key, dates) => {
        const newData = {};
        newData[key] = dates;
        this.props.form.setFieldsValue(newData);
    };

    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFieldsAndScroll((err, _values) => {
            let values = _values;
            if (!err) {
                const { cols, formData } = this.props;
                const colsArr = reduceDimension(cols);
                // 上送数据时格式化为接口所需格式
                Object.keys(values).map((key) => {
                    const col = colsArr.find((item) => {
                        return item.key === key;
                    });
                    if (values[key] != null && col.getFormat && typeof col.getFormat === 'function') {
                        values = col.getFormat(values[key], values, formData);
                    }
                });
                this.props.handleSubmit(values);
            }
        });
    };

    handleCancel = () => {
        this.props.handleCancel();
    };

    handleDelete = () => {
        this.props.handleDelete();
    };

    render() {
        const {
            cols,
            btnWrapStyle,
            loading,
            delLoading,
            formTitle,
            customTitle,
            isShowDelBtn,
            isOnlyShowDelBtn,
            customBtnName,
            customBtn,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.wrap}>
                <div className={styles.titleCls}>{customTitle || formTitle}</div>
                <div
                    id="gotop"
                    className={styles.formWrap}
                    ref={(val) => {
                        this.wrapDom = val;
                    }}
                >
                    <BIForm onSubmit={this.handleSubmit}>
                        {cols.map((group, index) => {
                            return (
                                <div key={index} className={styles.groupWrap}>
                                    {group.title && (
                                        <div className={styles.groupTitle}>
                                            <IconFont type={group.icon} className={styles.itemIcon} />
                                            {group.title}
                                            {group.customCom && group.customCom()}
                                        </div>
                                    )}
                                    {group.columns
                                        && group.columns.map((row, index1) => {
                                            const colClass = getColClass(row.length);
                                            return (
                                                <div className={styles.rowWrap} key={index1}>
                                                    {row.map((col, index2) => {
                                                        if (!col.key) {
                                                            return null;
                                                        }
                                                        return (
                                                            <div className={colClass} key={index2}>
                                                                <FormItem className={styles.colItem}>
                                                                    {getFieldDecorator(col.key, col.checkOption)(
                                                                        this.renderItem(col),
                                                                    )}
                                                                </FormItem>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                </div>
                            );
                        })}
                    </BIForm>
                </div>
                <div className={styles.buttonWrap} style={btnWrapStyle}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {customBtn
                            || (isShowDelBtn || isOnlyShowDelBtn ? (
                                <BIButton
                                    loading={delLoading}
                                    onClick={this.handleDelete}
                                    type="link"
                                    className={styles.delBtnCls}
                                >
                                    {customBtnName || '删除'}
                                </BIButton>
                            ) : null)}
                        <BIButton onClick={this.handleCancel} className={styles.btnCls}>
                            取消
                        </BIButton>
                        <BIButton
                            // htmlType="submit"
                            onClick={this.handleSubmit}
                            type="primary"
                            className={styles.btnCls}
                            loading={loading}
                        >
                            提交
                        </BIButton>
                    </div>
                </div>
            </div>
        );
    }
}

function mapPropsToFields(props) {
    const { formData, cols } = props;
    const returnObj = {};
    if (!formData || typeof formData !== 'object') return returnObj;
    const colsArr = reduceDimension(cols);
    Object.keys(formData).forEach((key) => {
        let value = formData[key];
        const col = colsArr.find((item) => {
            return item.key === key;
        });
        if (!col) {
            return;
        }
        // 0为有效数据，回填时将原始数据处理成form所需格式
        if ((!!value || value === 0) && col.setFormat && typeof col.setFormat === 'function') {
            value = col.setFormat(value, formData);
        }
        if (!value && value !== 0) {
            value = undefined;
        }
        if (Array.isArray(value)) {
            value = value.slice();
        }
        returnObj[key] = Form.createFormField({
            value,
        });
    });
    return returnObj;
}

function onValuesChange(props, changedValues, allValues) {
    if (props.onChangeParams) {
        props.onChangeParams(changedValues, allValues);
    }
}

const FancyButton = React.forwardRef((props, ref) => {
    return <FormView {...props} ref={ref} />;
});
export default Form.create({ name: 'form_view', mapPropsToFields, onValuesChange })(FancyButton);
