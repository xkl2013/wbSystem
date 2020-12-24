import {message} from 'antd';
import {
    getUsersList,
    addUser,
    editUser,
    getUserDetail,
    leaveOffice,
    becomeOffice,
    userDisable,
    userEnabled,
    resetPassword,
} from './services';
import {msgF} from '@/utils/utils';

export default {
    namespace: 'internal_user',

    state: {
        showQuit: false,//离职弹框显隐
        showBecomeOffice: false,//转正弹框显隐
        userList: [], // 保存组织原始结构
        formData: {},
        userListPage: {page: {}, list: []}
    },

    effects: {
        * getUserList({payload}, {call, put}) {
            const result = yield call(getUsersList, payload);
            let userListPage = {page: {}, list: []};
            let userList = [];
            let totalNum = 0;
            if (result.success === true) {
                const {list, pageNum, pageSize, total} = result.data;
                userList = list;
                totalNum = total;
                userListPage = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total
                    }
                };
            }
            yield put({type: 'save', payload: {userListPage, userList, total: totalNum}});
        },
        * addUser({payload}, {call, put}) {
            const result = yield call(addUser, payload.data);
            if (result.success === true) {
                typeof payload.cb === 'function' && payload.cb();
            }
        },
        * editUser({payload}, {call, put}) {
            const result = yield call(editUser, payload.id, payload.data);
            if (result.success === true) {
                typeof payload.cb === 'function' && payload.cb();
            }
        },
        * getUserDetail({payload}, {call, put}) {
            yield put({type: 'save', payload: {formData:{}}});
            const result = yield call(getUserDetail, payload.id);
            let formData = {};
            if (result&&result.success === true&&result.data) {
                formData = {userRoleList: result.data.userRoleList, ...result.data.user};
            }
            yield put({type: 'save', payload: {formData}});
        },
        * userDisable({payload}, {call, put}) {
            const result = yield call(userDisable, payload.id);
            if (result.success === true) {
                message.success('禁用成功');
                typeof payload.cb === 'function' && payload.cb();
            }
        },
        * userEnabled({payload}, {call, put}) {
            const result = yield call(userEnabled, payload.id);
            if (result.success === true) {
                message.success('启用成功');
                typeof payload.cb === 'function' && payload.cb();
            }
        },
        * resetPassword({payload}, {call, put}) {
            const result = yield call(resetPassword, payload.id);
            if (result.success === true) {
                message.success(msgF(' 密码已重置为888888'));
            }
        },
        * toggleModal({payload}, {_, put}) {
            yield put({type: 'save', payload});
        },
        // 离职
        * leaveOffice({payload}, {call, put}) {
            const result = yield call(leaveOffice, payload.id, payload.values);
            if (result.success === true) {
                yield put({type: 'save', payload: {showQuit: false}});
                typeof payload.cb === 'function' && payload.cb();
            }
        },
        // 转正
        * becomeOffice({payload}, {call, put}) {
            const result = yield call(becomeOffice, payload.id, payload.values);
            if (result.success === true) {
                yield put({type: 'save', payload: {showBecomeOffice: false}});
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
