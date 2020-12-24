import React from 'react';
import { formConfig } from '../../config';
import styles from '../../styles.less';

const renderCommonAttr = (Dom, item) => {
    return {
        placeholder: item.fieldMessage || `${Dom.placeholder}${item.title || ''}`,
    };
};
// 检查控件是否可编辑
const checkComDisable = (approvalFromFieldAttrs) => {
    if (!Array.isArray(approvalFromFieldAttrs) || approvalFromFieldAttrs.length === 0) return false;
    return !!approvalFromFieldAttrs.find((ls) => {
        return ls.attrName === 'readonly';
    });
};
export const renderFormItem = (item, ops = {}) => {
    const Dom = formConfig[item.type];
    const { flowKey, ...others } = ops;
    if (Dom === undefined) {
        return null;
    }
    const selfAttr = Dom.componentAttr ? Dom.componentAttr(item) : {};
    const approvalFromFieldAttrs = Array.isArray(item.approvalFromFieldAttrs) ? item.approvalFromFieldAttrs : [];
    const commonAttr = {
        ...renderCommonAttr(Dom, item),
        ...selfAttr,
        ...others,
        disabled: checkComDisable(approvalFromFieldAttrs),
    };
    const options = item.approvalFormFieldValues || [];
    const type = item.type || '';

    switch (type.toLocaleLowerCase()) {
        case 'select':
            return (
                <Dom.component key={item.name} {...commonAttr}>
                    {options.map((ls) => {
                        return (
                            <Dom.component.Option value={ls.fieldValueValue} key={ls.fieldValueValue}>
                                {ls.fieldValueName}
                            </Dom.component.Option>
                        );
                    })}
                </Dom.component>
            );
        case 'radio':
            return (
                <Dom.component key={item.name} {...commonAttr}>
                    {options.map((ls) => {
                        return (
                            <Dom.component.Radio value={ls.fieldValueValue} key={ls.fieldValueValue}>
                                {ls.fieldValueName}
                            </Dom.component.Radio>
                        );
                    })}
                </Dom.component>
            );
        case 'checkbox':
            return (
                <Dom.component key={item.name} {...commonAttr}>
                    {options.map((ls) => {
                        return (
                            <Dom.component.Checkbox value={ls.fieldValueValue} key={ls.fieldValueValue}>
                                {ls.fieldValueName}
                            </Dom.component.Checkbox>
                        );
                    })}
                </Dom.component>
            );
        case 'textarea':
            return <Dom.component key={item.name} {...commonAttr} approvalFromFieldAttrs={approvalFromFieldAttrs} />;
        case 'datepicker':
            return <Dom.component key={item.name} {...commonAttr} />;
        case 'timepicker':
            return <Dom.component key={item.name} {...commonAttr} />;
        case 'rangepicker':
            return <Dom.component key={item.name} {...commonAttr} />;
        case 'number':
            return <Dom.component key={item.name} {...commonAttr} />;
        case 'upload':
            return (
                <Dom.component
                    key={item.name}
                    commonAttr={
                        item.inspectRules
                            ? { ...Object.assign({ maxLength: item.inspectRules }, commonAttr) }
                            : { ...commonAttr }
                    }
                    {...commonAttr}
                    beforeUpload={Dom.beforeUpload}
                />
            );
        case 'business':
            return (
                <Dom.component
                    key={item.name}
                    mode={item.inspectRules === 'multiple' ? 'multiple' : null}
                    {...commonAttr}
                />
            );
        case 'imageupload':
            return <Dom.component key={item.name} {...commonAttr} beforeUpload={Dom.beforeUpload} />;
        case 'panel':
            return (
                <Dom.component
                    key={item.name}
                    {...commonAttr}
                    flowKey={flowKey}
                    fieldKey={item.name}
                    title={item.title}
                    form={others.form}
                    approvalFormFields={item.approvalFormFields}
                />
            );
        default:
            return (
                <Dom.component
                    key={item.name}
                    maxLength={item.inspectRules ? Number(item.inspectRules) : null}
                    {...commonAttr}
                />
            );
    }
};

export const renderLabel = (txt = '') => {
    const words = [];
    const str = txt || '';
    for (let i = 0; i < str.length; i += 1) {
        if (i % 7 === 0) {
            words.push(str.substring(i, i + 7));
        }
    }
    return (
        <span className={styles.newLableCls}>
            {words.map((item, index) => {
                return (
                    <span key={index}>
                        <span className={styles.lineSpanCls}>{item}</span>
                        <br />
                    </span>
                );
            })}
        </span>
    );
};
const ItemNode = (props) => {
    const { item, ...others } = props;
    return renderFormItem(item, others || {});
};
export default ItemNode;
