import { message } from 'antd';
import { msgF } from '@/utils/utils';
import {
    getStatementLists,
    getStatementDetail,
    differentChange,
    statementChange,
    creatAccount,
    creatPay,
    checkPay,
    getProgressList,
} from './services';

export default {
    namespace: 'business_balance',
    state: {
        // 结算单列表
        statementData: {
            list: [],
            page: {},
            tipsData: {},
        },
        progressData: {
            list: [],
            page: {},
        },
        // 详情页数据
        detailForm: {},
    },
    effects: {
        // 获取结算单列表数据
        * getStatementLists({ payload }, { call, put }) {
            const result = yield call(getStatementLists, payload);
            let statementData = { list: [], page: {} };
            if (result.success === true) {
                const { oughtSettleAmountTrulyTotal, dividedIntoHandAmountTotal, brokerageTotal } = result.data;
                let { list } = result.data.pageInfo;
                const { pageNum, pageSize, total } = result.data.pageInfo;
                list = Array.isArray(list) ? list : [];
                statementData = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                    tipsData: {
                        oughtSettleAmountTrulyTotal,
                        dividedIntoHandAmountTotal,
                        brokerageTotal,
                        dataTotal: Array.isArray(list) ? list.length : 0,
                    },
                };
            }
            yield put({ type: 'save', payload: { statementData } });
        },
        * getProgressLists({ payload }, { call, put }) {
            const result = yield call(getProgressList, payload);
            let progressData = { list: [], page: {} };
            if (result.success === true && result.data) {
                const data = result.data || {};
                const { pageNum, pageSize, total } = data;
                const list = Array.isArray(data.list) ? data.list : [];
                progressData = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { progressData } });
        },
        // 获取结算单详情数据
        * getStatementDetail({ payload }, { call, put }) {
            const result = yield call(getStatementDetail, payload.id);
            let detailForm = {};
            if (result.success === true) {
                detailForm = result.data;
            }
            yield put({ type: 'save', payload: { detailForm } });
        },
        // 成本差异调整
        * differentChange({ payload }, { call }) {
            const result = yield call(differentChange, payload.data, payload.cb);
            if (result.success === true) {
                message.success(result.message);
                payload.cb();
            } else {
                message.error(msgF(result.message));
            }
        },
        // 结算调整
        * statementChange({ payload }, { call }) {
            const result = yield call(statementChange, payload.data, payload.cb);
            if (result.success === true) {
                message.success(result.message);
                payload.cb();
            } else {
                message.error(msgF(result.message));
            }
        },
        // 发送台账
        * creatAccount({ payload }, { call }) {
            const result = yield call(creatAccount, payload.id, payload.cb);
            if (result.success === true) {
                message.success(result.message);
                payload.cb();
            } else {
                message.error(msgF(result.message));
            }
        },
        // 发起付款
        * creatPay({ payload }, { call }) {
            const result = yield call(creatPay, payload.id, payload.cb);
            if (result.success === true) {
                message.success(result.message);
                payload.cb();
            } else {
                message.error(msgF(result.message));
            }
        },
        // 发起付款验证
        * checkPay({ payload }, { call }) {
            const result = yield call(checkPay, payload.id, payload.cb);
            if (result.success === true) {
                payload.cb();
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
