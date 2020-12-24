import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {msgF} from '@/utils/utils';
import {getDataTree, getDataTreeDetail, getCustomizationList, pushDataTree} from './services';

export default {
    namespace: 'admin_data',


    state: {
        dataTree: [], // 数据权限数列表
        customizationList: {page: {}, list: []}, // 定制盘信息列表
        dataTreeDetail: {},
    },

    effects: {
        // 获取权限树列表
        * getDataTree({payload}, {call, put}) {
            // 获取数据权限列表
            const result = yield call(getDataTree, payload);
            let dataTree = [];
            if (result && result.success) {
                if (result.data && result.data.children) {
                    dataTree = result.data.children;
                    yield typeof payload.cb == 'function' && payload.cb();
                }
            }
            yield put({type: 'save', payload: {dataTree}});
        },
        * getCustomizationList({payload}, {call, put}) {
            // 获取定制盘信息列表
            const result = yield call(getCustomizationList, payload);
            let customizationList = {
                list: [],
                page: {},
            };
            if (result && result.success && result.data) {
                const {list, pageNum, pageSize, total} = result.data;
                customizationList = {
                    list: list,
                    page: {
                        pageSize: pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({type: 'save', payload: {customizationList}});
        },
        // 获取权限详情
        * getDataTreeDetail({payload}, {call, put}) {
            yield put({type: 'save', payload: {dataTreeDetail:{}}});
            const result = yield call(getDataTreeDetail, payload.id);
            let dataTreeDetail = {};
            if (result.success === true) {
                dataTreeDetail = result.data;
            }
            yield put({type: 'save', payload: {dataTreeDetail}});
        },
        // 更新权限详情
        * pushDataTreeDetail({payload}, {call}) {
            const result = yield call(pushDataTree, payload.data);
            if (result && result.success) {
                yield typeof payload.cb == 'function' && payload.cb();
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
