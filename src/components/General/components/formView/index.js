import React from 'react';
import { message, Form } from 'antd';
import BIButton from '@/ant_components/BIButton';
import SubmitButton from '@/components/SubmitButton';
import styles from '../../styles.less';
import { formModalLayout, formPanelModalLayout } from '../../utils/layout';
import { formateValue } from './utils/utils';
import { formConfig } from '../../config';
import NodeItem from '../Node';
import { renderLabel } from '../Node/item';
import panelNode from '../panelNode';

class FormView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: [],
            errs: {},
        };
    }

    componentDidMount() {
        this.initFormData(this.props.formData);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.formData) !== JSON.stringify(this.props.formData)) {
            this.initFormData(nextProps.formData);
        }
    }

    initFormData = (formData) => {
        if (!Array.isArray(formData)) return;
        this.setState({ formData });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            const panelCheck = this.onPanelValidateFields();
            this.setState({ errs: err });
            if (!err && !panelCheck && this.props.onSubmit) {
                console.log(formateValue(values, this.props.data));
                this.props.onSubmit({
                    approvalInstanceDataDtos: formateValue(values, this.props.data),
                });
            }
        });
    };

    onPanelValidateFields = () => {
        const panelNodes = this.state.formData.filter((ls) => {
            return ls.type === 'panel';
        });
        if (panelNode.onValidateFields && panelNodes.length > 0) {
            const result = panelNode.onValidateFields();
            return result;
        }
        return false;
    };

    checkoutValidateStatus = (item) => {
        let value = this.props.form.getFieldsValue() || {};
        value = Object.keys(value).filter((ls) => {
            return value[ls];
        });
        if (value.includes(item.name)) {
            return 'validating';
        }
        return `${item.name in (this.state.errs || {}) ? 'error' : 'validating'}`;
    };

    checkoutConponentType = (item, index) => {
        const { getFieldDecorator } = this.props.form;
        const Dom = formConfig[item.type];
        const isPanel = item.type === 'panel'; // 是否是明细控件
        const lsyout = isPanel ? formPanelModalLayout : formModalLayout;
        if (Dom === undefined) {
            return null;
        }
        return (
            <Form.Item
                label={isPanel ? '' : renderLabel(item.title) || `标题${index + 1}`}
                key={item.name || `标题${index + 1}`}
                validateStatus={this.checkoutValidateStatus(item)}
                help=""
                {...lsyout}
            >
                {getFieldDecorator(item.name || `key${index + 1}`, {
                    rules: [
                        {
                            required: String(item.fieldEmpty) === '0',
                        },
                    ],
                })(
                    <NodeItem
                        item={item}
                        // handleBehavior={this.handleBehavior}
                        flowKey={this.props.flowKey}
                        form={this.props.form}
                        required={String(item.fieldEmpty) === '0'}
                    />,
                )}
            </Form.Item>
        );
    };

    renderFormItem = (item, index) => {
        // 控制组件显隐
        const behaviorResult = item.behaviorResult || {};
        if (behaviorResult.display === 0) return null;
        if (item && typeof item === 'object') {
            return this.checkoutConponentType(item, index);
        }
        message.warn('传入数据异常');
        return null;
    };

    render() {
        const { formData } = this.state;
        return (
            <Form className={styles.formWrap} id="com_generalForm">
                {formData.map((item, index) => {
                    return this.renderFormItem(item, index);
                })}
                <div className={styles.approvalStep}>{this.props.children}</div>
                <div className={styles.footer}>
                    <BIButton onClick={this.props.onCancel} className={styles.btnCls}>
                        取消
                    </BIButton>
                    <SubmitButton
                        type="primary"
                        onClick={this.handleSubmit}
                        loading={this.props.loading}
                        className={styles.btnCls}
                    >
                        提交
                    </SubmitButton>
                </div>
            </Form>
        );
    }
}
function mapPropsToFields(props) {
    const data = props.formData || [];
    const returnObj = {};
    data.forEach((item) => {
        const Dom = formConfig[item.type];
        let value = !item.value && item.value !== 0 ? undefined : item.value;
        value = Dom && Dom.parser ? Dom.parser.call(null, value, item) : value;
        returnObj[item.name] = Form.createFormField({ value });
    });
    return returnObj;
}
function onValuesChange(props, changedValues, allValues) {
    if (props.onChangeParams) {
        const formData = props.formData || [];
        const newData = formData.map((item) => {
            const Dom = formConfig[item.type];
            return {
                ...item,
                value:
                    Dom && Dom.formatter ? Dom.formatter.call(null, allValues[item.name], item) : allValues[item.name],
            };
        });
        props.onChangeParams(newData, changedValues, allValues);
    }
}
export default Form.create({ name: 'form_view', mapPropsToFields, onValuesChange })(FormView);
