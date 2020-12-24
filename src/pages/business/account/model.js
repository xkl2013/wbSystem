import {
    postEarningData,
    postCostingData,
    postExpensesData,
    exportEarning,
    checkNCIds,
    syncNCIds,
    getSyncTaskList,
    getCostingDetail,
    putCostingDetail,
    postTravelData,
} from './services';
import { message } from 'antd';
import { msgF } from '@/utils/utils';

export default {
    namespace: 'business_account',
    state: {
        // 项目合同收入台帐列表
        earningData: {
            list: [],
            page: {},
            moneyTips: {},
        },
        costingData: {
            list: [],
            page: {},
            moneyTips: {},
        },
        expensesData: {
            list: [],
            page: {},
            moneyTips: {},
        },
        travelData: {
            list: [],
            page: {},
            moneyTips: {},
        },
        checkoutArr: {
            invalidIds: [],
            validIds: [],
        },
        taskList: [],
        costDetail: {},
    },
    effects: {
        // 合同成本台账详情
        * putCostingDetail({ payload }, { call, put }) {
            const result = yield call(putCostingDetail, payload.data);
            if (result.success === true) {
                yield payload.cb();
            }
        },
        // 合同成本台账详情
        * getCostingDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { costDetail: {} } });
            const result = yield call(getCostingDetail, payload.id);
            let costDetail = {};
            if (result.success === true) {
                costDetail = result.data;
            }
            yield put({ type: 'save', payload: { costDetail } });
        },
        * postEarningData({ payload }, { call, put }) {
            const result = yield call(postEarningData, payload);
            let earningData = { list: [], page: {}, moneyTips: {} };
            if (result.success === true) {
                let { list, pageNum, pageSize, total } = result.data;
                list = Array.isArray(list) ? list : [];
                earningData = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                    moneyTips: {},
                };
            }
            yield put({ type: 'save', payload: { earningData } });
        },
        * postCostingData({ payload }, { call, put }) {
            const result = yield call(postCostingData, payload);
            let costingData = { list: [], page: {}, moneyTips: {}, };
            if (result.success === true) {
                let { list, pageNum, pageSize, total } = result.data;
                list = Array.isArray(list) ? list : [];
                costingData = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                    moneyTips: {},
                };
            }
            yield put({ type: 'save', payload: { costingData } });
        },
        * postExpensesData({ payload }, { call, put }) {
            const result = yield call(postExpensesData, payload);
            let expensesData = { list: [], page: {}, moneyTips: {}, };
            if (result.success === true) {
                let { list, pageNum, pageSize, total } = result.data;
                list = Array.isArray(list) ? list : [];
                expensesData = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                    moneyTips: {},
                };
            }
            yield put({ type: 'save', payload: { expensesData } });
        },
        * exportEarningFile({ payload }, { call }) {
            const result = yield call(exportEarning, payload);
        },
        // 检查NC资格
        * checkNCIds({ payload }, { call, put }) {
            const result = yield call(checkNCIds, payload.type, payload.data);
            if (result.success === true) {
                const invalidIds = result.data.invalidIds;
                const validIds = result.data.validIds;
                const checkoutArr = {
                    invalidIds,
                    validIds,
                };
                yield put({
                    type: 'save',
                    payload: { checkoutArr },
                });
            } else {
                message.error(msgF(result.message));
            }
        },
        // 同步NC
        * syncNCIds({ payload }, { call, put }) {
            const result = yield call(syncNCIds, payload.type, payload.data);
            if (result.success === true) {
                return result;
            } else {
                message.error(msgF(result.message));
            }
        },
        // NC任务队列
        * getSyncTaskList({ payload }, { call, put }) {
            // const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            // let whildStatus = true;
            // while (whildStatus) {

            //     if (result.success === true) {
            //         const taskList = result.data;

            //         const pollArr = [];
            //         taskList.map(item => {
            //             pollArr.push(item.status);
            //         });
            //         if (pollArr.indexOf(0) < 0) {
            //             whildStatus = false;
            //             clearTimeout();
            //         }
            //         yield put({
            //             type: 'save',
            //             payload: { taskList },
            //         });
            //         yield call(delay, 10000);
            //     } else {
            //         whildStatus = false;
            //         clearTimeout();
            //         message.error(msgF(result.message));
            //     }
            // }
            const result = yield call(getSyncTaskList, payload.type);
            let taskList = [];
            if (result.success === true) {
                taskList = result.data;
            }
            yield put({ type: 'save', payload: { taskList } });
        },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {},
};
