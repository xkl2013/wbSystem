import { message } from 'antd';
import { msgF } from '@/utils/utils';
import { commentAdd, commentList, myCommentList } from '../services/comment';

export default {
    namespace: 'admin_comment',

    state: {
        datalist: {
            // 全部评论
            list: [],
            page: {},
        },
        dataMylist: {
            // 我的评论
            list: [],
            page: {},
        },
        interfaceName: '', // 配置的id
    },

    effects: {
        * commentAdd({ payload }, { call, put }) {
            const result = yield call(commentAdd, payload.param);
            console.log(payload.pageSize, 'pageSize');
            if (result.success === true) {
                message.success('发表成功');
                payload.calback();
                yield put({
                    type: 'commentList',
                    payload: {
                        sort: 2,
                        commentType: payload.commentType || 0,
                        pageSize: payload.pageSize || 10,
                        pageNum: 1,
                        commentBusinessId: payload.param.commentBusinessId,
                        commentBusinessType: payload.param.commentBusinessType,
                    },
                });
                yield put({
                    type: 'myCommentList',
                    payload: {
                        sort: 2,
                        commentType: payload.commentType || 0,
                        pageSize: payload.pageSize || 10,
                        pageNum: 1,
                        commentBusinessId: payload.param.commentBusinessId,
                        commentBusinessType: payload.param.commentBusinessType,
                    },
                });
            } else {
                message.error(msgF(result.message));
            }
        },
        * commentList({ payload }, { call, put }) {
            const result = yield call(commentList, payload);
            if (result.success === true) {
                yield put({ type: 'save', payload: { datalist: result.data } });
            } else {
                message.error(msgF(result.message));
            }
        },
        * myCommentList({ payload }, { call, put }) {
            const result = yield call(myCommentList, payload);
            if (result.success === true) {
                yield put({ type: 'save', payload: { dataMylist: result.data } });
            } else {
                message.error(msgF(result.message));
            }
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    subscriptions: {},
};
