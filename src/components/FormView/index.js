/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import { Form } from 'antd';
import BIForm from '@/ant_components/BIForm';
import BISelect from '@/ant_components/BISelect';
import BICascader from '@/ant_components/BICascader/FormCascader';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BICheckbox from '@/ant_components/BICheckbox';
import BIRadio from '@/ant_components/BIRadio';
import BIInput from '@/ant_components/BIInput';
import BITable from '@/ant_components/BITable';
import BIButton from '@/ant_components/BIButton';
// eslint-disable-next-line import/extensions,import/no-unresolved
import AssociationSearch from '@/components/associationSearch';
import SelectCity from '@/components/selectCitys';
import Tags from '@/components/NewTags';
// eslint-disable-next-line import/extensions,import/no-unresolved
import OrgTreeSelect from '@/components/orgTreeSelect';
import EmailInput from '@/components/EmailInput';
import FormTable from '@/components/FormTable';
import TipInput from '@/components/TipInput';
import NumberRatio from '@/components/NumberRatio';
import BIInputNumber from '@/ant_components/BIInputNumber';
import Upload from '@/components/upload';
import FormEditTable from '@/components/FormEditTable';
import SubmitButton from '@/components/SubmitButton';
import styles from './index.less';

const FormItem = Form.Item;
const getColClass = function getColClass(cols) {
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
                            return this.wrapDom || document.body;
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
            case 'selectMult':
                return (
                    <BISelect
                        className={styles.itemContent}
                        mode="multiple"
                        placeholder={col.placeholder || '请选择'}
                        disabled={col.disabled}
                        {...col.componentAttr}
                        getPopupContainer={() => {
                            return this.wrapDom || document.body;
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
                            return this.wrapDom || document.body;
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
                            return this.wrapDom || document.body;
                        }}
                    />
                );
            case 'daterange':
                return (
                    <BIDatePicker.BIRangePicker
                        placeholder={col.placeholder}
                        className={styles.itemContent}
                        onCalendarChange={this.changeRange.bind(this, col.key)}
                        disabled={col.disabled}
                        {...col.componentAttr}
                        getCalendarContainer={() => {
                            return this.wrapDom || document.body;
                        }}
                    />
                );
            case 'orgtree':
                return (
                    <OrgTreeSelect
                        className={styles.itemContent}
                        disabled={col.disabled}
                        mode="org"
                        {...col.componentAttr}
                        getPopupContainer={() => {
                            return this.wrapDom || document.body;
                        }}
                    />
                );
            case 'usertree':
                return (
                    <OrgTreeSelect
                        className={styles.itemContent}
                        disabled={col.disabled}
                        mode="user"
                        {...col.componentAttr}
                        getPopupContainer={() => {
                            return this.wrapDom || document.body;
                        }}
                    />
                );
            case 'textarea':
                return (
                    <BIInput.TextArea className={styles.itemContent} disabled={col.disabled} {...col.componentAttr} />
                );
            case 'table':
                return (
                    <>
                        {col.selfCom ? col.selfCom : null}
                        <BITable className={styles.itemContent} {...col.componentAttr} />
                    </>
                );
            case 'associationSearch':
                return (
                    <AssociationSearch
                        placeholder={col.placeholder}
                        getPopupContainer={() => {
                            return this.wrapDom || document.body;
                        }}
                        disabled={col.disabled}
                        {...col.componentAttr}
                    >
                        {col.selfCom ? col.selfCom : null}
                    </AssociationSearch>
                );
            case 'custom':
                return col.component || (col.render && col.render());
            case 'email':
                return <EmailInput {...col.componentAttr} placeholder={col.placeholder} disabled={col.disabled} />;
            case 'selectCity':
                return (
                    <SelectCity placeholder={col.placeholder} disabled={col.disabled} {...col.componentAttr}>
                        {col.selfCom ? col.selfCom : null}
                    </SelectCity>
                );
            case 'cascader':
                return <BICascader {...col.componentAttr} />;

            case 'formTable':
                return <FormTable className={styles.itemContent} {...col.componentAttr} />;
            case 'tipInput':
                return (
                    <TipInput
                        className={styles.itemContent}
                        placeholder={col.placeholder}
                        disabled={col.disabled}
                        {...col.componentAttr}
                    />
                );
            case 'numberRatio':
                return (
                    <NumberRatio
                        className={styles.itemContent}
                        placeholder={col.placeholder}
                        disabled={col.disabled}
                        {...col.componentAttr}
                        minAttr={col.minAttr || {}}
                        maxAttr={col.maxAttr || {}}
                    />
                );
            case 'inputNumber':
                return (
                    <BIInputNumber
                        className={styles.itemContent}
                        placeholder={col.placeholder}
                        disabled={col.disabled}
                        {...col.componentAttr}
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
            case 'formEditTable':
                return <FormEditTable className={styles.itemContent} {...col.componentAttr} />;
            case 'tags':
                return <Tags {...col.componentAttr} />;
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
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { cols, formData, delKeys } = this.props;
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
                // 删除字段更新
                if (delKeys && delKeys.length > 0) {
                    delKeys.map((key) => {
                        values[key] = values[key] || null;
                    });
                }
                this.props.handleSubmit(values);
            }
        });
    };

    handleCancel = () => {
        this.props.handleCancel();
    };

    renderLabel = (col) => {
        if (col.labelCol === 24) {
            return col.label;
        }
        // const str = txt && txt.replace(/[\u0391-\uFFE5]/g, 'aa').length;
        return (
            <span className={styles.newLableCls}>
                {col.label}
                {/* {
                    str && str > 8 ?
                        (str < 10 ? (
                            <>
                                <span className={styles.lineSpanCls}>{txt.slice(0, 5)}</span><br /><span
                                    className={styles.lineSpanCls}>{txt.slice(5, txt.length)}</span>
                            </>
                        ) : (<>
                            <span className={styles.lineSpanCls}>{txt.slice(0, 4)}</span><br /><span
                                className={styles.lineSpanCls}>{txt.slice(4, txt.length)}</span>
                        </>)) : txt
                } */}
            </span>
        );
    };

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        const {
            // formItemLayout,
            cols,
            btnWrapStyle,
            loading,
            okText,
            cancelText,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div
                className={styles.wrap}
                ref={(r) => {
                    this.wrapDom = r;
                }}
            >
                <BIForm className={styles.formWrap} {...formItemLayout} onSubmit={this.handleSubmit}>
                    {cols.map((group, index) => {
                        return (
                            <div key={index} className={styles.groupWrap}>
                                {group.title && <div className={styles.groupTitle}>{group.title}</div>}
                                {group.columns
                                    && group.columns.map((row, i) => {
                                        const colClass = getColClass(row.length);
                                        return (
                                            <div className={styles.rowWrap} key={i}>
                                                {row.map((col, j) => {
                                                    if (!col.key) {
                                                        return null;
                                                    }
                                                    return (
                                                        <div className={colClass} key={j}>
                                                            <FormItem
                                                                label={col.label ? this.renderLabel(col) : null}
                                                                labelCol={col.labelCol || formItemLayout.labelCol}
                                                                wrapperCol={col.wrapperCol || formItemLayout.wrapperCol}
                                                                className={styles.colItem}
                                                            >
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
                    <div className={styles.buttonWrap} style={btnWrapStyle}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <BIButton onClick={this.handleCancel} className={styles.btnCls}>
                                {cancelText || '取消'}
                            </BIButton>
                            <SubmitButton
                                onClick={this.handleSubmit}
                                type="primary"
                                className={styles.btnCls}
                                loading={loading}
                            >
                                {okText || '提交'}
                            </SubmitButton>
                        </div>
                    </div>
                </BIForm>
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

export default Form.create({ name: 'form_view', mapPropsToFields, onValuesChange, force: true })(FormView);
