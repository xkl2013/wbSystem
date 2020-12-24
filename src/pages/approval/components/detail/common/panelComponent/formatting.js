import moment from 'moment';
/* eslint-disable */

export function formateValue(item) {
    const newItem1 = filterHidden(item || []);
    const newItem = formattingData(newItem1 || []);
    return newItem.map((ls) => {
        const isDisplay = !(ls && ls.behaviorResult && ls.behaviorResult.display && ls.behaviorResult.display === 0);
        return {
            ...ls,
            title: ls.title,
            isDisplay,
            name: checkoutComType(ls),
        };
    });
}

export function checkoutComType(item) {
    const { type, value } = item;
    if (!value) return value;
    if (typeof value === 'object') {
        const isArr = Array.isArray(value);
        return isArr ? returnArrayValue(value, type) : formmateDatePicker(value.name, type);
    }
    return formmateDatePicker(value, type);
}

export function returnArrayValue(arr, itemType) {
    const newArr = arr.map((item) => {
        let newitem = item;
        if (typeof item === 'object' && item) {
            newitem = item.name;
        }
        return formmateDatePicker(newitem, itemType);
    });
    return newArr.join(',');
}

export function formmateDatePicker(value, type) {
    const isData = /picker/i.test(type);
    if (!isData || !value) return value;
    return value;
}

export function formattingData(arr) {
    // 格式化日期
    return arr.map((item) => {
        if (item.type == 'datepicker') {
            item.value = item.value && moment(item.value).format('YYYY-MM-DD');
        } else if (item.type == 'timepicker' || item.type == 'rangepicker') {
            item.value = item.value && moment(item.value).format('YYYY-MM-DD HH:mm');
        }
        return item;
    });
}

export function filterHidden(arr) {
    // 过滤hidden
    return arr.filter((ls) => {
        return ls.type !== 'hidden';
    });
}
