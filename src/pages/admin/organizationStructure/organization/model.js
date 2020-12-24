import { message } from 'antd';
import {
    getDepartmentList,
    userSetBoss,
    userCancelBoss,
    addDepartment,
    editDepartment,
    delDepartment,
    getUsersList,
    setDepartmentHeader,
} from './services';

export default {
    namespace: 'admin_org',

    state: {
        formData: {}, // 添加/编辑部门时缓存数据
        departmentsList: [],
        departmentsListPage: {},
        userListPage: {
            list: [],
            page: {},
        },
        cachedData: null,
    },

    effects: {
        * getDepartmentList({ payload }, { call, put }) {
            const result = yield call(getDepartmentList, payload);
            let departmentsList = [];
            if (result && result.success && result.data) {
                departmentsList = [result.data];
            }
            yield put({ type: 'save', payload: { departmentsList } });
        },
        * addDepartment({ payload }, { call }) {
            const result = yield call(addDepartment, payload.data);
            if (result.success === true) {
                message.success('添加成功');
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * editDepartment({ payload }, { call }) {
            const result = yield call(editDepartment, payload.id, payload.data);
            if (result.success === true) {
                message.success('修改成功');
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * delDepartment({ payload }, { call }) {
            const result = yield call(delDepartment, payload.id);
            if (result.success === true) {
                message.success('删除成功');
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * userSetBoss({ payload }, { call }) {
            const result = yield call(userSetBoss, payload.id);
            if (result.success === true) {
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * setDepartmentHeader({ payload }, { call }) {
            const result = yield call(setDepartmentHeader, payload.data);
            if (result.success === true) {
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * userCancelBoss({ payload }, { call }) {
            const result = yield call(userCancelBoss, payload.id);
            if (result.success === true) {
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * getUserListPage({ payload }, { call, put }) {
            const result = yield call(getUsersList, payload);
            let userListPage = {
                list: [],
                page: {},
            };
            if (result.success === true && result.data) {
                const { list, pageNum, pageSize, total } = result.data;
                userListPage = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { userListPage } });
        },
        * saveCache({ payload }, { put }) {
            yield put({ type: 'save', payload: { cachedData: payload } });
        },
        // eslint-disable-next-line no-empty-pattern
        * clearCache({}, { put }) {
            yield put({ type: 'save', payload: { cachedData: null } });
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    subscriptions: {},
};
