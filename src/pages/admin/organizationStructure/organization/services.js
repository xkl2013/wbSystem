import request from '@/utils/request';

// 查询组织列表
export async function getDepartmentList(data) {
    return request('/departments/list', { method: 'post', data });
}

// 新增组织
export async function addDepartment(data) {
    return request('/departments', { method: 'post', data });
}

// 编辑组织
export async function editDepartment(id, data) {
    return request(`/departments/${id}`, { method: 'post', data });
}

// 组织详情
export async function getDepartmentDetail(id) {
    return request(`/departments/${id}`);
}

// 删除组织
export async function delDepartment(id) {
    return request(`/departments/${id}`, { method: 'delete' });
}

// 设置boss
export async function userSetBoss(id) {
    return request(`/users/${id}/setBoss`, { method: 'post' });
}

// 取消boss
export async function userCancelBoss(id) {
    return request(`/users/${id}/cancelBoss`, { method: 'post' });
}

// 内部用户列表
export async function getUsersList(data) {
    return request('/users/list', { method: 'post', data });
}

// 设置部门主管
export async function setDepartmentHeader(data) {
    return request('/departments/setDepartmentHeader', { method: 'post', data });
}

// 批量转移
export async function batchTransfer(data) {
    return request('/users/transfer/batch', { method: 'post', data });
}
