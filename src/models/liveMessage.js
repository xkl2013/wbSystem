// import { message } from 'antd';
/* eslint-disable */

import { getRandom } from '@/utils/utils';

export default {
    namespace: 'liveMessage',
    state: {
        ws: null, // ws 实例
        userList: [],
        onReceiveMsg: null,
        opMsgList: [],
    },
    effects: {
        // 设置ws实例
        *setWsInstance({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    ws: payload.ws,
                },
            });
        },
        // 设置userList
        *setUserList({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    userList: payload.userList,
                },
            });
        },
        // 关闭连接
        *close({ payload }, { call, put, select }) {
            const ws = yield select((state) => state.liveMessage.ws);
            ws && ws.closeSocket();
        },
        // 发送消息
        /*
         *  @messageData
         * {userId:number,liveId:number,tableId:number,rowId:number,columnCode:string,status:number}
         */
        *sendMessage({ payload }, { call, put, select }) {
            const ws = yield select((state) => state.liveMessage.ws);
            ws && ws.sendData(payload.messageData);
        },
        // 业务注册接收消息的方法
        *register({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    onReceiveMsg: payload.onReceiveMsg,
                },
            });
        },
        // 执行 业务消息方法
        *receiveMsgCallback({ payload }, { call, put, select }) {
            const onReceiveMsg = yield select((state) => state.liveMessage.onReceiveMsg);
            const opMsgList = yield select((state) => state.liveMessage.opMsgList);
            const callbackId = `${new Date().getTime()}${getRandom(6)}`;
            if (opMsgList.length === 0) {
                onReceiveMsg && onReceiveMsg(payload, callbackId);
            }
            opMsgList.push({
                payload,
                callbackId,
            });
            yield put({
                type: 'save',
                payload: {
                    opMsgList: opMsgList,
                },
            });
        },
        // 执行 业务消息方法
        *reCallMsgCallback({ payload }, { call, put, select }) {
            const onReceiveMsg = yield select((state) => state.liveMessage.onReceiveMsg);
            const opMsgList = yield select((state) => state.liveMessage.opMsgList);
            if (opMsgList.length > 0) {
                const first = opMsgList[0];
                if (first.callbackId === payload.callbackId) {
                    opMsgList.shift();
                }
                const next = opMsgList[0];
                if (next) {
                    onReceiveMsg && onReceiveMsg(next.payload, next.callbackId);
                }
                yield put({
                    type: 'save',
                    payload: {
                        opMsgList: opMsgList,
                    },
                });
            }
        },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
