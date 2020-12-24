import {message} from 'antd';
import {
    getApply,
    addApply,
    editApply,
    getApplyDetail,
    resubmitApply,
    applicationPayList,
    putApplicationPayInfo,
} from './services';
import {msgF} from '@/utils/utils';

export default {
    namespace: 'business_fee_apply',

    state: {
        applyList: [], // 保存艺人列表原始结构
        applyListPage: {page: {}, list: []}, // 保存艺人列表原始结构
        formData: {},
    },

    effects: {
        * getApply({payload}, {call, put}) {
            const result = yield call(getApply, payload);
            let applyListPage = {page: {}, list: []};
            let applyList = [];
            if (result.success === true) {
                const {
                    applications: {list, pageNum, pageSize, total},
                    totalFee,
                } = result.data;
                applyList = list;
                applyListPage = {
                    list,
                    totalFee,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({type: 'save', payload: {applyListPage, applyList}});
        },
        * addApply({payload}, {call, put}) {
            const result = yield call(addApply, payload.data);
            if (result.success === true) {
                message.success('新增成功');
                payload.cb();
            }
        },
        // 申请修改报销单付款信息
        * putApplicationPayInfo({payload}, {call, put}) {
            const result = yield call(putApplicationPayInfo, payload.data);
            if (result.success === true) {
                yield typeof payload.cb == 'function' && payload.cb();
            }
        },
        * applicationPayList({payload}, {call}) {
            const result = yield call(applicationPayList, payload);
        },
        * editApply({payload}, {call, put}) {
            const result = yield call(editApply, payload.data);
            if (result.success === true) {
                message.success('编辑成功');
                payload.cb();
            }
        },
        * resubmitApply({payload}, {call, put}) {
            const result = yield call(resubmitApply, payload.data);
            if (result.success === true) {
                message.success('提交成功');
                payload.cb();
            }
        },
        * getApplyDetail({payload}, {call, put}) {
            yield put({type: 'save', payload: {formData:{}}});
            const result = yield call(getApplyDetail, payload.id);
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
