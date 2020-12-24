import { message } from 'antd';
import { routerRedux } from 'dva/router';
import storage from '@/utils/storage';
import { LoginIn, getMenuList, changePassword, changeName, wxBind } from '../services/api';
import { shimoH5url } from '@/utils/utils';

export default {
    namespace: 'login',

    state: {
        menuList: [],
        breadcrumbNameMap: {},
        userInfo: {},
    },

    effects: {
        * loginIn({ payload }, { call, put }) {
            const response = yield call(LoginIn, payload.params);
            if (response.success && response.data) {
                const userInfo = { ...response.data, userPhone: payload.params.userPhone };
                yield put({
                    type: 'loginSuccess',
                    payload: { userInfo },
                });
            } else {
                payload.callback.call(null, response.msg);
            }
        },
        * wxBind({ payload }, { call, put }) {
            // 微信绑定登录
            const response = yield call(wxBind, payload.params);
            if (response.success && response.data) {
                const userInfo = { ...response.data };
                yield put({
                    type: 'loginSuccess',
                    payload: { userInfo },
                });
            } else {
                payload.callback.call(null, response.msg);
            }
        },
        * loginSuccess({ payload }, { put }) {
            // 登录成功跳转
            const userInfo = payload.userInfo;
            if (!storage.checkCookieAuth()) {
                yield message.warn('为了更好的体验本产品,请启用cookie', 3);
            }
            storage.setUserInfo(userInfo);
            yield put({
                type: 'saveUserInfo',
                payload: { userInfo },
            });
            const params = window.g_history.location.query || {};
            if (params.redirect_url) {
                // 石墨跳转
                const newUrl = shimoH5url(params.redirect_url);
                window.location.href = newUrl || '/';
            } else {
                window.location.href = params.backUrl || '/';
            }
        },
        * getMenuList(_, { call, put }) {
            const userInfo = storage.getUserInfo() || {};
            if (!userInfo.userId && userInfo.userId !== 0) {
                yield put(routerRedux.push('/loginLayout/loginIn'));
            }
            const response = yield call(getMenuList, { API_IDS: userInfo.roleId });
            if (response.success) {
                const menuList = response.data || [];
                storage.setUserAuth(menuList);
                yield put({
                    type: 'saveMenu',
                    payload: { menuList },
                });
                yield put({ type: 'menu/getProjectTask' });
            } else {
                message.error(response.msg);
            }
        },
        * changeName({ payload }, { call, put }) {
            // 修改花名
            const response = yield call(changeName, { ...payload.params }, payload.id);
            if (response.success) {
                const userInfo = { ...storage.getUserInfo(), userName: payload.params.userNickName };
                storage.setUserInfo(userInfo);
                yield put({
                    type: 'saveUserInfo',
                    payload: { userInfo },
                });
                message.success('花名修改成功');
                payload.onClose.call();
            } else {
                payload.callback.call(null, response.msg);
            }
        },
        * changePassword({ payload }, { call, put }) {
            const response = yield call(changePassword, { ...payload.params });
            if (response.success) {
                message.success('密码修改成功');
                yield put(routerRedux.push('/loginLayout/loginIn'));
            } else {
                payload.callback.call(null, response.msg);
            }
        },
        // *changeRole({payload}, { call,put }){

        // }
    },
    reducers: {
        saveMenu(state, { payload }) {
            return { ...state, ...payload };
        },
        saveUserInfo(state, { payload = {} }) {
            const userInfo = payload.userInfo || storage.getUserInfo();
            return { ...state, ...payload, userInfo };
        },
    },
};
