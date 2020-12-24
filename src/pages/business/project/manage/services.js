import request from '@/utils/request';

// 项目列表
export async function getProjectList(data) {
    return request('/projects/', { prefix: '/crmApi', method: 'get', params: data });
}
// 新增电商直播项目
export async function addProject(data) {
    return request('/project/live/create', { prefix: '/crmApi', method: 'get', params: data });
}
// 编辑项目
export async function editProject(id, data) {
    return request(`/project/${id}`, { prefix: '/crmApi', method: 'post', data });
}

// 项目详情
export async function getProjectDetail(data) {
    return request(`/project/${data}`, { prefix: '/crmApi' });
}

// 查询审批流
export async function getInstance(data) {
    return request(`/projecting/instance/${data}`, { prefix: '/crmApi', method: 'get' });
}

// 线索列表/trails/list
export async function getTrailsList(data) {
    return request('/trails/list', { prefix: '/crmApi', method: 'post', data });
}

// 终止项目
export async function stopProject(projectId) {
    return request(`/project/${projectId}/stop`, { prefix: '/crmApi', method: 'post' });
}

// 项目结案
export async function endProject(projectId) {
    return request(`/project/${projectId}/end`, { prefix: '/crmApi', method: 'post' });
}

// 检测项目名称是否重复
export async function checkProjectName(data) {
    return request('/project/checkName', { prefix: '/crmApi', params: data });
}

// 获取项目合同列表
export async function getContractList(data) {
    return request(`/projects/${data.id}/contract/list`, { prefix: '/crmApi', method: 'post', data });
}

// 获取项目实际花费
export async function getActualExpense(data) {
    return request(`/projects/${data.id}/actualExpense`, { prefix: '/crmApi' });
}

// 获取项目预估花费
export async function getPredictExpense(data) {
    return request(`/projects/${data.id}/predictExpense`, { prefix: '/crmApi' });
}

// 获取项目结算
export async function getSettle(data) {
    return request(`/projects/${data.id}/settle`, { prefix: '/crmApi' });
}

// 添加履约义务
export async function addAppoint(projectId, data) {
    return request(`/project/${projectId}/appointment/`, { prefix: '/crmApi', method: 'post', data });
}

// 编辑履约义务
export async function editAppoint(projectId, id, data) {
    return request(`/project/${projectId}/appointment/${id}`, { prefix: '/crmApi', method: 'post', data });
}

// 删除履约义务
export async function delAppoint(projectId, id) {
    return request(`/project/${projectId}/appointment/${id}/delete`, { prefix: '/crmApi', method: 'post' });
}

// 添加授权项目
export async function addAuthorized(data) {
    return request('/project/authorized/add', { prefix: '/crmApi', method: 'post', data });
}

// 编辑授权项目
export async function editAuthorized(data) {
    return request('/project/authorized/update', { prefix: '/crmApi', method: 'post', data });
}

// 删除授权项目
export async function delAuthorized(id) {
    return request(`/project/authorized/del/${id}`, { prefix: '/crmApi', method: 'get', params: { id } });
}
// 添加回款计划
export async function addReturn(data) {
    return request('/project/return/insert', { prefix: '/crmApi', method: 'post', data });
}

// 编辑回款计划
export async function editReturn(data) {
    return request('/project/return/update', { prefix: '/crmApi', method: 'post', data });
}

// 删除回款计划
export async function delReturn(id) {
    return request(`/project/return/delete/${id}`, { prefix: '/crmApi', method: 'post' });
}
