import { message } from 'antd';
import { getTrailsList, addTrails, editTrails, getTrailsDetail } from './services';

export default {
    namespace: 'admin_thread',

    state: {
        companyListPage: {
            // 保存组织原始结构
            list: [],
            page: {},
        },
        trailDetailData: {}, // 线索详情 概况
        contactsAboutList: [], // 根据线索获取的联系人信息
    },

    effects: {
        * getTrailsList({ payload }, { call, put }) {
            const result = yield call(getTrailsList, payload);
            let companyListPage = {
                list: [],
                page: {},
            };
            if (result.success === true) {
                let { list } = result.data;
                const { pageNum, pageSize, total } = result.data;
                list = Array.isArray(list) ? list : [];
                companyListPage = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { companyListPage } });
        },
        // 新增线索
        * addTrails({ payload }, { call }) {
            const result = yield call(addTrails, payload.data);
            if (result && result.success) {
                message.success('添加成功');
                yield payload.cb();
            }
        },
        // 编辑线索
        * editTrails({ payload }, { call }) {
            const result = yield call(editTrails, payload.id, payload.data);
            if (result && result.success) {
                message.success('修改成功');
                yield payload.cb();
            }
        },
        // 获取线索详情概况
        * getTrailsDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { trailDetailData: {} } });
            const result = yield call(getTrailsDetail, payload.id);
            let trailDetailData = {};
            if (result && result.success && result.data) {
                trailDetailData = result.data;
            }
            yield put({ type: 'save', payload: { trailDetailData } });
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    subscriptions: {},
};
