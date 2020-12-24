import {
    getFlowsList, changeGroupList, flowSort, changeFlowStatus, editFlowSetting, getFlowSetting
} from './services';
import {message} from 'antd';

export default {
    namespace: 'admin_approval_flow',

    state: {
        flowsListPage: {page: {}, list: []}, // 保存组织原始结构
        formData: {},// 返回的数据
        flowOptions: {},// 类型枚举
        showGroupModal: false,//显示分组弹框
        expandedRowKeys: [],//记录展开的行
    },

    effects: {
        * getFlowsList({payload}, {call, put}) {
            const result = yield call(getFlowsList, payload);
            let flowsListPage = {
                list: [],
                page: {}
            };
            if (result.success === true && result.data) {
                const {list, pageNum, pageSize, total} = result.data;
                flowsListPage = {
                    list: list,
                    page: {
                        pageSize: pageSize,
                        pageNum,
                        total
                    }
                };
            }
            yield put({type: 'save', payload: {flowsListPage}});
        },
        * changeGroupList({payload}, {call, put}) {
            const result = yield call(changeGroupList, payload.id, payload.data);
            if (result.success === true) {
                yield put({type: 'save', payload: {showGroupModal: false}});
                typeof payload.cb == 'function' && payload.cb();
            }
        },
        * flowSort({payload}, {call, put}) {
            const result = yield call(flowSort, payload);
            if (result.success === true) {
                yield put({type: 'getFlowsList', payload: {pageNum: 1, pageSize: 20}});
            }
        },
        * changeFlowStatus({payload}, {call, put}) {
            const result = yield call(changeFlowStatus, payload);
            if (result.success === true) {
                yield put({type: 'getFlowsList', payload: {pageNum: 1, pageSize: 20}});
            }
        },
        * editFlowSetting({payload}, {call, put}) {
            const result = yield call(editFlowSetting, payload.data, payload.flowId);
            if (result.success === true) {
                message.success('配置成功');
                yield typeof payload.cb == 'function' && payload.cb();
            }
        },

        * getFlowSetting({payload}, {call, put}) {
            yield put({type: 'save', payload: {formData:{}, flowOptions:{}}});
            const result = yield call(getFlowSetting, payload);
            let formData = {}, flowOptions = {};
            if (result && result.success === true && result.data) {
                result.data.forEach((item) => {
                    formData[`type${item.dataType}`] = String(item.dataValue);
                    item.dataTypeValues && item.dataTypeValues.forEach((el) => {
                        el.id = String(el.dataType);
                        el.name = el.dataTypeName;
                    })
                    flowOptions[`FLOW_TYPE_${item.dataType}`] = item.dataTypeValues
                })
            }
            yield put({type: 'save', payload: {formData, flowOptions}});
        },
        * toggleModal({payload}, {_, put}) {
            yield put({type: 'save', payload});
        },
    },

    reducers: {
        save(state, {payload}) {
            return {...state, ...payload};
        },
    },

    subscriptions: {},
};
