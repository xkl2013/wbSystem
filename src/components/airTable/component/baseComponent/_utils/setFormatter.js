export const formatStr = 'YYYY-MM-DD HH:mm';
export const emptyModel = [{ text: '', value: '' }];

export const SetFormatter = {
    TEXT: (event) => {
        const node = event.currentTarget || {};
        return [{ value: node.value, text: node.value }];
    },
    LINK: (event) => {
        const node = event.currentTarget || {};
        return [{ value: node.value, text: node.value }];
    },
    SELECT: (val) => {
        // 处理成[{}]结构
        if (!val) return val;
        if (typeof val === 'object') {
            const values = Array.isArray(val) ? val : [val];
            return values.map((item) => {
                return { value: item.key, text: item.label };
            });
        }
        return val;
    },
    MULTIPLE_SELECT: (val) => {
        // 处理成[{}]结构
        if (!val) return val;
        if (typeof val === 'object') {
            const values = Array.isArray(val) ? val : [val];
            return values.map((item) => {
                return { value: item.key, text: item.label };
            });
        }
        return val;
    },
    SEARCH: (val) => {
        if (!val || typeof val !== 'object') return val;
        if (typeof val === 'object') {
            const values = Array.isArray(val) ? val : [val];
            return values.map((item) => {
                return {
                    value: item.fieldValueValue || item.key,
                    text: item.fieldValueName || item.label,
                };
            });
        }
    },
    DATE: (val, config) => {
        if (!val) return val;
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
        const formatVal = val.format ? val.format(setFormat) : val;
        return [{ value: formatVal, text: formatVal }];
    },
    FILE: (val) => {
        if (!val) return null;
        return val.map((item) => {
            return { value: item.value, text: `${item.name}(${item.size})` };
        });
    },
    DEPARTMENT: (val) => {
        if (!val || typeof val !== 'object') return val;
        if (typeof val === 'object') {
            const values = Array.isArray(val) ? val : [val];
            return values.map((item) => {
                return { value: item.value, text: item.label };
            });
        }
    },
    RATE: (val) => {
        return [{ value: val, text: val }];
    },
    TEXT_SEARCH: (val) => {
        // 处理成[{}]结构
        if (!val) return val;
        if (typeof val === 'object') {
            const values = Array.isArray(val) ? val : [val];
            return values.map((item) => {
                return { value: item.value, text: item.label };
            });
        }
        return val;
    },
    NUMBER: (val) => {
        return [{ value: val, text: val }];
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
    RANGE_PICKER: (val, config = {}) => {
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
                return ls.format ? ls.format(index === 0 ? setStartFormat : setEndFormat) : ls;
            })
            .join('~');
        return [
            {
                value: formateArr,
                text: formateArr,
            },
        ];
    },
    TAXES_RATE: (val) => {
        return [{ value: val, text: val }];
    },
};
export default {
    formatStr,
    emptyModel,
    SetFormatter,
};
