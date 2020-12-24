import { message } from 'antd';
import {
    getContractList,
    addContract,
    getContractDetail,
    reCommit,
    reCommitByEdit,
    getCheckVerify,
    getStartVerify,
    getAuthorizedContractDetail,
} from './services';
import { msgF } from '@/utils/utils';

export default {
    namespace: 'business_project_contract',

    state: {
        contractListPage: { page: {}, list: [] }, // 保存组织原始结构
        formData: {},
    },

    effects: {
        * getContractList({ payload }, { call, put }) {
            const result = yield call(getContractList, payload);
            let contractListPage = {
                list: [],
                page: {},
            };
            if (result.success === true && result.data) {
                const data = result.data || {};
                const { contractAmount, contractCount, contractReturnAmount, contractList = {} } = data;
                const { list, pageNum, pageSize, total } = contractList || {};
                contractListPage = {
                    contractAmount,
                    contractCount,
                    contractReturnAmount,
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { contractListPage } });
        },
        * addContract({ payload }, { call }) {
            const result = yield call(addContract, payload.data);
            if (result.success === true) {
                message.success('添加成功');
                yield payload.cb();
            }
        },
        * reCommit({ payload }, { call }) {
            const result = yield call(reCommit, payload.data);
            if (result.success === true) {
                message.success('提交成功');
                yield payload.cb();
            }
        },
        * reCommitByEdit({ payload }, { call }) {
            const result = yield call(reCommitByEdit, payload.data);
            if (result.success === true) {
                message.success('提交成功');
                yield payload.cb();
            }
        },
        // 验证费用确认操作
        * getCheckVerify({ payload }, { call }) {
            const result = yield call(getCheckVerify, payload.id, payload.cb);
            if (result.success === true) {
                yield payload.cb();
            } else {
                message.error(msgF(result.message));
            }
        },
        // 发起项目费用确认操作
        * getStartVerify({ payload }, { call }) {
            const result = yield call(getStartVerify, payload.id, payload.cb);
            if (result.success === true) {
                message.success('确认成功');
                yield payload.cb();
            } else {
                message.error(msgF(result.message));
            }
        },
        * getContractDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { formData: {} } });
            const result = yield call(getContractDetail, payload.id);
            let formData = {};
            if (result && result.success && result.data) {
                formData = result.data;
            }
            yield put({ type: 'save', payload: { formData } });
        },
        // 获取项目授权公司创建子合同的详情
        * getAuthorizedContractDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { formData: {} } });
            const result = yield call(getAuthorizedContractDetail, payload.data);
            let formData = {};
            if (result && result.success && result.data) {
                formData = result.data;
            }
            yield put({ type: 'save', payload: { formData } });
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    subscriptions: {},
};
