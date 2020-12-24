import Cookies from 'js-cookie';
import { ADMIN_AUTH, ADMIN_USER, ADMIN_APP_TOKEN } from './constants';

/* eslint-disable no-underscore-dangle */
function checkCookieAuth() {
    return navigator.cookieEnabled;
}

const storage = {
    getItem(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.warn(e);
        }
    },
    setItem(key, value) {
        try {
            return localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(e);
        }
    },
    removeItem(key) {
        localStorage.removeItem(key);
    },
    /*
     * 获取token
     * */
    getToken() {
        const info = this.getUserInfo() || {};
        return `${info.token || ''}`;
    },
    /*
获取共享domain的token
*/
    setDomainToken(token) {
        Cookies.set(ADMIN_APP_TOKEN, token, { expires: 365 });
    },
    /*
     * 获取用户信息
     * return object || null
     * */
    getUserInfo() {
        // 优先从督学模块拿取cookie参数,其次再去local中去取
        if (!checkCookieAuth()) {
            const login = window.g_app ? window.g_app._store.getState().login : {};
            return login.userInfo;
        }

        const userInfo = Cookies.get(ADMIN_USER);
        return userInfo && JSON.parse(userInfo);
    },
    // 存储用户信息
    setUserInfo(userInfo = {}) {
        try {
            Cookies.set(ADMIN_USER, { ...userInfo }, { expires: 365 });
            storage.setDomainToken(userInfo.token);
        } catch (e) {
            console.warn(e);
        }
    },
    // 清除用户信息
    clearUserInfo() {
        Cookies.remove(ADMIN_USER);
        Cookies.remove(ADMIN_APP_TOKEN);
    },

    /*
     * 获取用户权限
     * return object || null
     * */
    getUserAuth() {
        if (!checkCookieAuth()) {
            const login = window.g_app ? window.g_app._store.getState().login : {};
            return login.menuList;
        }
        return this.getItem(ADMIN_AUTH);
    },

    // 存储用户权限
    setUserAuth(token) {
        this.setItem(ADMIN_AUTH, token);
    },
    // 清除用户权限
    clearUserAuth() {
        this.removeItem(ADMIN_AUTH);
    },
};
storage.checkCookieAuth = checkCookieAuth;
export default storage;
