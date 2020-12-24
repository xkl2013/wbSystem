import { message } from 'antd';
import storage from '@/utils/storage';
import { msgF } from '@/utils/utils';
import Socket from '@/utils/socket';
import Alert from '@/components/alert';
import { getOS, myBrowser } from '@/utils/userAgent';
import { chromeMac, chromeWin32, chromeWin64 } from '@/utils/constants';
import React from 'react';
import { socketInstancePath } from '../services/socket';
import { getDepartmentList, getUserInfo } from '../services/api';

function handleOnline() {
    const isOnline = navigator.onLine;
    if (!isOnline) {
        Alert.onBrokenLine({ message: '网络已不可用，请检查你的网络设置' });
    }
}
function initIndicator(callback) {
    setTimeout(handleOnline, 1000);
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
}
const renderMsg = () => {
    const os = getOS();
    let url = chromeWin64;
    if (os === 'win32') {
        url = chromeWin32;
    } else if (os === 'mac') {
        url = chromeMac;
    }
    return (
        <p>
            为了让大家享受更加流畅的apollo系统体验，请点击下载
            <a download href={url} style={{ textDecoration: 'underline' }}>
                谷歌浏览器
            </a>
        </p>
    );
};
export default {
    namespace: 'admin_global',
    state: {
        departmentsList: [], // 组织结构
    },
    effects: {
        * initData(_, { put }) {
            // 全局调用
            yield put({
                type: 'getUserInfo',
            });
        },
        * initFEData(_, { put }) {
            yield put({ type: 'message/getMessageCount' }); // 发起获取消息
            const { pathname } = window.location;
            // 获取审批数量,防止重复调用,在初始化的时候做一下校验
            if (pathname !== '/foreEnd/approval/approval') {
                yield put({ type: 'admin_news/getApprovalMyTask' });
            }
        },
        * getUserInfo(_, { call, put }) {
            // 获取用户信息
            const response = yield call(getUserInfo);
            if (response && response.success) {
                const data = response.data || {};
                const userInfo = storage.getUserInfo() || {};
                storage.setUserInfo({ ...userInfo, ...data });
                // 从新拉取权限列表

                yield put({ type: 'login/getMenuList' });
            }
        },

        * getDepartmentList(_, { call, put }) {
            const result = yield call(getDepartmentList, {});
            if (!result.success) {
                message.error(msgF(result.message));
            }
            const departmentsList = result.data ? [result.data] : [];
            yield put({ type: 'save', payload: { departmentsList } });
        },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ history, dispatch }) {
            let socket = null;
            // 检测网络情况
            initIndicator(() => {
                // handleOnline();
                if (socket && socket.reConnectService) {
                    socket.reConnectService();
                }
            });

            history.listen((location) => {
                // Alert.onBrokenLine({ message: '网络已不可用，请检查你的网络设置' });
                const states = socket ? socket.getSocketStates() : false;
                if (location.pathname.indexOf('/foreEnd') >= 0 && !states) {
                    socket = new Socket({
                        path: socketInstancePath(),
                        sendMessage: (value = {}) => {
                            const {
                                messageId,
                                messageType,
                                extraMsgObj: { messageModule },
                            } = value;
                            if (!messageId) return;
                            dispatch({
                                type: 'initFEData',
                                payload: value,
                            });
                            dispatch({
                                type: 'message/updatePushMessageId',
                                payload: { pushMessage: { messageId, messageModule, messageType } },
                            });
                        },
                    });
                }
                // 检测浏览器提醒
                let timer = setTimeout(() => {
                    const browser = myBrowser();
                    if (browser !== 'Chrome') {
                        Alert.openNotice({ message: renderMsg() });
                    }
                    clearTimeout(timer);
                    timer = null;
                }, 2000);
            });
        },
        // checkBrowser() {
        //     let timer = setTimeout(() => {
        //         const browser = myBrowser();
        //         if (browser !== 'Chrome') {
        //             Alert.openNotice({ message: renderMsg() });
        //         }
        //         clearTimeout(timer);
        //         timer = null;
        //     }, 2000);
        // },
    },
};
