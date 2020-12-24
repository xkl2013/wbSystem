import { ADMIN_AUTH, ADMIN_USER } from '@/utils/constants';
import Cookies from 'js-cookie';


function checkCookieAuth() {
    return navigator.cookieEnabled;
}

const storage: any = {
    getItem(key: string) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.warn(e)
        }

    },
    setItem(key: string, value: any) {
        try {
            return localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(e)
        }

    },
    removeItem(key: string) {
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
        return userInfo && JSON.parse(userInfo)
    },
    // 存储用户信息
    setUserInfo(userInfo: any) {
        try {
            Cookies.set(ADMIN_USER, { ...userInfo }, { expires: 365 });
        } catch (e) {
            console.warn(e)
        }

    },
    // 清除用户信息
    clearUserInfo() {
        Cookies.remove(ADMIN_USER);
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
        return this.getItem(ADMIN_AUTH)
    },

    // 存储用户权限
    setUserAuth(token: any) {
        this.setItem(ADMIN_AUTH, token);
    },
    // 清除用户权限
    clearUserAuth() {
        this.removeItem(ADMIN_AUTH);
    },
};
storage.checkCookieAuth = checkCookieAuth;
export default storage
