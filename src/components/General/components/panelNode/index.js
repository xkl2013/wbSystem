import React from 'react';
import { Row, Col } from 'antd';
import FormCol from './form';
import styles from './styles.less';

const getFieldValue = (value, price, goodNum) => {
    const priceItem = value.find((ls) => {
        return ls.fieldId === price;
    }) || {};
    const goodNumItem = value.find((ls) => {
        return ls.fieldId === goodNum;
    }) || {};
    // eslint-disable-next-line no-restricted-globals
    return isNaN(priceItem.fieldValue) || isNaN(goodNumItem.fieldValue)
        ? 0
        : priceItem.fieldValue * goodNumItem.fieldValue;
};
const customFieldSum = (props, fieldMaps) => {
    return (values) => {
        // 处理自定义sum求和
        const { fieldKey, flowKey } = props;
        if (fieldKey === 'WPXX' && flowKey === 'flow_key_chou_jiang') {
            // 抽奖采购申请单
            return values.map((ls) => {
                const sumId = (fieldMaps.WPJG || {}).id;
                const sumIndex = ls.findIndex((item) => {
                    return item.fieldId === sumId;
                });
                const price = (fieldMaps.WPDJ || {}).id;
                const goodNum = (fieldMaps.WPSL || {}).id;
                if (sumIndex >= 0) {
                    ls[sumIndex] = {
                        ...(ls[sumIndex] || {}),
                        fieldValue: getFieldValue(ls, price, goodNum),
                    };
                } else {
                    ls.push({
                        fieldId: sumId,
                        fieldValue: getFieldValue(ls, price, goodNum),
                    });
                }
                return ls;
            });
        }

        return values;
    };
};

class PanelForm extends React.Component {
    formRefs = [];

    constructor(props) {
        super(props);
        PanelForm.onValidateFields = this.onValidateFields;
    }

    state = {
        value: [],
        fieldInitValue: [],
        statistics: {},
        fieldMaps: {},
    };

    componentDidMount() {
        this.initData();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initData();
        }
        if (JSON.stringify(nextProps.approvalFormFields) !== JSON.stringify(this.props.approvalFormFields)) {
            this.initData();
        }
    }

    initValue = (props = this.props) => {
        let { value } = props;
        const { required } = props;
        if (value && value.length > 0) {
            if (typeof value === 'string') {
                value = JSON.parse(value);
            }
            this.setState({ value: value || [] });
            this.onSaveStatistics(value);
            return;
        }
        if ((!value || value.length === 0) && required) {
            this.additem();
        }
    };

    initData = () => {
        this.getFieldValue();
        this.initStatistics();
    };

    initStatistics = () => {
        const { approvalFormFields } = this.props;
        const statistics = {};
        approvalFormFields.forEach((element) => {
            const approvalFromFieldAttrs = element.approvalFromFieldAttrs || [];
            const sumObj = approvalFromFieldAttrs.find((ls) => {
                return ls.attrName === 'is_sum';
            });
            if (sumObj) {
                const unitObj = approvalFromFieldAttrs.find((ls) => {
                    return ls.attrName === 'unit';
                }) || {};
                statistics[sumObj.fieldId] = {
                    total: 0,
                    title: element.title,
                    util: unitObj.attrValue,
                };
            }
        });
        this.setState({ statistics });
    };

    getFieldValue = () => {
        const { approvalFormFields } = this.props;
        const fieldMaps = {};
        if (!Array.isArray(approvalFormFields)) return;
        const fieldInitValue = approvalFormFields.map((ls) => {
            fieldMaps[ls.name] = ls;
            return {
                fieldId: ls.id,
                fieldValue: ls.value,
                value: ls.value,
                fieldKey: ls.name,
            };
        });
        this.setState({ fieldInitValue, fieldMaps }, this.initValue);
    };

    additem = () => {
        const { value, fieldInitValue } = this.state;
        value.push(fieldInitValue);
        this.setState({ value });
    };

    onDelete = (index) => {
        const { value } = this.state;
        value.splice(index, 1);
        this.formRefs.splice(index, 1);
        this.setState({ value });
        this.onSaveStatistics(value);
    };

    onSaveFieldValue = (allval = [], index) => {
        const { value } = this.state;
        value[index] = allval;
        this.setState({ value });
        this.onSaveStatistics(value);
        this.onChange(value);
    };

    onSaveStatistics = (val) => {
        const { statistics } = this.state;
        if (!val || val.length === 0) return;
        const values = customFieldSum(this.props, this.state.fieldMaps)(val);
        Object.keys(statistics).forEach((key) => {
            statistics[key].total = 0;
            values.forEach((ls) => {
                const fieldValue = Array.isArray(ls) ? ls : [];
                const itemObj = fieldValue.find((l) => {
                    return String(l.fieldId) === String(key);
                }) || {};
                statistics[key].total += itemObj.fieldValue || 0;
            });
            statistics[key].total = statistics[key].total.toFixed
                ? statistics[key].total.toFixed(2)
                : statistics[key].total.toFixed;
        });
        this.setState({ statistics });
    };

    onValidateFields = () => {
        if (!this.formRefs || this.formRefs.length === 0) return false;
        let errs = null;
        this.formRefs = this.formRefs.filter((ls) => {
            return ls;
        });
        for (let i = 0; i < this.formRefs.length; i += 1) {
            const getFieldsError = this.formRefs[i].getFieldsError;
            const fieldsError = getFieldsError && getFieldsError.call();
            errs = errs || fieldsError;
        }
        return !!errs;
    };

    onChangeParams = (allVal, val, index) => {
        this.onSaveFieldValue(allVal, index);
    };

    onChange = (val) => {
        if (this.props.onChange) this.props.onChange(val);
    };

    render() {
        const { value, statistics } = this.state;
        this.formRefs = [];
        const approvalFormFields = Array.isArray(this.props.approvalFormFields) ? this.props.approvalFormFields : [];
        return (
            <div className={styles.panelWrap}>
                <div className={styles.panelBody}>
                    {value.map((ls, index) => {
                        return (
                            <FormCol
                                key={index}
                                ref={(dom) => {
                                    this.formRefs[index] = dom;
                                }}
                                formData={approvalFormFields}
                                value={ls}
                                onChange={(allVal, val) => {
                                    return this.onChangeParams(allVal, val, index);
                                }}
                                onDelete={this.onDelete}
                                index={index}
                                title={this.props.title}
                                itemNumber={value.length}
                            />
                        );
                    })}
                </div>

                <div className={styles.foolter}>
                    <span className={styles.addBtns} onClick={this.additem}>
                        +添加明细
                    </span>
                </div>
                <div className={styles.statistics}>
                    {Object.keys(statistics).map((ls) => {
                        const obj = statistics[ls];
                        if (obj.total <= 0) return null;
                        return (
                            <Row key={ls}>
                                <Col span={4}>
                                    {' '}
                                    <span className={styles.statisticsLabel}>
                                        {obj.title}
                                        总计:
                                    </span>
                                </Col>
                                <Col span={20}>
                                    {' '}
                                    <span className={styles.statisticsValue}>{obj.total}</span>
                                    <span>{` ${obj.util}`}</span>
                                </Col>
                            </Row>
                        );
                    })}
                </div>
            </div>
        );
    }
}
export default PanelForm;
