import { message } from 'antd';
import { getSupplierList, addSupplier, updateSupplier, getSupplierDetail } from './service';

export default {
    namespace: 'live_supplier',
    state: {
        supplierList: [],
        supplierListPage: { page: {}, list: [] },
        formData: {},
    },
    effects: {
        * getSupplierList({ payload }, { call, put }) {
            const result = yield call(getSupplierList, payload);
            let supplierListPage = { page: {}, list: [] };
            let supplierList = [];
            if (result.success) {
                const { list, pageNum, pageSize, total } = result.data;
                supplierList = list;
                supplierListPage = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { supplierListPage, supplierList } });
        },
        * addSupplier({ payload }, { call }) {
            const result = yield call(addSupplier, payload.data);
            if (result.success) {
                message.success('新增供应商成功，请返回原页面继续操作。');
                payload.cb();
            }
        },
        * updateSupplier({ payload }, { call }) {
            const result = yield call(updateSupplier, payload.data);
            if (result.success) {
                message.success('修改成功');
                payload.cb();
            }
        },
        * getSupplierDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { formData: {} } });
            const result = yield call(getSupplierDetail, payload.id);
            let formData = {};
            if (result.success && result.data) {
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
};
