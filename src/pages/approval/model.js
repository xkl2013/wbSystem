import {
    getApprovalsList,
    getFlowGroups,
    getFlowTypes,
    getProjectDetail,
    getInstance,
    getApprlvalDetail,
    getApprovalCommerceLists,
    getApplyCommerceLists,
    getCommerceDetail,
    getExecutorData,
    getApprovalReimburseList,
    getApprovalApplicationList,
} from './services';

export default {
    namespace: 'admin_approval',

    state: {
        approvalsListPage: {
            // 保存组织原始结构
            list: [],
            page: {},
        },
        flowGroups: [],
        flowTypes: [],
        formData: {}, // 立项详情数据
        instanceData: {}, // 审批流数据
        apprlvalDetail: {}, // 审批详情数据
        commerceApprovalLists: {
            list: [],
            page: {},
        }, // 合同商务条款审批 - 审核列表
        commerceApplyLists: {
            list: [],
            page: {},
        }, // 合同商务条款审批 - 发起列表
        commerceApprovalBusinessLists: {
            list: [],
            page: {},
        }, // 合同商务条款审批 - 审核列表 - 商务
        commerceApplyBusinessLists: {
            list: [],
            page: {},
        }, // 合同商务条款审批 - 发起列表 - 商务
        commerceDetail: {},
        executorListPage: {
            list: [],
            userInfo: {},
            page: {},
        }, // 发起人详情
    },

    effects: {
        // 费用报销
        * getApprovalReimburseList({ payload }, { call, put }) {
            const result = yield call(getApprovalReimburseList, payload);
            let approvalReimburseLists = { list: [], page: {}, totalFee: 0 };
            if (result.success === true) {
                const { pageNum, pageSize, total = 0 } = result.data.reimburseVoList;
                let { list } = result.data.reimburseVoList;
                const { totalFee } = result.data;
                list = Array.isArray(list) ? list : [];
                approvalReimburseLists = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                    totalFee,
                };
            }
            yield put({ type: 'save', payload: { approvalReimburseLists } });
        },
        // 费用申请
        * getApprovalApplicationList({ payload }, { call, put }) {
            const result = yield call(getApprovalApplicationList, payload);
            let approvalApplicationLists = { list: [], page: {}, totalFee: 0 };
            if (result.success === true) {
                const { pageNum, pageSize, total = 0 } = result.data.applications;
                let { list } = result.data.applications;
                const { totalFee } = result.data;
                list = Array.isArray(list) ? list : [];
                approvalApplicationLists = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                    totalFee,
                };
            }
            yield put({ type: 'save', payload: { approvalApplicationLists } });
        },
        // 合同条款审批 - 获取审核列表
        * getApprovalCommerceLists({ payload }, { call, put }) {
            const result = yield call(getApprovalCommerceLists, payload);
            let commerceApprovalLists = { list: [], page: {} };
            if (result.success === true) {
                const { list, pageNum, pageSize, total } = result.data;
                const lists = Array.isArray(list) ? list : [];
                commerceApprovalLists = {
                    list: lists,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { commerceApprovalLists } });
        },
        // 合同条款审批 - 获取审核列表 - 商务
        * getApprovalCommerceBusinessLists({ payload }, { call, put }) {
            const result = yield call(getApprovalCommerceLists, payload);
            let commerceApprovalBusinessLists = { list: [], page: {} };
            if (result.success === true) {
                const { list, pageNum, pageSize, total } = result.data;
                const lists = Array.isArray(list) ? list : [];
                commerceApprovalBusinessLists = {
                    list: lists,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { commerceApprovalBusinessLists } });
        },
        // 合同条款审批 - 获取发起列表
        * getApplyCommerceLists({ payload }, { call, put }) {
            const result = yield call(getApplyCommerceLists, payload);
            let commerceApplyLists = { list: [], page: {} };
            if (result.success === true) {
                const { list, pageNum, pageSize, total } = result.data;
                const lists = Array.isArray(list) ? list : [];
                commerceApplyLists = {
                    list: lists,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { commerceApplyLists } });
        },
        // 合同条款审批 - 获取发起列表 - 商务
        * getApplyCommerceBusinessLists({ payload }, { call, put }) {
            const result = yield call(getApplyCommerceLists, payload);
            let commerceApplyBusinessLists = { list: [], page: {} };
            if (result.success === true) {
                const { list, pageNum, pageSize, total } = result.data;
                const lists = Array.isArray(list) ? list : [];
                commerceApplyBusinessLists = {
                    list: lists,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { commerceApplyBusinessLists } });
        },
        // 合同条款审批 - 获取详情
        * getCommerceDetail({ payload }, { call, put }) {
            const result = yield call(getCommerceDetail, payload.id);
            let commerceDetail = [];
            if (result.success === true) {
                const { data } = result.data;
                commerceDetail = Array.isArray(data) ? data : [];
            }
            yield put({ type: 'save', payload: { commerceDetail } });
        },
        * getApprovalsList({ payload }, { call, put }) {
            const result = yield call(getApprovalsList, payload);
            let approvalsListPage = { list: [], page: {} };
            if (result.success === true) {
                const { list, pageNum, pageSize, total } = result.data;
                const lists = Array.isArray(list) ? list : [];
                approvalsListPage = {
                    list: lists,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { approvalsListPage } });
        },
        * getFlowGroups({ payload }, { call, put }) {
            const result = yield call(getFlowGroups, payload);
            let flowGroups = [];
            if (result.success === true) {
                const { list } = result.data;
                flowGroups = Array.isArray(list) ? list : [];
            }
            yield put({ type: 'save', payload: { flowGroups } });
        },
        * getFlowTypes({ payload }, { call, put }) {
            const result = yield call(getFlowTypes, payload);
            let flowTypes = [];
            if (result.success === true) {
                const { list } = result.data;
                flowTypes = Array.isArray(list) ? list : [];
            }
            yield put({ type: 'save', payload: { flowTypes } });
        },
        * getProjectDetail({ payload }, { call, put }) {
            // 获取立项详情数据
            const result = yield call(getProjectDetail, payload.id);
            let formData = {};
            yield put({ type: 'save', payload: { formData } });
            if (result.success === true && result.data) {
                const { projecting, projectingUsers, projectBudgets, trail } = result.data;
                formData = {
                    ...projecting,
                    projectingUsers: projectingUsers || [],
                    projectBudgets: projectBudgets || [],
                    trail: trail || {},
                };
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
        // 获取审批详情数据
        * getApprlvalDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { apprlvalDetail: {} } });
            const result = yield call(getApprlvalDetail, payload);
            let apprlvalDetail = {};
            if (result.success === true) {
                apprlvalDetail = result.data;
                if (payload.cb) {
                    payload.cb();
                }
            }
            yield put({ type: 'save', payload: { apprlvalDetail } });
        },
        // 获取审批发起人详情数据
        * getExecutorData({ payload }, { call, put }) {
            const result = yield call(getExecutorData, payload);
            let executorListPage = { list: [], userInfo: {}, page: {} };
            if (result.success === true) {
                const { list, pageNum, pageSize, total } = result.data;
                const lists = Array.isArray(list) ? list : [];
                const userInfo = lists.reduce((user, item) => {
                    return Object.assign({}, user, item.userVO);
                }, {});
                executorListPage = {
                    list: lists,
                    userInfo,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { executorListPage } });
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    subscriptions: {},
};
