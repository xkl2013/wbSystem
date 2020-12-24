import { message } from 'antd';
import { detail2form } from '@/pages/business/project/manage/utils/transferData';
import {
    getProjectList,
    getInstance,
    addProject,
    editProject,
    getProjectDetail,
    getActualExpense,
    getPredictExpense,
    getContractList,
    getSettle,
    addAppoint,
    editAppoint,
    delAppoint,
    addAuthorized,
    editAuthorized,
    delAuthorized,
    addReturn,
    editReturn,
    delReturn,
} from './services';

export default {
    namespace: 'business_project_manage',

    state: {
        projectListPage: { page: {}, list: [] }, // 保存组织原始结构 项目列表
        contractListPage: { page: {}, list: [] }, // 项目合同列表
        actualExpenseList: [],
        predictExpenseList: [],
        settleList: [],
        instanceData: [], // 审批流源数据
        formData: {}, // 项目详情数据
    },

    effects: {
        * getProjectList({ payload }, { call, put }) {
            // 获取项目列表
            const result = yield call(getProjectList, payload);
            if (result.success === true) {
                if (!result.data) {
                    return;
                }
                const { list, pageNum, pageSize, total } = result.data;
                const projectListPage = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
                yield put({ type: 'save', payload: { projectListPage } });
            }
        },
        * getInstance({ payload }, { call, put }) {
            // 查询审批流
            const result = yield call(getInstance, payload);
            let instanceData = [];
            if (result.success === true) {
                instanceData = result.data;
            }
            yield put({ type: 'save', payload: { instanceData } });
        },
        * addProject({ payload }, { call }) {
            // 编辑详情
            const result = yield call(addProject, payload.data);
            if (result.success === true) {
                message.success('新增成功');
                yield payload.cb();
            }
        },
        * editProject({ payload }, { call }) {
            // 编辑详情
            const result = yield call(editProject, payload.id, payload.data);
            if (result.success === true) {
                message.success('修改成功');
                yield payload.cb();
            }
        },
        * getProjectDetail({ payload }, { call, put }) {
            // 项目详情
            yield put({ type: 'save', payload: { formData: {} } });
            const result = yield call(getProjectDetail, payload.id);
            let formData = {};
            if (result && result.success && result.data) {
                formData = yield call(detail2form, result.data);
                yield put({
                    type: 'getInstance',
                    payload: result.data.project.instanceId,
                });
            }
            yield put({ type: 'save', payload: { formData } });
        },
        // 获取世纪费用
        * getActualExpense({ payload }, { call, put }) {
            const result = yield call(getActualExpense, payload);
            if (result.success) {
                const actualExpenseList = result.data;
                yield put({ type: 'save', payload: { actualExpenseList } });
            }
        },
        * getPredictExpense({ payload }, { call, put }) {
            const result = yield call(getPredictExpense, payload);
            if (result.success) {
                const predictExpenseList = result.data;
                yield put({ type: 'save', payload: { predictExpenseList } });
            }
        },
        * getSettle({ payload }, { call, put }) {
            const result = yield call(getSettle, payload);
            if (result.success) {
                const settleList = result.data;
                yield put({ type: 'save', payload: { settleList } });
            }
        },

        * getContractList({ payload }, { call, put }) {
            // 获取项目合同列表
            const result = yield call(getContractList, payload);
            if (result.success === true) {
                if (!result.data) {
                    return;
                }
                const { list, pageNum, pageSize, total } = result.data;
                const contractListPage = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
                yield put({ type: 'save', payload: { contractListPage } });
            }
        },
        // 添加履约义务
        * addAppoint({ payload }, { call }) {
            const result = yield call(addAppoint, payload.projectId, payload.data);
            if (result.success === true && typeof payload.cb === 'function') {
                payload.cb();
            }
        },
        // 编辑履约义务
        * editAppoint({ payload }, { call }) {
            const result = yield call(editAppoint, payload.projectId, payload.id, payload.data);
            if (result.success === true && typeof payload.cb === 'function') {
                payload.cb();
            }
        },
        // 删除履约义务
        * delAppoint({ payload }, { call }) {
            const result = yield call(delAppoint, payload.projectId, payload.id);
            if (result.success === true && typeof payload.cb === 'function') {
                payload.cb();
            }
        },
        // 添加授权项目
        * addAuthorized({ payload }, { call }) {
            const result = yield call(addAuthorized, payload.data);
            if (result.success === true && typeof payload.cb === 'function') {
                payload.cb();
            }
        },
        // 编辑授权项目
        * editAuthorized({ payload }, { call }) {
            const result = yield call(editAuthorized, payload.data);
            if (result.success === true && typeof payload.cb === 'function') {
                payload.cb();
            }
        },
        // 删除授权项目
        * delAuthorized({ payload }, { call }) {
            const result = yield call(delAuthorized, payload.id);
            if (result.success === true && typeof payload.cb === 'function') {
                payload.cb();
            }
        },
        // 添加回款计划
        * addReturn({ payload }, { call }) {
            const result = yield call(addReturn, payload.data);
            if (result.success === true && typeof payload.cb === 'function') {
                payload.cb();
            }
        },
        // 编辑回款计划
        * editReturn({ payload }, { call }) {
            const result = yield call(editReturn, payload.data);
            if (result.success === true && typeof payload.cb === 'function') {
                payload.cb();
            }
        },
        // 删除回款计划
        * delReturn({ payload }, { call }) {
            const result = yield call(delReturn, payload.id);
            if (result.success === true && typeof payload.cb === 'function') {
                payload.cb();
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
