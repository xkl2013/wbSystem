import { message } from 'antd';
import moment from 'moment';
/* eslint-disable import/no-cycle */
import { approvalBusinessData } from '@/services/globalSearchApi';
import { Formater, Parser, ChangePormatter } from './utils/utils';
import { dataAttrFormat } from './utils/transAttrs';

/* eslint-disable global-require */
// 注意同步更新defaultValue数据
export const formConfig = {
    input: {
        component: require('@/ant_components/BIInput').default,
        placeholder: '请输入',
        detail: require('./components/detail/component/input.jsx').default,
    },
    textarea: {
        component: require('./components/Node/components/textArea').default,
        placeholder: '请输入',
        detail: require('./components/detail/component/input.jsx').default,
    },
    select: {
        component: require('@/ant_components/BISelect').default,
        placeholder: '请选择',
        formatter: Formater.formatSelectArr,
        parser: Parser.parserSelect,
        componentAttr: () => {
            return {
                getPopupContainer: () => {
                    return document.getElementById('com_generalForm');
                },
            };
        },
        detail: require('./components/detail/component/select.jsx').default,
    },
    radio: {
        component: require('@/ant_components/BIRadio').default,
        placeholder: '请选择',
        formatter: Formater.formatRadioArr,
        parser: Parser.parserSelect,
        detail: require('./components/detail/component/select.jsx').default,
    },
    datepicker: {
        component: require('@/ant_components/BIDatePicker').default,
        placeholder: '请选择',
        formatter: Formater.formateDatepicker,
        parser: Parser.parserDatepicker,
        componentAttr: (item) => {
            const dataAttrs = dataAttrFormat(item) || {};
            return {
                // showTime: {
                //     defaultValue: moment()
                // },
                getCalendarContainer: () => {
                    return document.getElementById('com_generalForm');
                },
                ...dataAttrs,
            };
        },
        detail: require('./components/detail/component/datepicker.jsx').default,
    },
    timepicker: {
        component: require('@/ant_components/BIDatePicker').default,
        placeholder: '请选择',
        formatter: Formater.formateTimepicker,
        parser: Parser.parserTimepicker,
        componentAttr: (item) => {
            const dataAttrs = dataAttrFormat(item) || {};
            return {
                showTime: {
                    defaultValue: moment(),
                },
                getCalendarContainer: () => {
                    return document.getElementById('com_generalForm');
                },
                ...dataAttrs,
            };
        },
        detail: require('./components/detail/component/datepicker.jsx').default,
    },
    rangepicker: {
        component: require('@/ant_components/BIDatePicker').default.BIRangePicker,
        placeholder: '请选择',
        componentAttr: (item = {}) => {
            const dataAttrs = dataAttrFormat(item) || {};
            return {
                placeholder: ['开始日期', '结束日期'],

                showTime: {
                    defaultValue: moment(),
                },
                getCalendarContainer: () => {
                    return document.getElementById('com_generalForm');
                },
                ...dataAttrs,
            };
        },
        parser: Parser.parserRangepicker,
        formatter: Formater.formateRangepicker,
        detail: require('./components/detail/component/rangepicker.jsx').default,
    },
    checkbox: {
        component: require('@/ant_components/BICheckbox').default,
        placeholder: '请选择',
        formatter: Formater.formatcheckboxArr,
        parser: Parser.parserCheckbox,
        detail: require('./components/detail/component/select.jsx').default,
    },
    number: {
        component: require('@/ant_components/BINumber').default,
        placeholder: '请输入',
        componentAttr: () => {
            return {
                precision: 2,
                min: 0,
                max: 1000000000000,
            };
        },
        detail: require('./components/detail/component/input.jsx').default,
    },
    upload: {
        component: require('@/components/upload').default,
        placeholder: '请输入',
        formatter: Formater.formateUpload,
        detail: require('./components/detail/component/upload.jsx').default,
    },
    imageupload: {
        component: require('@/components/upload').default,
        placeholder: '请输入',
        formatter: Formater.formateUpload,
        detail: require('./components/detail/component/upload.jsx').default,
    },
    department: {
        component: require('@/components/orgTreeSelect/index.tsx').default,
        placeholder: '请选择',
        componentAttr: () => {
            return {
                mode: 'org',
                getPopupContainer: () => {
                    return document.getElementById('com_generalForm');
                },
                initDataType: 'cache',
            };
        },
        formatter: Formater.formatDepartment,
        parser: Parser.department,
        changePormatter: ChangePormatter.department,
        detail: require('./components/detail/component/business.jsx').default,
    },
    business: {
        component: require('@/components/associationSearch/index.tsx').default,
        componentAttr: (item) => {
            const approvalFormFieldValues = item.approvalFormFieldValues || [];
            const behaviorResult = item.behaviorResult || {};
            const { fieldMessage, ...others } = behaviorResult.paramsJson || {};
            const FieldValueObj = approvalFormFieldValues.find((ls) => {
                return ls.fieldValueValue !== undefined;
            }) || {};
            return {
                getPopupContainer: () => {
                    return document.getElementById('com_generalForm');
                },
                allowClear: true,
                request: (val) => {
                    const paramsValue = Object.values(others);
                    const params = paramsValue.find((ls) => {
                        return ls || ls === 0;
                    });
                    console.log(paramsValue, params);
                    if (paramsValue.length > 0 && params !== 0 && !params) {
                        message.warn(fieldMessage);
                        return;
                    }
                    if (paramsValue.length > 0) {
                        const paramsJson = JSON.stringify(others);
                        return approvalBusinessData({
                            paramsJson,
                            name: val,
                            fieldValueName: FieldValueObj.fieldValueName,
                            fieldValueValue: FieldValueObj.fieldValueValue,
                        });
                    }
                    return approvalBusinessData({
                        name: val,
                        fieldValueName: FieldValueObj.fieldValueName,
                        fieldValueValue: FieldValueObj.fieldValueValue,
                    });
                },
                fieldNames: { value: 'fieldValueValue', label: 'fieldValueName' },
                initDataType: 'onfocus',
            };
        },
        formatter: Formater.formatBusiness,
        parser: Parser.business,
        changePormatter: ChangePormatter.department,
        detail: require('./components/detail/component/business.jsx').default,
    },
    panel: {
        component: require('@/components/General/components/panelNode').default,
        detail: require('./components/detail/component/panel.jsx').default,
    },
    businessInput: {
        component: require('@/components/dataEntry/textSelect').default,
        componentAttr: (item) => {
            const approvalFormFieldValues = item.approvalFormFieldValues || [];
            const behaviorResult = item.behaviorResult || {};
            const { fieldMessage, ...others } = behaviorResult.paramsJson || {};

            const FieldValueObj = approvalFormFieldValues.find((ls) => {
                return ls.fieldValueValue !== undefined;
            }) || {};
            return {
                getPopupContainer: () => {
                    return document.getElementById('com_generalForm');
                },
                allowClear: true,
                request: (val) => {
                    const paramsValue = Object.values(others);
                    const params = paramsValue.find((ls) => {
                        return ls || ls === 0;
                    });
                    if (paramsValue.length > 0 && params !== 0 && !params) {
                        message.warn(fieldMessage);
                        return;
                    }
                    if (paramsValue.length > 0) {
                        const paramsJson = JSON.stringify(others);
                        return approvalBusinessData({
                            paramsJson,
                            name: val,
                            fieldValueName: FieldValueObj.fieldValueName,
                            fieldValueValue: FieldValueObj.fieldValueValue,
                        });
                    }
                    return approvalBusinessData({
                        name: val,
                        fieldValueName: FieldValueObj.fieldValueName,
                        fieldValueValue: FieldValueObj.fieldValueValue,
                    });
                },
                fieldNames: { value: 'fieldValueValue', label: 'fieldValueName' },
                initDataType: 'onfocus',
            };
        },
        formatter: Formater.formatBusinessInput,
        parser: Parser.business,
        changePormatter: ChangePormatter.department,
        detail: require('./components/detail/component/business.jsx').default,
    },
};

export const checkoutFormItem = (item) => {
    const node = formConfig[item.type];
    if (node === undefined) {
        message.warn('暂未定义该控件');
        return null;
    }
    return require('@/ant_components/BIInput');
};
