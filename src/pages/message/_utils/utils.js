import moment from 'moment';

const formatDate = 'YYYY-MM-DD';
const formatTime = 'HH:mm';
export const handleDateTime = (dateTime) => {
    return moment(dateTime).format(formatTime);
};
export const setDateGroup = (data = []) => {
    if (!Array.isArray(data)) return [];
    const dateMap = new Map();
    const nowDate = moment().format(formatDate);
    data.forEach((item) => {
        let dateTime = item.messageDatetime;
        if (!dateTime || typeof dateTime !== 'string') {
            dateTime = '';
        }
        const messageDate = moment(dateTime).format(formatDate);
        const offsetDays = moment(messageDate).diff(nowDate, 'days');
        if (!dateMap.has(offsetDays)) {
            dateMap.set(offsetDays, []);
        }
        const originData = dateMap.get(offsetDays);
        dateMap.set(offsetDays, [...originData, item]);
    });
    return dateMap;
};
export const checkoutShowText = (key, item = []) => {
    const obj = item.find((ls) => {
        return ls;
    }) || {};
    if (key >= -2) {
        return { 0: '今天', '-1': '昨天', '-2': '前天' }[key];
    }
    if (key >= -30 && key < -2) {
        return moment(obj.messageDatetime || '').format('MM/DD');
    }
    return moment(obj.messageDatetime || '').format('YYYY/MM/DD');
};
export const showFormateDate = (time) => {
    if (!time) return time;
    const nowDate = moment().format(formatDate);
    const timeFormateStr = moment(time).format(formatDate);
    const offsetDays = moment(timeFormateStr).diff(nowDate, 'days', true);
    // 判断是否是今天
    if (offsetDays === 0) {
        return moment(time).format(formatTime);
    }
    if (offsetDays === -1) {
        // 判断是昨天
        return `昨天 ${moment(time).format(formatTime)}`;
    }
    // 判断是否是同一年
    if (moment(timeFormateStr).isSame(nowDate, 'year')) {
        return moment(time || '').format('MM/DD HH:mm');
    }
    return moment(time || '').format('YYYY/MM/DD HH:mm');
};
// 匹配整个关键词 不拆分
export function highlight(text, words, tag, className) {
    // 默认的标签，如果没有指定，使用span
    const newTag = tag || 'span';
    let newWords = words || '';
    let newText = text || '';
    // 匹配每一个特殊字符 ，进行转义
    const specialStr = ['*', '.', '?', '+', '$', '^', '[', ']', '{', '}', '|', '\\', '(', ')', '/', '%'];
    specialStr.forEach((item) => {
        if (newWords.indexOf(item) !== -1) {
            newWords = newWords.replace(new RegExp(`\\${item}`, 'g'), `\\${item}`);
        }
    });
    // 匹配整个关键词
    const re = new RegExp(newWords, 'g');
    if (re.test(newText)) {
        newText = newText.replace(re, `<${newTag} class=${className}>$&</${newTag}>`);
    }
    return newText;
}
