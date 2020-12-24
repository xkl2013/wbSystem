import request from '@/utils/request';
import { BUCKET } from '@/utils/constants';

/*
 *  登录接口
 */
export async function LoginIn(data) {
    return request('/casLogin', {
        method: 'POST',
        data,
        prefix: '/loginApi',
    });
}
/*
 *  修改密码接口
 */
export async function changePassword(data) {
    return request('/users/changePassword', {
        method: 'POST',
        data,
        prefix: '/adminApi',
    });
}
/*
 * 获取菜单列表接口呀
 */
export async function getMenuList(data) {
    return request('/roles/{id}/menus', {
        data,
    });
}
/* 获得石墨登录认证URL
 */
export async function getLoginPath() {
    return request('/shimo/getLoginPath', {
        method: 'get',
        prefix: '/crmApi',
    });
}
/*
 *  修改昵称接口
 */
export async function changeName(data, id) {
    return request(`/users/${id}/updatePersonalInfo`, {
        method: 'POST',
        data,
    });
}

export async function getUserAuthList(data) {
    return request('/token/login', {
        method: 'POST',
        data,
    });
}
// 模糊搜索花名和用户
export async function checkNickName(data) {
    return request('/users/checkNickName', { method: 'post', data });
}
/*
 * 获取用户对应的角色信息信息
 * params：{userId}
 * */
export async function CurrentUserListRole(params) {
    return request('/account/listRole', { params, prefix: '/oldApi' });
}

// 根据userId和token,获取权限列表
export async function getPrivilegeList(params) {
    return request('/user/getPrivilegeList', { params });
}

// 查询组织列表
export async function getDepartmentList(data) {
    return request('/departments/list', { method: 'post', data });
}
// 查询组织列表(不统计人数)
export async function getDepartmentListNoNum() {
    return request('/departments/listWithoutUserAmount', { method: 'get' });
}

// 文件上传获取token
export function getToken() {
    const bucket = BUCKET[process.env.BUILD_ENV || 'production'];
    return request('/qiniu/token', { method: 'get', prefix: '/adminApi', params: { bucket } });
}
// 获取地区接口
export async function getCitys() {
    return request('https://static.mttop.cn/202001Citys.json', { method: 'get', hideErrorMessage: true, prefix: '' });
}
/*
 *  获取登录用户当前的角色集合
 */
export async function getUserInfo() {
    return request('/users/detail', {
        method: 'get',
        prefix: '/adminApi',
    });
}
/*
 *  获取登录用户当前的角色集合
 */
export async function getUserRoleList() {
    return request('/users/role/list', {
        method: 'get',
        prefix: '/adminApi',
    });
}
/*
 *  切换当前角色
 */
export async function changeUserRole(role_id, data) {
    return request(`/roles/${role_id}/switch`, {
        method: 'post',
        data,
        prefix: '/adminApi',
    });
}

/*
 *  获取模块角色人列表,105看板模块
 */
export async function getModulesRole(moduleType) {
    const obj = { kanban: 105 };
    if (!obj[moduleType]) return;
    return request(`/data/${obj[moduleType]}/users`, {
        method: 'get',
        prefix: '/adminApi',
    });
}

/* 获取微信登录二维码地址
 */
export async function getQRCodeUrl() {
    return request('/wx/getQRCodeUrl', {
        method: 'get',
        prefix: '/loginApi',
    });
}

/* 获取微信登录后回调
 */
export async function getWxCallBack(params) {
    return request('/wx/wxCallBack', {
        method: 'get',
        params,
        prefix: '/loginApi',
    });
}

/*
 *  微信绑定
 */
export async function wxBind(data) {
    return request('/wx/wxBind', {
        method: 'POST',
        data,
        prefix: '/loginApi',
    });
}
/*
 *  微信解绑
 */
export async function wxUnBind(data) {
    return request('/wx/wxUnbind', {
        method: 'POST',
        data,
        prefix: '/loginApi',
    });
}
/*
 *  获取版本信息
 */
export async function getAppVersion() {
    return request('/users/getAppInfo', {
        method: 'get',
        prefix: '/adminApi',
    });
}
/*
 *  更新版本信息
 */
export async function updateAppVersion() {
    return request('/users/updateLastVersion', {
        method: 'post',
        prefix: '/adminApi',
    });
}
