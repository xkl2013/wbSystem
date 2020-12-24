import {
    getColumnConfig,
    setHideConfig,
    getOperateConfig,
    setOperateConfig,
    getDataSource,
    getGroupDataSource,
    addOrUpdateDataSource,
    delData,
} from '../services/airTable';
import BIModal from "@/ant_components/BIModal";

export default {
    namespace: 'global_airTable',

    state: {
        columnConfig: [],
        operateConfig: {
            filterConfig: [],
            groupConfig: [],
            sortConfig: [],
        },
        dataSource: [],
        pageConfig: {},
        editRowId: null,
    },

    effects: {
        * getColumnConfig({payload}, {call, put}) {
            const result = yield call(getColumnConfig, payload);
            if (result.success === true) {
                yield put({type: 'save', payload: {columnConfig: result.data}});
            }
        },
        * setHideConfig({payload}, {call, put}) {
            const result = yield call(setHideConfig, payload.data);
            if (result.success === true) {
                typeof payload.cb === 'function' && payload.cb();
            }
        },
        * getOperateConfig({payload}, {call, put}) {
            const result = yield call(getOperateConfig, payload.tableId);
            if (result.success === true) {
                const {filterList, groupList, sortList} = result.data;
                yield put({
                    type: 'save',
                    payload: {
                        operateConfig: {
                            filterConfig: filterList || [],
                            groupConfig: groupList || [],
                            sortConfig: sortList || [],
                        },
                    },
                });
                yield typeof payload.cb === 'function' && call(payload.cb, true, groupList && groupList.length > 0);
            }
        },
        * setOperateConfig({payload}, {call, put}) {
            const result = yield call(setOperateConfig, payload.tableId, payload.data);
            if (result.success === true) {
                typeof payload.cb === 'function' && payload.cb();
            }
        },
        * getDataSource({payload}, {select, call, put}) {
            const data = {
                pageNum: payload.pageConfig.pageNum,
                pageSize: payload.pageConfig.pageSize,
            };
            const result = yield call(getDataSource, payload.tableId, data);
            if (result.success === true) {
                const dataSource = result.data.list || [];
                const pageConfig = {
                    pageNum: result.data.pageNum,
                    pageSize: result.data.pageSize,
                    hasNextPage: result.data.hasNextPage,
                    nextPage: result.data.nextPage,
                };
                const editRowId = yield select(state => state.global_airTable.editRowId);
                if (editRowId) {
                    if (!dataSource.some(item => item.id === editRowId)) {
                        BIModal.warning({
                            title: '基于现有筛选或排序条件该条记录不会在当前页面显示',
                        });
                    }
                }
                yield put({
                    type: 'save',
                    payload: {
                        dataSource: payload.dataSource.concat(dataSource),
                        pageConfig,
                        editRowId: null
                    },
                });
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * addOrUpdateDataSource({payload}, {call, put}) {
            const result = yield call(addOrUpdateDataSource, payload.data);
            if (result.success === true) {
                yield put({
                    type: 'save',
                    payload: {
                        editRowId: result.data,
                    },
                });
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * delData({payload}, {call, put}) {
            const result = yield call(delData, payload.data);
            if (result.success === true) {
                typeof payload.cb === 'function' && payload.cb();
            }
        },
    },

    reducers: {
        save(state, {payload}) {
            return {...state, ...payload};
        },
    },

    subscriptions: {},
};
