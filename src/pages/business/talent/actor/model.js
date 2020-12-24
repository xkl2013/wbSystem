import { message } from 'antd';
import { getStarList, addStar, editStar, getStarDetail, getContractStatus } from './services';

export default {
    namespace: 'talent_actor',

    state: {
        actorList: [], // 保存艺人列表原始结构
        actorListPage: { page: {}, list: [] }, // 保存艺人列表原始结构
        formData: {},
        ContractStatusLists: [],
    },

    effects: {
        * getContractStatus({ payload }, { call, put }) {
            const result = yield call(getContractStatus, payload.id, payload.data);
            let ContractStatusLists = [];
            if (result.success === true) {
                const { list } = result.data;
                ContractStatusLists = list;
            }
            yield put({ type: 'save', payload: { ContractStatusLists } });
        },
        * getStarList({ payload }, { call, put }) {
            const result = yield call(getStarList, payload);
            let actorListPage = { page: {}, list: [] };
            let actorList = [];
            if (result.success === true && result.data) {
                const { list, pageNum, pageSize, total } = result.data;
                actorList = list.reduce((lists, item) => {
                    // starParticipantType 参与人类型 1:经理人 2:宣传人 3:制作人 4:知会人 5:审批人 6:知会人
                    const starManagerName = (item.starUserList || []).filter((ls) => {
                        return ls.starParticipantType === 1;
                    });
                    lists.push({
                        ...item.star,
                        starManagerName,
                        starAccountList: item.starAccountList,
                        starUserList: item.starUserList,
                    });
                    return lists;
                }, []);
                actorListPage = {
                    list: actorList,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { actorListPage, actorList } });
        },
        * addStar({ payload }, { call }) {
            const result = yield call(addStar, payload.data);
            if (result.success === true) {
                message.success('添加成功');
                yield payload.cb();
            }
        },
        * editStar({ payload }, { call }) {
            const result = yield call(editStar, payload.id, payload.data);
            if (result.success === true) {
                message.success('修改成功');
                yield payload.cb();
            }
        },
        * getStarDetail({ payload }, { call, put }) {
            // yield put({ type: 'save', payload: { formData: {} } });
            const result = yield call(getStarDetail, payload.id);
            let formData = {};
            if (result && result.success === true && result.data) {
                let { star, starUserList, starAccountList } = result.data;
                star = star || {};
                starAccountList = starAccountList || [];
                starUserList = starUserList || [];
                formData = { ...star, starUserList, starAccountList };
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
