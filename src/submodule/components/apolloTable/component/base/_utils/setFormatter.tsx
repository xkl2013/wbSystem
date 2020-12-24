import { isNumber } from '../../../utils/utils';
import { accDiv } from '../../../utils/calculate';

export const formatStr = 'YYYY-MM-DD HH:mm:ss';
export const emptyModel = [{ text: '', value: '' }];

export const SetFormatter = {
    INPUT: (value) => {
        if (!value) {
            return emptyModel;
        }
        return [{ value, text: value }];
    },
    TEXTAREA: (value) => {
        if (!value) {
            return emptyModel;
        }
        return [{ value, text: value }];
    },
    TEXTLINK: (value) => {
        if (!value) {
            return emptyModel;
        }
        return [{ value, text: value }];
    },
    UPLOAD: (val) => {
        if (!val || val.length === 0) return emptyModel;
        return val.map((item) => {
            return { value: item.value, text: `${item.name}(${item.size})` };
        });
    },
    CHECKBOX: (value) => {
        if (!value) {
            return emptyModel;
        }
        if (Array.isArray(value)) {
            return value.map((item) => {
                return { value: item, text: item };
            });
        }
        return [{ value, text: value }];
    },
    SELECT: (val) => {
        if (!val) return emptyModel;
        if (typeof val === 'object') {
            const values = Array.isArray(val) ? val : [val];
            if (values.length === 0) {
                return emptyModel;
            }
            return values.map((item) => {
                return {
                    value: item.fieldValueValue || item.key || item.value,
                    text: item.fieldValueName || item.label || item.text,
                };
            });
        }
        return val;
    },
    MULTIPLE_SELECT: (val) => {
        return SetFormatter.SELECT(val);
    },
    TEXT_SELECT: (val) => {
        return SetFormatter.SELECT(val);
    },
    SEARCH: (val) => {
        // 处理成[{}]结构
        if (!val || typeof val !== 'object') return emptyModel;
        const values = Array.isArray(val) ? val : [val];
        if (values.length === 0) {
            return emptyModel;
        }
        return values.map((item) => {
            return {
                value: item.fieldValueValue || item.key || item.value,
                text: item.fieldValueName || item.label || item.text,
            };
        });
    },
    RATE: (val) => {
        if (!isNumber(val)) return emptyModel;
        return [{ value: val, text: val }];
    },
    NUMBER: (val, config) => {
        if (!isNumber(val)) return emptyModel;
        const { unit = {}, precision } = config || {}; // 设置单位
        if (unit && unit.code === 'wan') {
            const newVal = val ? val * 10000 : val;
            return [{ value: newVal, text: newVal }];
        }
        val = Number(val).toFixed(precision);
        return [{ value: val, text: val }];
    },
    PERCENTAGE: (val, config) => {
        val = `${val}`.replace('%', '');
        if (!isNumber(val)) return emptyModel;
        const { precision } = config || {}; // 设置单位
        val = accDiv(val, 100);
        val = Number(val).toFixed(precision + 2);
        return [{ value: val, text: val }];
    },
    DATE: (val, config) => {
        if (!val) return emptyModel;
        const { format } = config;
        let setFormat = format || formatStr;
        // airTable中需对日期类数据处理，没有时分秒时补全为0
        if (setFormat.indexOf('H') === -1) {
            setFormat += ' 00';
        }
        if (setFormat.indexOf('m') === -1) {
            setFormat += ':00';
        }
        if (setFormat.indexOf('s') === -1) {
            setFormat += ':00';
        }
        val = val.format ? val.format(setFormat) : val;
        return [{ value: val, text: val }];
    },
    DATERANGE: (val, config = {}) => {
        const arr = Array.isArray(val) ? val : [];
        const { format, showTime } = config;
        let setStartFormat = format || formatStr;
        let setEndFormat = format || formatStr;
        // 如果没有传showTime,则默认按照0点到23点处理
        if (showTime) {
            // airTable中需对日期类数据处理，没有时分秒时补全为0
            if (setStartFormat.indexOf('H') === -1) {
                setStartFormat += ' 00';
            }
            if (setStartFormat.indexOf('m') === -1) {
                setStartFormat += ':00';
            }
            if (setStartFormat.indexOf('s') === -1) {
                setStartFormat += ':00';
            }
            // 结束日期
            // airTable中需对日期类数据处理，没有时分秒时补全为0
            if (setEndFormat.indexOf('H') === -1) {
                setEndFormat += ' 23';
            }
            if (setEndFormat.indexOf('m') === -1) {
                setEndFormat += ':59';
            }
            if (setEndFormat.indexOf('s') === -1) {
                setEndFormat += ':59';
            }
        } else {
            setStartFormat = 'YYYY-MM-DD 00:00:00';
            setEndFormat = 'YYYY-MM-DD 23:59:59';
        }
        const formateArr = arr
            .map((ls, index) => {
                return ls && ls.format ? ls.format(index === 0 ? setStartFormat : setEndFormat) : ls;
            })
            .join('~');
        return [
            {
                value: formateArr,
                text: formateArr,
            },
        ];
    },
    LINK: (val) => {
        return Array.isArray(val) && val.length > 0 ? val : emptyModel;
    },
    TREE_SELECT: (val) => {
        if (!val || typeof val !== 'object') return val;
        if (typeof val === 'object') {
            const values = Array.isArray(val) ? val : [val];
            return values.map((item) => {
                return { value: item.value, text: item.label };
            });
        }
    },
    CASCADER: (val, config, selectedOptions) => {
        if (!val) return val;
        if (typeof val === 'object') {
            const {
                fieldNames: { label },
            } = config;
            const values = Array.isArray(val) ? val.join('-') : val;
            let labels = '';
            if (Array.isArray(selectedOptions)) {
                labels = selectedOptions
                    .reduce((pre, cur) => {
                        pre.push(cur[label]);
                        return pre;
                    }, [])
                    .join('-');
            }
            return [{ value: values, text: labels }];
        }
        return val;
    },
    REGION: (val) => {
        if (!val || !Array.isArray(val)) return val;
        const textArr: any = [];
        const valueArr: any = [];
        val.forEach((ls: any) => {
            textArr.push(ls.label);
            valueArr.push(ls.value);
        });
        return [
            {
                text: textArr
                    .filter((ls) => {
                        return ls;
                    })
                    .join('-'),
                value: valueArr
                    .filter((ls) => {
                        return ls;
                    })
                    .join('-'),
            },
        ];
    },
};
