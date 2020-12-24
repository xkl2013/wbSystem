import request from '@/utils/request';

// 查询博主列表
export async function getBloggerList(data) {
    return request('/bloggers/list', { method: 'post', data, prefix: '/crmApi' });
}

// 查询博主列表（新）
export async function getBloggerList2(data) {
    return request('/bloggers/list2', { method: 'post', data, prefix: '/crmApi' });
}

// 新增博主
export async function addBlogger(data) {
    return request('/bloggers', { method: 'post', data, prefix: '/crmApi' });
}

// 编辑博主
export async function editBlogger(id, data) {
    return request(`/bloggers/${id}`, { method: 'post', data, prefix: '/crmApi' });
}

// 博主详情
export async function getBloggerDetail(data) {
    return request(`/bloggers/${data}`, { prefix: '/crmApi' });
}

// 模糊查询博主昵称
export async function getBloggerNicknameList(data) {
    return request('/bloggers/list/nicknames', { method: 'post', data, prefix: '/crmApi' });
}
// 获取艺人合同进度
export async function getContractStatus(id, data) {
    return request(`/bloggers/${id}/contract/list`, { method: 'post', data, prefix: '/crmApi' });
}
// 投放分组字典
export async function getDictionariesList(data) {
    return request('/dictionaries/list', { method: 'post', data });
}
// 博主推荐列表
export async function getBloggersRecommendList(data) {
    return request('/bloggers/recommend/list', { method: 'post', data, prefix: '/crmApi' });
}
// 批量更新博主推荐类型
export async function updateBloggersRecommendList(data) {
    return request('/bloggers/recommend/updateBatch', { method: 'post', data, prefix: '/crmApi' });
}

// 初始化全年博主推荐信息
export async function initialize(data) {
    return request('/bloggers/recommend/initialize', { method: 'post', data, prefix: '/crmApi' });
}
