import { message } from 'antd';
import {
    getTravelOrderList,
    getTravelOrderDetail,
    postTravelOrderAudit,
    postTravelOrderModifyRate,
    postTravelOrderPaymentConfirm,
} from './services';
import { msgF } from '@/utils/utils';

export default {
    namespace: 'admin_travelOrder',

    state: {
        TravelListPage: {
            // 保存组织原始结构
            list: [],
            page: {},
        },
        TravelDetailData: {}, // 线索详情 概况
        orderDetailData: {
            order: {},
            orderApply: {},
        },
        applicationDetailData: {},
        invoiceDetailData: {},
        serviceInvoiceData: [],
        orderInvoiceData: [],
    },

    effects: {
        * getTravelOrderList({ payload }, { call, put }) {
            // 差旅列表
            const result = yield call(getTravelOrderList, payload);
            if (result.success === true) {
                const { list, pageNum, pageSize, total } = result.data;
                const lists = Array.isArray(list) ? list : [];
                const TravelListPage = {
                    list: lists,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
                yield put({ type: 'save', payload: { TravelListPage } });
            } else {
                message.error(msgF(result.message));
            }
        },
        * getTravelOrderDetail({ payload }, { call, put }) {
            // 差旅详情
            const result = yield call(getTravelOrderDetail, payload);
            if (result.success === true) {
                const serviceInvoiceData = [];
                const orderInvoiceData = [];
                const orderDetailData = result.data;
                const invoice = orderDetailData.orderInvoices || [];
                invoice.forEach((item) => {
                    if (item.orderInvoiceCategory === 1) {
                        orderInvoiceData.push(item);
                    } else if (item.orderInvoiceCategory === 2) {
                        serviceInvoiceData.push(item);
                    }
                });
                yield put({ type: 'save', payload: { orderDetailData, serviceInvoiceData, orderInvoiceData } });
            } else {
                message.error(msgF(result.message));
            }
        },
        * postTravelOrderModifyRate({ payload }, { call }) {
            // 修改税率
            const result = yield call(postTravelOrderModifyRate, payload);
            if (result.success === true) {
                message.success('修改成功');
                yield payload.cb();
            } else {
                message.error(msgF(result.message));
            }
        },
        * postTravelOrderPaymentConfirm({ payload }, { call }) {
            // 付款确认
            const result = yield call(postTravelOrderPaymentConfirm, payload);
            if (result.success === true) {
                yield payload.cb();
            } else {
                message.error(msgF(result.message));
            }
        },
        * postTravelOrderAudit({ payload }, { call }) {
            // 审核
            const result = yield call(postTravelOrderAudit, payload);
            if (result.success === true) {
                // yield payload.cb();
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
