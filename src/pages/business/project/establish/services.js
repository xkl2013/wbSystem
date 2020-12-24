import request from '@/utils/request';

// 立项列表
export async function getProjectList(data) {
    return request('/projectings/', { prefix: '/crmApi', method: 'get', params: data });
}

// 新增立项
export async function addProject(data) {
    return request('/projecting/', { prefix: '/crmApi', method: 'post', data });
}

// 更新立项
export async function refreshProject(id, data) {
    return request(`/projecting/${id}`, { prefix: '/crmApi', method: 'post', data });
}

// 编辑立项
export async function editProject(id, data) {
    return request(`/projecting/${id}`, { prefix: '/crmApi', method: 'post', data });
}

// 立项详情
export async function getProjectDetail(id) {
    return request(`/projecting/${id}`, { prefix: '/crmApi' });
}

// 检测项目名称是否重复
export async function checkProjectName(data) {
    return request('/projecting/checkName', { prefix: '/crmApi', params: data });
}

// 线索列表
export async function getTrailList(data) {
    return request('/trails/list', { prefix: '/crmApi', method: 'post', data });
}

// 撤销立项
export async function cancelProject(id, data) {
    return request(`/approval/instance/${id}/cancel`, { prefix: '/approvalApi', method: 'post', data });
}

// 查询审批流
export async function getInstance(data) {
    return request(`/projecting/instance/${data}/`, { prefix: '/crmApi', method: 'get' });
}
// 下单平台客户查询
export async function getCustomePlatForm(platformId) {
    return request(`/trails/customer/${platformId}`, { prefix: '/crmApi', method: 'post' });
}
// 内容客户详情查询
export async function getContentFollowDetail(tableId, followId, data) {
    return request(`/content/follow/detail/${tableId}/${followId}`, { prefix: '/crmApi', method: 'post', data });
}
// 模糊搜索代下单项目
export async function getNormalAgentProjecting(data) {
    return request('/projecting/normal/agent/search', { prefix: '/crmApi', method: 'post', data });
}
// 模糊搜索代下单项目
export async function getNormalAgentProject(data) {
    return request('/project/normal/agent/search', { prefix: '/crmApi', method: 'post', data });
}
// 商务客户详情查询
export async function getCustomerFollowDetail(tableId, followId, data) {
    return request(`/follow/detail/${tableId}/${followId}`, { prefix: '/crmApi', method: 'post', data });
}
// 查询客户是否显示年框
export async function getYearFrame(data) {
    return request('/year/frame/field/isShown', { prefix: '/crmApi', method: 'post', data, params: data });
}
