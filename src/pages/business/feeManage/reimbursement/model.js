import {message} from 'antd';
import {
    getReimburses,
    exportReimburses,
    addReimburse,
    editReimburse,
    getReimburseDetail,
    resubmitReimburse,
    reimbursePayList,
    putReimbursePayInfo,
} from './services';
import {msgF} from '@/utils/utils';
import li from "eslint-plugin-jsx-a11y/src/util/implicitRoles/li";

export default {
    namespace: 'business_fee_reimburse',

    state: {
        reimbursesList: [], // 保存艺人列表原始结构
        reimbursesListPage: {page: {}, list: []}, // 保存艺人列表原始结构
        formData: {},
    },

    effects: {
        * getReimburses({payload}, {call, put}) {
            const result = yield call(getReimburses, payload);
            let reimbursesListPage = {page: {}, list: []};
            let reimbursesList = [];
            if (result.success === true) {
                const {
                    reimburseVoList: {list, pageNum, pageSize, total},
                    totalFee,
                } = result.data;
                reimbursesList = list;
                reimbursesListPage = {
                    list,
                    totalFee,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({type: 'save', payload: {reimbursesListPage, reimbursesList}});
        },
        * reimbursePayList({payload}, {call}) {
            const result = yield call(reimbursePayList, payload);
        },
        * exportReimburses({payload}, {call}) {
            const result = yield call(exportReimburses, payload);
            // yield call(tagLoad, result, '');
        },
        // 报销修改报销单付款信息
        * putReimbursePayInfo({payload}, {call, put}) {
            const result = yield call(putReimbursePayInfo, payload.data);
            if (result.success === true) {
                yield typeof payload.cb == 'function' && payload.cb();
            }
        },
        * addReimburse({payload}, {call, put}) {
            const result = yield call(addReimburse, payload.data);
            if (result.success === true) {
                message.success('新增成功');
                payload.cb();
            }
        },
        * editReimburse({payload}, {call, put}) {
            const result = yield call(editReimburse, payload.data);
            if (result.success === true) {
                message.success('编辑成功');
                payload.cb();
            }
        },
        * resubmitReimburse({payload}, {call, put}) {
            const result = yield call(resubmitReimburse, payload.data);
            if (result.success === true) {
                message.success('提交成功');
                payload.cb();
            }
        },
        * getReimburseDetail({payload}, {call, put}) {
            yield put({type: 'save', payload: {formData:{}}});
            const result = yield call(getReimburseDetail, payload.id);
            let formData = {};
            if (result.success === true && result.data) {
                formData = result.data;
            }
            yield put({type: 'save', payload: {formData}});
        },
    },

    reducers: {
        save(state, {payload}) {
            return {...state, ...payload};
        },
    },

    subscriptions: {},
};
