/**
 * 新标签打开指定路径
 * @param path   相对路径
 * @param params 参数对象
 */
export const openUrl = (path, params) => {
    const origin = window.location.origin;
    let url = `${origin + path}?`;
    Object.keys(params).map((key) => {
        url += `${key}=${params[key]}&`;
    });
    url = url.substr(0, url.length - 1);
    window.open(url, '_blank');
};

/**
 * 获取当前路径的参数map或指定参数
 * @param key          指定参数key
 * @returns {string}   返回指定参数的值value / 全部参数的对象
 */
export const getSearch = (key) => {
    let search = window.location.search;
    search = search.substr(1);
    if (key) {
        const reg = new RegExp(`${key}=([^&]*)(&|$)`, 'i');
        const arr = search.match(reg);
        return arr && arr[1];
    }
    const map = {};
    search.split('&').map((arr) => {
        const temp = arr.split('=');
        map[temp[0]] = temp[1];
    });
    return map;
};
export default {
    openUrl,
    getSearch,
};
