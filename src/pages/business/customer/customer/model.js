import { message } from 'antd';
import {
    addCustomer,
    getContactsAboutList,
    getCustomerControlList,
    getCustomerDetail,
    updateCustomer,
    addAgentCustomer,
    getIndustryList,
    updateAgentCustomer,
} from './services';

export default {
    namespace: 'customer_customer',
    state: {
        companyListPage: {
            // 保存组织原始结构
            list: [],
            page: {},
        },
        trailDetailData: {}, // 线索详情 概况
        CustomerDetailData: {}, // 线索详情 概况
        contactsAboutList: [], // 根据线索获取的联系人信息
        customerListPage: {
            // 保存组织原始结构
            list: [],
            page: {},
        },
        industryList: [],
    },
    effects: {
        // 客户管理列表
        * getCustomerControlList({ payload }, { call, put }) {
            const result = yield call(getCustomerControlList, payload);
            let customerListPage = { list: [], page: {} };
            if (result.success === true) {
                let { list } = result.data;
                const { pageNum, pageSize, total } = result.data;

                list = Array.isArray(list) ? list : [];
                customerListPage = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { customerListPage } });
        },
        * getIndustryList({ payload }, { call, put }) {
            const result = yield call(getIndustryList, payload);
            let industryList = [];
            if (result.success) {
                industryList = result.data;
            }
            yield put({ type: 'save', payload: { industryList } });
        },
        // 新增直客
        * addCustomer({ payload }, { call }) {
            const result = yield call(addCustomer, payload.data);
            if (result.success) {
                message.success('新增成功');
                // 重复数据进行展示
                if (typeof payload.cb === 'function') {
                    payload.cb(result);
                }
            }
        },
        // 编辑直客
        * updateCustomer({ payload }, { call }) {
            const result = yield call(updateCustomer, payload.data);
            if (result.success) {
                message.success('编辑成功');
                if (typeof payload.cb === 'function') {
                    payload.cb(result);
                }
            }
        },
        // 新增代理
        * addAgentCustomer({ payload }, { call }) {
            const result = yield call(addAgentCustomer, payload.data);
            if (result.success) {
                message.success('新增成功');
                if (typeof payload.cb === 'function') {
                    payload.cb(result);
                }
            }
        },
        // 编辑代理
        * updateAgentCustomer({ payload }, { call }) {
            const result = yield call(updateAgentCustomer, payload.data);
            if (result.success) {
                message.success('编辑成功');
                if (typeof payload.cb === 'function') {
                    payload.cb(result);
                }
            }
        },

        // 获取客户详情概况
        * getCustomerDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { customerDetail: {} } });
            const result = yield call(getCustomerDetail, payload.id);
            let customerDetail = {};
            if (result.success) {
                customerDetail = result.data;
            }
            yield put({ type: 'save', payload: { customerDetail } });
        },
        // 获取客户详情联系人
        * getContactsAboutList({ payload }, { call, put }) {
            const result = yield call(getContactsAboutList, payload.id);
            let contactsAboutList = [];
            if (result.success) {
                contactsAboutList = result.data;
            }
            yield put({ type: 'save', payload: { contactsAboutList } });
        },
        // 获取线索详情概况
        * getCustomerDetailData({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { CustomerDetailData: {} } });
            const result = yield call(getCustomerDetail, payload);
            let CustomerDetailData = {};
            if (result.success) {
                CustomerDetailData = result.data;
            }
            yield put({ type: 'save', payload: { CustomerDetailData } });
        },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {},
};
