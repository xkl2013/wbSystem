/* eslint-disable no-const-assign */
import _ from 'lodash';
import storage from '@/utils/storage';
import { SHIMO_DOMAIN } from './constants';

export const checkoutType = (item) => {
    const toString = Object.prototype.toString;
    const str = toString.call(item);
    const splitItem = str.split(' ')[1];
    return splitItem.replace(']', '').toLowerCase();
};

export function msgF(msg, msgDetail) {
    let r = '';
    if (msg && !msgDetail) {
        r = msg;
    }
    if (!msg && msgDetail) {
        r = msgDetail;
    }
    if (msg && msgDetail) {
        r = `${msg},${msgDetail}`;
    }
    return r;
}

/**
 * 根据relatedKey的值relatedValue获取option数组中targetKey对应的值
 * @param options       选项
 * @param relatedKey    选项相关key
 * @param relatedValue  相关key对应的值
 * @param targetKey     选项目标key
 * @returns {*}         目标key对应的值
 */
export function getOptionKeyByRelatedKey(options, relatedKey, relatedValue, targetKey = 'name') {
    const r = options.find((item) => {
        return String(item[relatedKey]) === String(relatedValue);
    });
    return r && r[targetKey];
}
/**
 * 获取option数组中id对应的name
 * @param options   选项数组{id,name}
 * @param id        指定id
 * @returns {*}     对应的name / undefined
 */
export function getOptionName(options, id) {
    const r = options.find((item) => {
        return String(item.id) === String(id);
    });
    return r && r.name;
}

export function getOptionLabel(options, id) {
    const r = options.find((item) => {
        return String(item.value) === String(id);
    });
    return r && r.label;
}

export function getOptionPath(options, id) {
    const r = options.find((item) => {
        return String(item.value) === String(id);
    });
    return r && r.path;
}

/**
 * 获取options树形结构中的所有叶子节点
 * @param options    树形结构
 * @param result     一维数组
 * @returns {Array}
 */
export function getLeafOptions(options, result = []) {
    options.map((item) => {
        if (item.isLeaf) {
            result.push(item);
        } else {
            getLeafOptions(item.children, result);
        }
    });
    return result;
}

/**
 * 字符串数组转为整型数组
 * @param arr     数组字符串数组
 * @returns {*}   整型数组
 */
export function str2intArr(arr) {
    const temp = arr.slice();
    return temp.map((item) => {
        return parseInt(item, 10);
    });
}

/**
 * 整型数组转为字符串数组
 * @param arr     整型数组
 * @returns {*}   数组字符串数组
 */
export function int2strArr(arr) {
    const temp = arr.slice();
    return temp.map((item) => {
        return item.toString();
    });
}

/**
 * 根据生日获取年龄
 * @param strBirthday   YYYY-MM-DD格式的生日字符串
 * @returns {number}    年龄数字
 */
export function birth2age(strBirthday) {
    let returnAge;
    const strBirthdayArr = strBirthday.split('-');
    const birthYear = parseInt(strBirthdayArr[0], 10);
    const birthMonth = parseInt(strBirthdayArr[1], 10);
    const birthDay = parseInt(strBirthdayArr[2], 10);

    const d = new Date();
    const nowYear = d.getFullYear();
    const nowMonth = d.getMonth() + 1;
    const nowDay = d.getDate();

    if (nowYear === birthYear) {
        returnAge = 0; // 同年 则为0岁
    } else {
        const ageDiff = nowYear - birthYear; // 年之差
        if (ageDiff > 0) {
            if (nowMonth === birthMonth) {
                const dayDiff = nowDay - birthDay; // 日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            } else {
                const monthDiff = nowMonth - birthMonth; // 月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            }
        } else {
            returnAge = -1; // 返回-1 表示出生日期输入错误 晚于今天
        }
    }

    return returnAge; // 返回周岁年龄
}

export function arr2str(arr) {
    // 数组转拼接字符串
    if (arr && arr.length > 0) {
        return arr.join('，');
    }
    return '';
}

export function str2arr(str) {
    // 字符串转数组
    if (str) {
        return str.split(',');
    }
    return [];
}

// 保留两位小数点
export function numToFixed(num = '', len = 2) {
    const newNum = Number(num);
    if (Number.isNaN(newNum)) {
        return num;
    }
    return newNum.toFixed(len);
}

// 千分位分隔
export function thousandSeparator(num = '') {
    const newNum = Number(num);
    if (Number.isNaN(newNum)) {
        return num;
    }
    return String(newNum).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 去除左右空格
export function trimSting(s) {
    return s.replace(/(^\s*)|(\s*$)/g, '');
}

// 保留两位小数，并千分位分隔
export function thousandSeparatorFixed(num = '', len = 2) {
    let newNum = Number(num);
    if (Number.isNaN(newNum)) {
        return num;
    }
    newNum = newNum.toFixed(len);
    return String(newNum).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getStrLeng(str) {
    return str.replace(/[\u0391-\uFFE5]/g, 'aa').length;
}

/**
 * 二维数组降维成一维数组
 * @param arr       二维数组
 * @returns {*[]}   一维数组
 */
function reduceDimension(arr) {
    return Array.prototype.concat.apply([], arr);
}

/**
 * 一维数组升维成二维数组，并保持每个数组位数相同
 * @param arr       一维数组
 * @param len       分隔条数，默认4
 * @param replenish 位数不足补充项，默认{}
 * @returns {*[]}   二维数组
 */
export function riseDimension(arr, len = 4, replenish = {}) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return [[]];
    }
    const originArr = arr.filter((item) => {
        return item;
    });
    let temp = [];
    const newArr = [];
    originArr.map((item) => {
        if (temp.length === len) {
            newArr.push(temp);
            temp = [];
        }
        temp.push(item);
    });
    if (temp.length > 0) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < len; i++) {
            if (!temp[i]) {
                temp.push(replenish);
            }
        }
        newArr.push(temp);
    }
    return newArr;
}

/**
 * *************慎用****************************
 * form表单动态格式化cols（暂用于表单排列顺序固定，但有显隐联动的需求）
 * @param arr     form表单cols源数据
 * @returns {*}   form表单cols修改为自动三列断行的数据
 */
export function formatFormCols(arr) {
    return arr.map((group) => {
        // 固定组不能调整
        if (group.fixed) {
            return group;
        }
        let columns = reduceDimension(group.columns);
        // 去除undefined的item
        columns = columns.filter((item) => {
            return !!item;
        });
        const result = [];
        columns.map((item, i) => {
            if (i % 3 === 0) {
                result.push([item]);
            } else {
                result[result.length - 1].push(item);
            }
        });
        // 补足空对象
        if (result.length > 0) {
            const remainder = result[result.length - 1].length % 3;
            if (remainder !== 0) {
                const fill = Array(3 - remainder).fill({});
                result[result.length - 1] = result[result.length - 1].concat(fill);
            }
        }
        return _.assign({}, group, { columns: result });
    });
}

/**
 *
 * @param form     表单实例
 * @param state    state中存储的数据对象
 * @param key      所取数据的key
 * @returns {*}    所取数据的value
 */
export function getKeyValue(form, state, key) {
    let result;
    if (form && form.props.form) {
        result = form.props.form.getFieldValue(key);
    }
    return result || state[key];
}

/*
 * @params num         需转换的数字
 * @return chineseNum  返回准换之后的中文
 */
export function toChinesNum(num) {
    const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; // changeNum[0] = "零"
    const unit = ['', '十', '百', '千', '万'];
    num = parseInt(num, 10);
    const getWan = (temp) => {
        const strArr = temp
            .toString()
            .split('')
            .reverse();
        let newNum = '';
        for (let i = 0; i < strArr.length; i += 1) {
            // eslint-disable-next-line no-nested-ternary
            newNum = (i === 0 && Number(strArr[i]) === 0
                ? ''
                : i > 0 && Number(strArr[i]) === 0 && Number(strArr[i - 1]) === 0
                    ? ''
                    : changeNum[strArr[i]] + (Number(strArr[i]) === 0 ? unit[0] : unit[i])) + newNum;
        }
        return newNum;
    };
    const overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) noWan = `0${noWan}`;
    return overWan ? `${getWan(overWan)}万${getWan(noWan)}` : getWan(num);
}

/**
 * 延迟函数
 * @param func    自定义执行函数
 * @param delay   延迟时间
 */
export function delayFunc(func, delay = 500) {
    let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        if (typeof func === 'function') {
            func();
        }
    }, delay);
}

/**
 * TODO：处理数字类型数据脱敏
 * @param data            原数据
 * @param decimal         小数位
 * @param cb              自定义处理函数
 * @returns {string|*}    处理后的数据，非数字原数据返回，数字类型如果由自定义处理函数则按自定义处理，没有则按浮点数返回
 */
export function dataMask4Number(data, decimal = 2, cb) {
    const temp = parseFloat(data);
    if (!Number.isNaN(temp) && typeof temp === 'number') {
        if (typeof cb === 'function') {
            return cb(temp);
        }
        return temp.toFixed(decimal);
    }
    return data;
}

/**
 * 判断数值类型
 * @param data          原数据
 * @returns {boolean}   是否是数值
 */
export function isNumber(data) {
    if (data === '' || data === null || Array.isArray(data)) {
        return false;
    }
    // eslint-disable-next-line no-restricted-globals
    return !isNaN(data);
}

export function getUrlParams(name) {
    // url中有多个参数的情况下取指定的参数 pageNum
    if (window.location.search) {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
}

function fetchPage(pageNum, current) {
    if (pageNum) {
        fetch(Number(pageNum));
    } else if (current) {
        fetch(Number(current));
    } else {
        fetch(1);
    }
}

/**
 *
 * @param {指定获取URL参数名} name
 * @param {传过来的页码} current
 * @param {进行请求的方法} fetch
 */

export function replacePageNum(name, current, fetch) {
    // url中只有一个参数的情况下
    const urlSearch = window.location.search;
    const pageNum = window.g_history.location.query.pageNum;
    if (urlSearch.includes('&')) {
        // eslint-disable-next-line no-shadow
        const pageNum = getUrlParams(name);
        fetchPage(pageNum, current);
    } else if (urlSearch && pageNum) {
        fetch(Number(pageNum));
    } else if (current) {
        fetch(Number(current));
    } else {
        fetch(1);
    }
}

/**
 *
 * @param len           随机树位数  默认6位
 * @param type          随机数集类型：n纯数字 l纯小写字母 u纯大写字母 lu大小写字母 默认数字字母
 * @param extra         随机数集扩展  可加其他字符
 * @returns {string}    返回随机字符串
 */

export function getRandom(len = 6, type, extra) {
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
    for (let i = 0; i < len; i += 1) {
        result += str[Math.floor(Math.random() * str.length)];
    }
    return result;
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

/*
 * 此方法用于石墨消息跳转处理
 * @params url 需要跳转石墨地址
 * @return newUrl 已经处理好的url
 */

export const handleShimoURL = (url) => {
    // 判断url是否是石墨地址
    if (url.indexOf(SHIMO_DOMAIN) !== 0) return url;
    const rUrl = new URL(url);
    const tokenExg = /(token=)([^&]*)/gi;
    const token = storage.getToken();
    if (rUrl.search.match(tokenExg)) {
        rUrl.search = rUrl.search.replace(tokenExg, `token=${token}`);
    } else {
        rUrl.search += `${rUrl.search.length ? '&' : ''}token=${token}`;
    }
    return rUrl;
};

/*
 * 石墨链接，在h5登录后，自动跳转回原地址
 * @params url 需要跳转石墨地址
 * @return  已经处理好的url
 */
export const shimoH5url = (url) => {
    const token = storage.getToken();
    return `https://mt.mttop.cn/crm/shimo/directToShimo?token=${token}&backUrl=${encodeURIComponent(url)
        || 'https://cowork.mttop.cn/desktop'}`;
};

// merge filter
export const mergeFilter = (filters, data) => {
    const oldValue = filters.filter((item) => {
        if (!data) {
            return true;
        }
        return !data[item.colName];
    });
    let temp = [];
    _.keys(data).map((key) => {
        temp = temp.concat(data[key]);
    });
    return [...oldValue, ...temp].filter((item) => {
        return item;
    });
};
/**
 * 提出原对象中指定属性
 * @param src       原对象
 * @param anti      属性名称数组
 */
export const antiAssign = (src, anti) => {
    const result = _.assign({}, src);
    Object.keys(result).map((key) => {
        if (anti.includes(key)) {
            delete result[key];
        }
    });
    return result;
};
// 处理列表页筛选条件的保存
export const toBusinessSaveParams = (businessId, params) => {
    const storeKey = `businessType-${businessId}`;
    storage.removeItem(storeKey);
    storage.setItem(storeKey, params);
};

export default {
    handleShimoURL,
    shimoH5url,
};
