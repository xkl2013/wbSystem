import request from '@/utils/request';

// 查询角色列表
export async function getRoleList(data) {
    return request('/roles/list', { method: 'post', data });
}
// 查询角色列表无成员
export async function getRoleList2(data) {
    return request('/roles/list2', { method: 'post', data });
}
// 查询角色列表无成员
export async function getRoleUsers(role_id) {
    return request(`/roles/${role_id}/users`, { method: 'get' });
}
// 新增
export async function addRole(data) {
    return request('/roles', { method: 'post', data, headers: { 'Content-Type': 'application/json' } });
}
// 添加角色成员
export async function addRoleMembers(roleId, data) {
    return request(`/roles/${roleId}/users`, { method: 'post', data });
}

// 删除角色成员
export async function delMember(data) {
    return request(`/roles/${data.roleId}/users/${data.userId}`, { method: 'delete' });
}
// 编辑
export async function editRole(data, id) {
    return request(`/roles/${id}`, { method: 'post', data });
}
// 删除
export async function delRole(data) {
    return request(`/roles/${data}`, { method: 'delete' });
}

// 详情
export async function roleDetail(data) {
    return request(`/roles/${data}`);
}
// 角色全部菜单集合(后端菜单配置)
export async function fullmenusRoleList(data) {
    return request(`/roles/${data}/fullmenus`);
}

// 全部权限
export async function menusList() {
    return request('/menus/list');
}
