// 总和计算
export function getTipsSum(arr, val, unVal) {
    if (Array.isArray(arr) && arr.length === 0) return 0;
    let newArr;
    if (unVal !== '') {
        // 去重
        const res = new Map();
        newArr = arr.filter(a => !res.has(a[unVal]) && res.set(a[unVal], 1));
    } else {
        newArr = arr;
    }
    // 累加算和
    const result = newArr.reduce((total = 0, currentValue) => {
        return (currentValue[val] || 0) + total;
    }, 0);
    return Number(result).toFixed(2);
}
