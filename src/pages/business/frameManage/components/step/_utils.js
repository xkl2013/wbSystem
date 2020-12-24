/* eslint-disable no-useless-escape */
export const toFixed = (num) => {
    return num.toFixed(2);
};
export const getFormate = (val) => {
    if (!Array.isArray(val)) return [];
    const value = JSON.stringify(val);
    let text = '';
    val.map((ls) => {
        const minStr = ls.min ? ls.min / 10000 : ls.min;
        const maxStr = ls.max ? ls.max / 10000 : ls.max;
        const taxesRateStr = ls.taxesRate ? toFixed(ls.taxesRate * 100) : ls.taxesRate;
        text += `${minStr}~${maxStr}万  ${taxesRateStr}% ;`;
    });
    return [{ value, text }];
};
export const setFormate = (val) => {
    const newArr = Array.isArray(val)
        ? val.slice().filter((ls) => {
            return ls.value;
        })
        : [];
    const value = (newArr[0] || {}).value;
    if (!value) return [];
    let returnArr = [];
    try {
        returnArr = JSON.parse(value);
        returnArr = Array.isArray(returnArr) ? returnArr : [];
    } catch (e) {
        console.log(e);
    }
    return returnArr;
};
