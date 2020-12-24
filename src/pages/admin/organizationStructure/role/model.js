import { routerRedux } from 'dva/router';
import {
    getRoleList2, getRoleUsers, addRole, editRole, roleDetail, delRole, menusList,
} from './services';

export default {
    namespace: 'admin_role',

    state: {
        roleList: [], // 保存角色列表
        selectId: null, // 角色列表默认展示id
        roleUsers: [], // 角色成员默认展示列表
        editPermission: {}, // 编辑和查看页面
        addPermissionList: [], // 新增页面的权限树
        showModal: false, // 添加角色成员
    },

    effects: {
        * getRoleList({ payload }, { call, put }) {
            const response = yield call(getRoleList2, (payload && payload.data) || {});
            let roleList = [];
            let roleUsers = [];
            let selectId = null;
            if (response && response.success && response.data) {
                roleList = response.data || [];
                if (Array.isArray(roleList) && roleList[0] && roleList[0].roleId) {
                    selectId = roleList[0].roleId;
                    const res = yield call(getRoleUsers, selectId);
                    if (res && res.success && res.data) {
                        roleUsers = res.data || [];
                    }
                }
            }
            yield put({ type: 'save', payload: { roleList, roleUsers, selectId } });
        },
        * menusList({ payload }, { call, put }) {
            const result = yield call(menusList, payload.id);
            let addPermissionList = [];
            if (result && result.success && result.data) {
                addPermissionList = result.data || [];
            }
            yield put({ type: 'save', payload: { addPermissionList } });
        },
        * addRole({ payload }, { call, put }) {
            const result = yield call(addRole, payload);
            if (result.success === true) {
                yield put(routerRedux.push('/admin/orgStructure/role'));
            }
        },
        * editRole({ payload }, { call, put }) {
            const result = yield call(editRole, payload.body, payload.id);
            if (result.success === true) {
                yield put(routerRedux.push('/admin/orgStructure/role'));
            }
        },
        * roleDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { editPermission: {} } });
            const result = yield call(roleDetail, payload.id);
            let editPermission = {};
            if (result.success === true) {
                editPermission = result.data;
            }
            yield put({ type: 'save', payload: { editPermission } });
        },
        * delRole({ payload }, { call }) {
            const res = yield call(delRole, payload.id);
            if (res && res.success && typeof payload.cb === 'function') {
                payload.cb();
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
