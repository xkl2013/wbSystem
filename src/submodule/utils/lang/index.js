import en_US from './en_US';
import zh_CN from './zh_CN';

// 语言包字段获取方法
export default function (key) {
    const lang = (localStorage && localStorage.getItem('lang')) || 'zh_CN';
    let wholeObj = {};

    if (lang === 'zh_CN') {
        wholeObj = zh_CN;
    } else if (lang === 'en_US') {
        wholeObj = en_US;
    }

    return wholeObj[key] || '';
}
