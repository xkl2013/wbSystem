import {message} from 'antd';
import {getFlowsList, delGroup, flowGroupSort, addGroup, editGroup, getFlowsDetail} from './services';

export default {
    namespace: 'admin_approval_group',

    state: {
        flowsListPage: {page: {}, list: []}, // 保存组织原始结构
        flowsDetail: {},// 分组详情
    },

    effects: {
        * getFlowsList({payload}, {call, put}) {
            const result = yield call(getFlowsList, payload);
            let flowsListPage = {
                list: [],
                page: {}
            };
            if (result.success && result.data) {
                const {list, pageNum, pageSize, total} = result.data;
                flowsListPage = {
                    list: list,
                    page: {
                        pageSize: pageSize,
                        pageNum,
                        total
                    }
                };
            }
            yield put({type: 'save', payload: {flowsListPage}});
        },

        * addGroup({payload}, {call, put}) {
            const result = yield call(addGroup, payload.data);
            if (result.success) {
                message.success('添加分组成功');
                yield payload.cb();
            }
        },
        * editGroup({payload}, {call, put}) {
            const result = yield call(editGroup, payload.data);
            if (result.success) {
                message.success('编辑分组成功');
                yield payload.cb();
            }
        },
        * delGroup({payload}, {call, put}) {
            const result = yield call(delGroup, payload.id);
            if (result.success) {
                yield typeof payload.cb == 'function' && payload.cb();
            }
        },
        * getFlowsDetail({payload}, {call, put}) {
            yield put({type: 'save', payload: {flowsDetail:{}}});
            const result = yield call(getFlowsDetail, payload);
            let flowsDetail = {};
            if (result.success && result.data) {
                flowsDetail = result.data;
            }
            yield put({type: 'save', payload: {flowsDetail}});
        },
        * flowGroupSort({payload}, {call, put}) {
            const result = yield call(flowGroupSort, payload.data);
            if (result.success) {
                yield put({type: 'getFlowsList', payload: {pageNum: payload.pageNum, pageSize: 20}});
            }
        },
    },

    reducers: {
        save(state, {payload}) {
            return {...state, ...payload};
        },
    },

    subscriptions: {},
};
