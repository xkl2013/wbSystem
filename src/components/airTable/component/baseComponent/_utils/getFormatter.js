import moment from 'moment';
import { isNumber } from '@/utils/utils';

export const GetFormatter = {
    TEXT: (val) => {
        const obj = Array.isArray(val) && val.length > 0 ? val[0] : {};
        return obj.value;
    },
    LINK: (val) => {
        const arr = Array.isArray(val) && val.length > 0 ? val : [{}];
        const value = [];
        arr.map((item) => {
            value.push(item.value);
        });
        return value.join(',');
    },
    SEARCH: (val) => {
        if (!Array.isArray(val)) return undefined;
        return val.map((item) => {
            return { value: item.value, label: item.text };
        });
        // .filter((item) => {
        //     return (item.value || item.value === 0);
        // });
    },
    SELECT: (val) => {
        // 处理成[{}]结构
        const obj = val[0] || {};
        return { key: obj.value, label: obj.text };
    },
    MULTIPLE_SELECT: (val) => {
        if (!Array.isArray(val)) return undefined;
        return val.map((item) => {
            return { key: item.value, label: item.text };
        });
    },
    DATE: (val) => {
        const obj = Array.isArray(val) && val.length > 0 ? val[0] : {};
        return obj.value ? moment(obj.value) : undefined;
    },
    FILE: (val) => {
        if (!Array.isArray(val)) return undefined;
        return val.map((item) => {
            let size = 0;
            const text = item.text.replace(/\((\d+)\)$/, (s0, s1) => {
                size = s1;
                return '';
            });
            return { value: item.value, name: text, size };
        });
    },
    DEPARTMENT: (val) => {
        if (!Array.isArray(val)) return undefined;
        return val.map((item) => {
            return { value: item.value, label: item.text };
        });
    },
    RATE: (val) => {
        const obj = Array.isArray(val) && val.length > 0 ? val[0] : {};
        return obj.value || 0;
    },
    TEXT_SEARCH: (val) => {
        if (!Array.isArray(val)) return undefined;
        return val
            .map((item) => {
                return {
                    value: item.value,
                    label: item.text,
                };
            })
            .filter((item) => {
                return item.value || item.value === 0 || item.label;
            });
    },
    NUMBER: (val, componentAttr) => {
        const obj = Array.isArray(val) && val.length > 0 ? val[0] : {};
        const { precision } = componentAttr;
        if (precision >= 0 && isNumber(obj.value)) {
            return Number(obj.value).toFixed(precision);
        }
        return obj.value;
    },
    CASCADER: (val) => {
        const obj = Array.isArray(val) && val.length > 0 ? val[0] : {};
        if (typeof obj.value === 'string') {
            return obj.value.split('-');
        }
        return obj.value;
    },
    RANGE_PICKER: (val) => {
        const obj = Array.isArray(val) && val.length > 0 ? val[0] : {};
        const arr = obj.value && typeof obj.value === 'string' ? obj.value.split('~') : [];
        return arr.map((ls) => {
            return ls ? moment(ls) : ls;
        });
    },
    TAXES_RATE: (val) => {
        const obj = Array.isArray(val) && val.length > 0 ? val[0] : {};
        return obj.value;
    },
};
export default GetFormatter;
