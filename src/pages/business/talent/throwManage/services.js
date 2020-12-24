import request from '@/utils/request';

// 投放列表查询接口
export async function getGeneralizeList(data) {
    return request('/popularize/list', { method: 'post', data, prefix: '/crmApi' });
}

// 累计投放列表
export async function getTotalList(data) {
    return request('/popularize/total/list', { method: 'post', data, prefix: '/crmApi' });
}

// 新增/编辑投放
export async function editPopularizeSave(data) {
    return request('/popularize/save', { method: 'post', data, prefix: '/crmApi' });
}

//  查询投放详情
export async function getGeneralizeDetail(id) {
    return request(`/popularize/detail/${id}`, { prefix: '/crmApi' });
}

// 投放分析列表查询接口
export async function getAnalysisList(data) {
    return request('/popularize/analysis', { method: 'post', data, prefix: '/crmApi' });
}
// 投放趋势
export async function getPopularizeTrend(data) {
    return request('/popularize/trend', { method: 'post', data, prefix: '/crmApi' });
}
// 获取talent账号列表
export async function getTalentAccount(data) {
    return request('/select/talent/account/query', { method: 'post', data, prefix: '/crmApi' });
}
// 获取渠道列表
export async function getChannelList(id) {
    return request(`/popularize/channel/list/${id}`, { prefix: '/crmApi' });
}
// 获取投放标签的树结构
export async function getTagsTree(data) {
    return request('/popularize/tags/tree', { prefix: '/crmApi', method: 'post', data });
}

// 获取投放列表查询标签的树结构
export async function getTagsSearchTree() {
    return request('/popularize/tags/tree', { prefix: '/crmApi', method: 'get' });
}
// 投放标签新增
export async function addTags(data) {
    return request('/popularize/tags/add', { prefix: '/crmApi', method: 'post', data });
}
// 投放标签删除
export async function deleteTags(tagId) {
    return request(`/popularize/tags/${tagId}`, { prefix: '/crmApi', method: 'delete' });
}
// 投放标签确认删除
export async function confirmDelTags(tagId) {
    return request(`/popularize/tags/${tagId}`, { prefix: '/crmApi' });
}
// 获取执行链接
export async function getExecuteUrl(projectId) {
    return request(`/project/${projectId}/appointment`, { prefix: '/crmApi' });
}

// 项目列表
export async function getProjectList(data) {
    return request('/v2/projects/list/nonCancel', { prefix: '/crmApi', method: 'post', data });
}
// 投放分组字典
export async function getDictionariesList(data) {
    return request('/dictionaries/list', { method: 'post', data });
}

// 根据项目获得履约义务列表
export async function getAppointment(projectId) {
    return request(`/project/${projectId}/appointment`, { prefix: '/crmApi' });
}
// 获取档期详情
export async function getScheduleDetail(id) {
    return request(`/talent/calendar/get/${id}`, { prefix: '/crmApi' });
}

// 根据投放渠道ID和投放类型获取供应商和费用承担主体的信息
export async function getSupplier(params) {
    return request('/popularize/company/supplier', { prefix: '/crmApi', params });
}
