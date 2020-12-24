// import { message } from 'antd';
// import { message } from 'antd';
// import _ from 'lodash';
import {
    // getApprovalMessage,
    getMessageCount,
    // getMessageDetail,
    updateMessage,
    updateAllMessage,
    // getApprovalMyTask,
    getMessageCountType,
} from '../services/news';

export default {
    namespace: 'message',
    state: {
        messageList: [],
        messageCountList: [],
        messageTypeList: [],
        pushMessage: {},
    },
    effects: {
        * getMessageCount(_, { call, put }) {
            const response = yield call(getMessageCount);
            if (response.success) {
                const data = response.data || [];
                const messageCountList = Array.isArray(data) ? data : [];
                yield put({ type: 'save', payload: { messageCountList } });
            }
        },
        * getMessageTypeList({ payload }, { call, put }) {
            const response = yield call(getMessageCountType, payload);
            if (response && response.success) {
                const messageTypeList = Array.isArray(response.data) ? response.data : [];
                yield put({ type: 'save', payload: { messageTypeList } });
            }
        },
        * updateAllMessage({ payload }, { call, put }) {
            const { messageModule } = payload;
            const response = yield call(updateAllMessage, { messageModule });
            if (response.success) {
                yield put({
                    type: 'getMessageCount',
                });
                // message.success(response.message);
            }
        },
        * updateMessageStatus({ payload }, { call, put }) {
            const { messageModule, messageStatus, messageIds } = payload;
            const response = yield call(updateMessage, { messageModule, messageStatus, messageIds });
            if (response.success) {
                yield put({
                    type: 'getMessageCount',
                });
            }
        },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
        updatePushMessageId(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
