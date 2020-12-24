/* eslint-disable no-undef */
import _ from 'lodash';

export const checkoutType = (item: any) => {
    const toString = Object.prototype.toString;
    const str = toString.call(item);
    const splitItem = str.split(' ')[1];
    return splitItem.replace(']', '').toLowerCase();
};

// 保留两位小数，并千分位分隔
export function thousandSeparatorFixed(num: number, len: number = 2) {
    if (isNumber(num)) {
        return num;
    }
    const newNum = num.toFixed(len);
    return newNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getStrLeng(str: string) {
    return str.replace(/[\u0391-\uFFE5]/g, 'aa').length;
}
/**
 *
 * @param len           随机树位数  默认6位
 * @param type          随机数集类型：n纯数字 l纯小写字母 u纯大写字母 lu大小写字母 默认数字字母
 * @param extra         随机数集扩展  可加其他字符
 * @returns {string}    返回随机字符串
 */

export function getRandom(len: number = 6, type?: string, extra?: string) {
    const num = '0123456789';
    const letter = 'abcdefghigklmnopqrstuvwxyz';
    const upLetter = letter.toUpperCase();
    let str = num;
    let result = '';
    switch (type) {
        case 'n':
            str = num;
            break;
        case 'l':
            str = letter;
            break;
        case 'u':
            str = upLetter;
            break;
        case 'lu':
            str = letter + upLetter;
            break;
        default:
            str = num + letter + upLetter;
            break;
    }
    if (extra && typeof extra === 'string') {
        str += extra;
    }
    for (let i = 0; i < len; i++) {
        result += str[Math.floor(Math.random() * str.length)];
    }
    return result;
}

/**
 * 提出原对象中指定属性
 * @param src       原对象
 * @param anti      属性名称数组
 */
export function antiAssign(src: object, anti: string[]) {
    const result = _.assign({}, src);
    Object.keys(result).map((key) => {
        if (anti.includes(key)) {
            delete result[key];
        }
    });
    return result;
}

/**
 * 合并样式class
 * @param className         原样式名
 * @param mergeClassName    合并样式名或方法
 * @param mergeData         合并样式方法的参数
 */
export function getMergeClassName(
    className: string | undefined,
    mergeClassName: string | Function | undefined,
    mergeData?: any,
): string {
    if (!className) {
        className = '';
    }
    if (!mergeClassName) {
        mergeClassName = '';
    }
    if (typeof mergeClassName === 'function') {
        const mergeClass = mergeClassName(mergeData);
        if (mergeClass) {
            className = `${className} ${mergeClass}`;
        }
    } else {
        className = `${className} ${mergeClassName}`;
    }
    return className;
}

/**
 * 合并样式style
 * @param style         原样式
 * @param mergeStyle    合并样式对象或方法
 * @param mergeData     合并样式方法的参数
 */
export function getMergeStyle(style: any, mergeStyle: object | Function | undefined, mergeData: any) {
    if (!style) {
        style = {};
    }
    if (!mergeStyle) {
        mergeStyle = {};
    }
    if (typeof mergeStyle === 'function') {
        _.assign(style, mergeStyle(mergeData));
    } else {
        _.assign(style, mergeStyle);
    }
    return style;
}
/**
 * 判断数值类型
 * @param data          原数据
 * @returns {boolean}   是否是数值
 */
export function isNumber(data: any) {
    if (data === '' || data === null || Array.isArray(data)) {
        return false;
    }
    // eslint-disable-next-line no-restricted-globals
    return !isNaN(data);
}
/**
 * 按key去重
 * @param data              原数组
 * @param key               过滤键
 * @returns {unknown[]}     键数组
 */
export function getKeys(data, key) {
    const result = [];
    if (Array.isArray(data)) {
        data.map((item) => {
            result.push(item[key]);
        });
    }
    const temp = new Set(result);
    return Array.from(temp);
}
