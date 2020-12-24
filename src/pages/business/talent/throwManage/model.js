/* eslint-disable no-underscore-dangle */
import { message } from 'antd';
import {
    getGeneralizeList,
    editPopularizeSave,
    getGeneralizeDetail,
    getTotalList,
    getAnalysisList,
    getPopularizeTrend,
    getTalentAccount,
    getChannelList,
    getTagsSearchTree,
    getDictionariesList,
    getAppointment,
} from './services';

export default {
    namespace: 'throw_manage',

    state: {
        generalizeList: { page: {}, list: [] }, // 投放列表
        generalizeDetail: {}, // 投放详情
        trendList: [],
        treeData: [],
        talentAccountList: [], // 账号列表
        channelList: [], // 渠道列表
        analysisList: { page: {}, list: [] }, // 投放分析列表
        totalList: { page: {}, list: [] }, // 累计投放列表
        dictionariesList: [],
        appointment: [], // 履约义务明细列表
    },

    effects: {
        * getGeneralizeDetail({ payload }, { call, put }) {
            // 投放详情
            yield put({ type: 'save', payload: { generalizeDetail: {} } });
            const result = yield call(getGeneralizeDetail, payload.id);
            let generalizeDetail = {};
            if (result && result.success && result.data) {
                generalizeDetail = result.data;
            }
            yield put({ type: 'save', payload: { generalizeDetail } });
        },
        * getTagsSearchTree(p, { call, put }) {
            const result = yield call(getTagsSearchTree);
            let treeData = [];
            if (result && result.success && result.data) {
                const _data = (data) => {
                    return data.forEach((item, index) => {
                        if (item.children.length) {
                            _data(item.children, index + 1);
                        }
                        item.title = item.nodeName;
                        item.key = `${item.id}-${item.parentId}-${item.channel}-${index}`;
                        item.value = `${item.id}-${item.parentId}-${item.channel}-${index}`;
                        treeData = data;
                    });
                };
                _data(result.data || []);
            }
            yield put({ type: 'save', payload: { treeData } });
        },
        * getGeneralizeList({ payload }, { call, put }) {
            // 投放列表
            const result = yield call(getGeneralizeList, payload);
            let generalizeList = { page: {}, list: [] };
            if (result && result.success && result.data) {
                const { autoFansPrice, autoFansUpCount, putAmount } = result.data;
                const { list, pageNum, pageSize, total } = result.data.list;
                generalizeList = {
                    list,
                    autoFansPrice,
                    autoFansUpCount,
                    putAmount,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { generalizeList } });
        },
        * getTotalList({ payload }, { call, put }) {
            // 投放列表
            const result = yield call(getTotalList, payload);
            let totalList = { page: {}, list: [] };
            if (result && result.success && result.data) {
                const { list, pageNum, pageSize, total } = result.data;
                totalList = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { totalList } });
        },
        * editPopularizeSave({ payload }, { call }) {
            const result = yield call(editPopularizeSave, payload.data);
            if (result.success) {
                message.success('添加成功');
                yield payload.cb();
            }
        },
        * getAnalysisList({ payload }, { call, put }) {
            // 投放分析列表
            const result = yield call(getAnalysisList, payload);
            let analysisList = { page: {}, list: [] };
            if (result && result.success && result.data) {
                const { list, pageNum, pageSize, total } = result.data.list;
                analysisList = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { analysisList } });
        },
        * getPopularizeTrend({ payload }, { call, put }) {
            // 投放趋势
            const result = yield call(getPopularizeTrend, payload);
            let trendList = [];
            if (result && result.success && result.data) {
                trendList = result.data;
            }
            yield put({ type: 'save', payload: { trendList } });
        },
        * getTalentAccount({ payload }, { call, put }) {
            // 获取talent账号列表
            const result = yield call(getTalentAccount, payload);
            let talentAccountList = [];
            if (result && result.success && result.data) {
                talentAccountList = result.data;
            }
            yield put({ type: 'save', payload: { talentAccountList } });
        },
        * getChannelList({ payload }, { call, put }) {
            // 获取渠道列表
            const result = yield call(getChannelList, payload);
            let channelList = [];
            if (result && result.success && result.data) {
                channelList = result.data;
            }
            yield put({ type: 'save', payload: { channelList } });
        },
        * getDictionariesList({ payload }, { call, put }) {
            // 获取talent账号列表
            try {
                const result = yield call(getDictionariesList, payload);
                let dictionariesList = [];
                if (result && result.success && result.data) {
                    const list = result.data.list || [];
                    dictionariesList = list.reduce((list, item) => {
                        const listItem = { id: item.index, name: item.value };
                        list.push(listItem);
                        return list;
                    }, []);
                }
                yield put({ type: 'save', payload: { dictionariesList } });
            } catch (error) {
                message.error(error.message);
            }
        },
        * getAppointment({ payload }, { call, put }) {
            // 获取履约义务列表
            const result = yield call(getAppointment, payload);
            let appointment = [];
            if (result && result.success && result.data) {
                appointment = result.data.list.map((item) => {
                    return {
                        id: item.projectAppointmentId,
                        name: `${item.projectAppointmentTalentName}-${item.projectAppointmentName}`,
                        ...item,
                    };
                });
            }
            yield put({ type: 'save', payload: { appointment } });
        },
        * cleanAppointment(p, { put }) {
            // 清除履约义务列表
            yield put({ type: 'save', payload: { appointment: [] } });
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    subscriptions: {},
};
