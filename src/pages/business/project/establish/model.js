import { message } from 'antd';
import { getTrailDetail } from '@/services/globalDetailApi';
import {
    getProjectList,
    addProject,
    editProject,
    getProjectDetail,
    getInstance,
    cancelProject,
    refreshProject,
} from './services';
import { trail2projecting } from './components/trail2trailName/transfer';
import { detail2form } from './utils/transferData';

export default {
    namespace: 'establish',

    state: {
        projectListPage: { page: {}, list: [] }, // 保存组织原始结构
        formData: {},
        instanceData: {},
    },

    effects: {
        * getProjectList({ payload }, { call, put }) {
            const result = yield call(getProjectList, payload);
            let projectListPage = {
                list: [],
                page: {},
            };
            if (result.success === true && result.data) {
                const { list, total } = result.data;
                projectListPage = {
                    list,
                    page: {
                        pageSize: payload.pageSize,
                        pageNum: payload.pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { projectListPage } });
        },
        * addProject({ payload }, { call }) {
            const result = yield call(addProject, payload.data);
            if (result.success === true) {
                message.success('添加成功');
                yield payload.cb();
            }
        },
        * refreshProject({ payload }, { call }) {
            const result = yield call(refreshProject, payload.id, payload.data);
            if (result.success === true) {
                message.success('添加成功');
                yield payload.cb();
            }
        },
        * reAddProject({ payload }, { call }) {
            const result = yield call(addProject, payload.data);
            if (result.success === true) {
                message.success('添加成功');
                yield payload.cb();
            }
        },
        * editProject({ payload }, { call }) {
            const result = yield call(editProject, payload.id, payload.data);
            if (result.success === true) {
                message.success('修改成功');
                yield payload.cb();
            }
        },
        * getProjectDetail({ payload }, { call, put }) {
            const result = yield call(getProjectDetail, payload.id);
            let formData = {};
            if (result && result.success === true && result.data) {
                formData = yield call(detail2form, result.data);
            }
            yield put({ type: 'save', payload: { formData } });
        },
        // 获取线索详情概况
        * getTrailsDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { formData: {} } });
            const result = yield call(getTrailDetail, payload.id);
            let formData = {};
            if (result && result.success && result.data) {
                formData = yield call(trail2projecting, result.data);
                formData.projectingTypeComb = true;
                formData.projectingType = 1;
                formData.fromTrailDetail = true;
            }
            yield put({ type: 'save', payload: { formData } });
        },
        // 查询审批流
        * getInstance({ payload }, { call, put }) {
            const result = yield call(getInstance, payload);
            let instanceData = {};
            if (result.success === true) {
                instanceData = result.data;
            }
            yield put({ type: 'save', payload: { instanceData } });
        },
        * cancelProject({ payload }, { call }) {
            const result = yield call(cancelProject, payload.id, payload.data);
            if (result.success === true) {
                message.success('撤销成功');
                yield payload.cb();
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
