import { message } from 'antd';
import moment from 'moment';
import { DATE_FORMAT, SPECIAL_DATETIME_FORMAT } from '@/utils/constants';
import { formConfig } from '../../../config';

/* eslint-disable */
export const checkoutFormItem = (item) => {
    const node = formConfig[item.type];
    if (node === undefined) {
        message.warn('暂未定义该控件');
        return null;
    }
    return require('@/ant_components/BIInput');
};
export const Formater = {
    formatcheckboxArr: (arr, originObj) => {
        const options = originObj.approvalFormFieldValues || [];
        if (!Array.isArray(arr)) return arr;
        const temp = [];
        arr.map((key) => {
            temp.push({
                value: key,
                name: options.find((item) => {
                    return String(item.fieldValueValue) === String(key);
                }).fieldValueName,
            });
        });
        return temp;
    },
    formatRadioArr: (key, originObj) => {
        const options = originObj.approvalFormFieldValues || [];
        if (!key && key !== 0) return key;
        const temp = [];
        temp.push({
            value: key,
            name: options.find((item) => {
                return String(item.fieldValueValue) === String(key);
            }).fieldValueName,
        });
        return temp;
    },
    formatSelectArr: (key, originObj) => {
        if (!key) return key;
        const options = originObj.approvalFormFieldValues || [];
        const temp = [];
        temp.push({
            value: key,
            name: options.find((item) => {
                return String(item.fieldValueValue) === String(key);
            }).fieldValueName,
        });
        return temp;
    },
    formatDepartment: (key, originObj) => {
        if (!key) return key;
        return [{ value: key.value, name: key.label }];
    },
    formateDatepicker: (time) => {
        if (!time) return time;
        return moment(time).format(DATE_FORMAT);
    },
    formateTimepicker: (time) => {
        if (!time) return time;
        return moment(time).format(SPECIAL_DATETIME_FORMAT);
    },
    formateRangepicker: (time) => {
        if (!Array.isArray(time)) return time;
        return time.map((item) => {
            return moment(item).format(SPECIAL_DATETIME_FORMAT);
        });
    },
    formateUpload: (fileList) => {
        return fileList;
    },
    formatBusiness: (key) => {
        if (!key) return key;
        let result = [];
        if (Array.isArray(key) && key.length > 0) {
            result = key.map((item) => {
                return {
                    value: item.value,
                    name: item.label,
                };
            });
        } else {
            result.push({ value: key.value, name: key.label });
        }
        return result;
    },
};

export const Parser = {
    parserSelect: (value) => {
        if (!Array.isArray(value) || value.length === 0) return value;
        const obj =
            value.find((item) => {
                return item;
            }) || {};
        return obj.value !== undefined ? Number(obj.value) : obj.value;
    },
    parserDatepicker: (value) => {
        if (!value) return value;
        const date = moment(value);
        return date._isValid ? date : undefined;
    },
    parserTimepicker: (value) => {
        if (!value) return value;
        const date = moment(value);
        return date._isValid ? date : undefined;
    },
    parserRangepicker: (value) => {
        if (!Array.isArray(value)) return value;
        return value.map((item) => {
            return moment(item);
        });
    },
    parserCheckbox: (value) => {
        if (!Array.isArray(value)) return value;
        return value.map((item) => {
            return item.value;
        });
    },
    department: (value) => {
        if (!Array.isArray(value) || value.length === 0) return value;
        const obj =
            value.find((item) => {
                return item;
            }) || {};
        return { value: obj.value, label: obj.name };
    },
    business: (value) => {
        let result = [];
        if (Array.isArray(value) && value.length > 0) {
            result = value.map((item) => {
                return {
                    value: item.value,
                    label: item.name,
                };
            });
            if (result[0].value === undefined) {
                result = [];
            }
            console.log(result);
            return result;
        }
    },
};
// 处理在change调用
export const ChangePormatter = {
    department: (val) => {
        if (!val) return val;
        return {
            ...val,
            value: val.value.value,
        };
    },
};
export const formateValue = (values, data) => {
    const returnValues = [];
    Object.keys(values || {}).forEach((item) => {
        const obj =
            data.find((ls) => {
                return ls.name === item;
            }) || {};
        const Dom = formConfig[obj.type];
        const behaviorResult = obj.behaviorResult || {};
        let fieldValue = undefined;
        if (behaviorResult.display !== 0) {
            fieldValue = (Dom && Dom.formatter ? Dom.formatter.call(null, values[item], obj) : values[item]) || '';
        }
        returnValues.push({
            fieldId: obj.id,
            fieldName: obj.name,
            fieldValue,
        });
    });
    return returnValues;
};
