import moment from 'moment';
import { isNumber } from '../../../utils/utils';
import { accMul } from '../../../utils/calculate';
import { checkoutFileType } from '../extra/upload/utils';

const initValue = (val) => {
    if (!Array.isArray(val) || val.length === 0) return undefined;
    // 过滤掉空数据
    const newValue = val.filter((item) => {
        return item.text || item.value || item.value === 0;
    });
    return newValue.length > 0 ? newValue : undefined;
};
export const GetFormatter = {
    INPUT: (val) => {
        const newValue = initValue(val);
        return newValue ? newValue[0].text || newValue[0].value : undefined;
    },
    SEARCH: (val) => {
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        return newValue.map((item) => {
            return { value: item.value, label: item.text };
        });
    },
    TEXTAREA: (val) => {
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        return newValue[0].value;
    },
    TEXTLINK: (val) => {
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        return newValue[0].value;
    },
    UPLOAD: (val) => {
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        return newValue.map((item) => {
            let size = 0;
            const text = item.text.replace(/\((\d+)\)$/, (s0, s1, s2) => {
                size = s1;
                return '';
            });
            return { value: item.value, name: text, size, ...checkoutFileType(item.value) };
        });
    },
    CHECKBOX: (val, config) => {
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        const { isMultiple } = config || {};
        if (isMultiple) {
            return newValue.map((item) => {
                return item.value;
            });
        }
        return newValue[0].value;
    },
    SELECT: (val) => {
        // 处理成[{}]结构
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        return { key: newValue[0].value, label: newValue[0].text };
    },
    MULTIPLE_SELECT: (val) => {
        // 处理成[{}]结构
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        return newValue.map((item) => {
            return { key: item.value, label: item.text };
        });
    },
    TEXT_SELECT: (val) => {
        return GetFormatter.SELECT(val);
    },
    RATE: (val) => {
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        return newValue[0].value;
    },
    NUMBER: (val, config) => {
        let newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        const { precision, unit } = config;
        if (unit && unit.code === 'wan') {
            let formateVal = Number((newValue[0] || {}).value);
            formateVal = formateVal ? formateVal / 10000 : formateVal;
            newValue = [{ value: formateVal, text: formateVal }];
        }
        if (precision >= 0 && isNumber(newValue[0].value)) {
            return Number(newValue[0].value).toFixed(precision);
        }
        return newValue[0].value;
    },
    PERCENTAGE: (val, config) => {
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        if (isNumber(newValue[0].value)) {
            return `${accMul(newValue[0].value, 100).toFixed(config.precision)}%`;
        }
        return undefined;
    },
    DATE: (val) => {
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        return moment(newValue[0].value);
    },
    DATERANGE: (val) => {
        const obj = Array.isArray(val) && val.length > 0 ? val[0] : {};
        const newVal = obj.value ? obj.value.split('~') : [];
        const [startTime, endTime] = newVal;
        return [startTime && moment(startTime), endTime && moment(endTime)];
    },
    LINK: (val) => {
        return Array.isArray(val) && val.length > 0 ? val : [];
    },
    TREE_SELECT: (val) => {
        const newValue = initValue(val);
        if (!newValue) {
            return undefined;
        }
        return newValue.map((item) => {
            return { value: item.value, label: item.text };
        });
    },
    CASCADER: (val) => {
        const obj = Array.isArray(val) && val.length > 0 ? val[0] : {};
        if (typeof obj.value === 'string') {
            return obj.value.split('-');
        }
        return obj.value;
    },
};
