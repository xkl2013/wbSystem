import React from 'react';
import { message, Form } from 'antd';
import formStyles from './styles.less';
import { formModalLayout } from '../../utils/layout';
import { formConfig } from '../../config';
import NodeItem from '../Node';
import { renderLabel } from '../Node/item';
import HehaviorHOC from '../formView/handleBehaviorHOC';

function mapPropsToFields(props) {
    const data = props.formData || [];
    const paramsValue = Array.isArray(props.value) ? props.value : [];
    const returnObj = {};
    paramsValue.forEach((item) => {
        const itemObj = data.find((ls) => {
            return String(ls.id) === String(item.fieldId);
        }) || {};
        const Dom = formConfig[itemObj.type];
        let value = !item.fieldValue && item.fieldValue !== 0 ? undefined : item.fieldValue;
        value = Dom && Dom.parser ? Dom.parser.call(null, value, itemObj) : value;
        returnObj[itemObj.name] = value;
    });
    return returnObj;
}
function onValuesChange(props, changedValues, allValues) {
    if (props.onChange) {
        const newData = props.formData.map((item) => {
            const Dom = formConfig[item.type];
            return {
                fieldId: item.id,
                fieldValue:
                    Dom && Dom.formatter ? Dom.formatter.call(null, allValues[item.name], item) : allValues[item.name],
            };
        });
        props.onChange(newData, changedValues, allValues);
    }
}
@HehaviorHOC
class FormView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: [],
            errs: [],
        };
    }

    componentDidMount() {
        this.initFormData(this.props);
        this.initValue(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.formData) !== JSON.stringify(this.props.formData)) {
            this.initFormData(nextProps);
        }
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initValue(nextProps);
        }
    }

    initValue = (props) => {
        if (!Array.isArray(props.formData) || props.formData.length === 0) return;
        const value = mapPropsToFields(props);
        this.setState({ value });
    };

    initFormData = (props) => {
        if (!Array.isArray(props.formData)) return;
        this.initValue(props);
        this.setState({ formData: props.formData });
    };

    onDelete = (index) => {
        if (this.props.onDelete) this.props.onDelete(index);
    };

    getFieldsError = () => {
        const errs = {};
        const { formData, value } = this.state;
        formData.forEach((item) => {
            const required = String(item.fieldEmpty) === '0';
            const display = (item.behaviorResult || {}).display;
            if (required && display !== 0 && (value[item.name] === undefined || value[item.name] === null)) {
                errs[item.name] = value[item.name];
            }
        });
        this.setState({ errs: Object.keys(errs || {}) });
        return Object.keys(errs).length > 0;
    };

    checkoutValidateStatus = (item) => {
        let value = this.state.value;
        value = Object.keys(value).filter((ls) => {
            return value[ls];
        });
        if (value.includes(item.name)) {
            return 'validating';
        }
        return `${this.state.errs.includes(item.name) ? 'error' : 'validating'}`;
    };

    onChange = (key, val) => {
        const value = this.state.value;
        const currentObj = {};
        currentObj[key] = val;
        value[key] = val;
        this.setState(() => {
            return { value };
        });
        onValuesChange(this.props, currentObj, value);
    };

    checkoutConponentType = (item, index) => {
        const { value } = this.state;
        const Dom = formConfig[item.type];
        if (Dom === undefined) {
            return null;
        }
        return (
            <Form.Item
                {...formModalLayout}
                required={String(item.fieldEmpty) === '0'}
                label={renderLabel(item.title) || `标题${index + 1}`}
                key={item.name || `标题${index + 1}`}
                validateStatus={this.checkoutValidateStatus(item)}
            >
                <NodeItem
                    item={item}
                    value={value[item.name]}
                    onChange={(val) => {
                        this.onChange(item.name, val);
                    }}
                />
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
        const { title, index, itemNumber } = this.props;
        return (
            <div id="com_generalForm">
                <Form.Item {...formModalLayout} label={`${title}${index + 1}`} style={{ marginBottom: 0 }}>
                    <div className={formStyles.formItem}>
                        {itemNumber <= 1 ? null : (
                            <span className={formStyles.itemBtn} onClick={this.onDelete.bind(this, index)}>
                                {' '}
                                删除
                            </span>
                        )}
                    </div>
                </Form.Item>
                {formData.map((item, i) => {
                    return this.renderFormItem(item, i);
                })}
            </div>
        );
    }
}

export default FormView;
