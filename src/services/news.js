import request from '@/utils/request';
// 获取审批助手消息(待废弃)
export async function getApprovalMessage(data) {
    return request('/messages/list', { data, method: 'post', prefix: '/adminApi' });
}
// 获取审批助手消息
export async function getMessageList(data) {
    return request('/messages/v2/list', { data, method: 'post', prefix: '/nodeApi' });
}
// 获取搜索消息数量
export async function getSearchMessageCount(params) {
    return request('/messages/moblie/list', { params, method: 'get', prefix: '/nodeApi' });
}

// 获取未读消息数量
export async function getMessageCount() {
    return request('/messages/count/new', { method: 'get', prefix: '/adminApi' });
}
// 消息类型列表
export async function getMessageCountType(data) {
    return request('/messages/count/type', { method: 'post', data, prefix: '/adminApi' });
}
// 获取消息详情
export async function getMessageDetail(id) {
    return request(`/messages/${id}`, { method: 'get', prefix: '/nodeApi' });
}
// 更新消息状态

export async function updateMessage(data) {
    return request('/messages/set', { method: 'post', prefix: '/adminApi', data });
}
// 更新全部消息状态

export async function updateAllMessage(data) {
    return request('/messages/readAll', { method: 'post', prefix: '/adminApi', data });
}
// 获取审批数量
export async function getApprovalMyTask() {
    return request('/approval/myTask', { prefix: '/approvalApi', method: 'get' });
}
// tag  评论tag相关
// 获取tag列表
export async function getCommonTag(data) {
    return request('/tags', { prefix: '/crmApi', method: 'post', data });
}
// 新增tag
export async function addCommonTag(data) {
    return request('/tag', { prefix: '/crmApi', method: 'post', data });
}
// 更新tag
// 更新tag
export async function updateCommonTag(data) {
    return request('/tag', { prefix: '/crmApi', method: 'put', data });
}
// 删除tag
export async function deleteCommonTag(id) {
    return request(`/tag/${id}`, { prefix: '/crmApi', method: 'delete' });
}

// 获取待确认的合同费用列表
export async function getVerifyTodo() {
    return request('/project/fee/verify/todo', { prefix: '/crmApi', method: 'get' });
}
