/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
export const myBrowser = () => {
    const isOpera = userAgent.indexOf('Opera') > -1; // 判断是否Opera浏览器
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera; // 判断是否IE浏览器
    const isEdge = userAgent.indexOf('Edge') > -1; // 判断是否IE的Edge浏览器
    const isFF = userAgent.indexOf('Firefox') > -1; // 判断是否Firefox浏览器
    const isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1; // 判断是否Safari浏览器
    const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1; // 判断Chrome浏览器

    if (isIE) {
        const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
        reIE.test(userAgent);
        const fIEVersion = parseFloat(RegExp.$1);
        if (fIEVersion === 7) {
            return 'IE7';
        }
        if (fIEVersion === 8) {
            return 'IE8';
        }
        if (fIEVersion === 9) {
            return 'IE9';
        }
        if (fIEVersion === 10) {
            return 'IE10';
        }
        if (fIEVersion === 11) {
            return 'IE11';
        }
        // IE版本过低
        return 'IE';
    }
    if (isOpera) {
        return 'Opera';
    }
    if (isEdge) {
        return 'Edge';
    }
    if (isFF) {
        return 'FF';
    }
    if (isSafari) {
        return 'Safari';
    }
    if (isChrome) {
        return 'Chrome';
    }
};
// 判断系统类型
export const getOS = () => {
    const agent = userAgent.toLowerCase();
    const isMac = /macintosh|mac os x/i.test(agent);
    if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
        return 'win32';
    }
    if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
        return 'win64';
    }
    if (isMac) {
        return 'mac';
    }
};

// 判断浏览器页面tab是否处于激活状态
// 参考 https://www.cnblogs.com/csuwujing/p/10315309.html
const hiddenProperty = 'hidden' in document
    ? 'hidden'
    : 'webkitHidden' in document
        ? 'webkitHidden'
        : 'mozHidden' in document
            ? 'mozHidden'
            : null;
export const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
export const onVisibilityChange = (activeCallback, hiddenCallback) => {
    if (!document[hiddenProperty]) {
        // console.log('页面激活');
        typeof activeCallback === 'function' && activeCallback();
    } else {
        // console.log('页面非激活');
        typeof hiddenCallback === 'function' && hiddenCallback();
    }
};
