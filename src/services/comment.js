import request from '@/utils/request';

// 添加评论
export async function commentAdd(data) {
    return request(`/comments`, { method: 'post', prefix: '/crmApi', data });
}
// 全部评论列表
export async function commentList(data) {
    return request(`/comments/list`, { method: 'post', prefix: '/crmApi', data });
}
// 我的评论列表
export async function myCommentList(data) {
    return request(`/comments/my`, { method: 'post', prefix: '/crmApi', data });
}
// 我的所有模块评论
export async function myAllModuleCommentList(params) {
    return request(`/comments/myall`, { method: 'get', prefix: '/crmApi', params });
}
//立项
export async function proAdd(data) {
    return request('/projecting/comment/add', { method: 'post', prefix: '/crmApi', data });
}
export async function proList(data) {
    return request('/projecting/comment/list', { method: 'post', prefix: '/crmApi', data });
}
//项目
export async function projectAdd(data) {
    return request('/project/comment/add', { method: 'post', prefix: '/crmApi', data });
}
export async function projectList(data) {
    return request('/project/comment/list', { method: 'post', prefix: '/crmApi', data });
}
//线索
export async function theadAdd(data) {
    return request('/trails/comment/add', { method: 'post', prefix: '/crmApi', data });
}
export async function theadList(data) {
    return request('/trails/comment/list', { method: 'post', prefix: '/crmApi', data });
}
//talent-actor
export async function actorAdd(data) {
    return request('/stars/comment', { method: 'post', prefix: '/crmApi', data });
}
export async function actorList(data) {
    return request('/stars/comment/list', { method: 'post', prefix: '/crmApi', data });
}
//talent-blog
export async function blogAdd(data) {
    return request('/bloggers/comment', { method: 'post', prefix: '/crmApi', data });
}
export async function blogList(data) {
    return request('/bloggers/comment/list', { method: 'post', prefix: '/crmApi', data });
}
// 合同
export async function contractsAdd(data) {
    return request(`/contracts/${data.id}/comment/add`, {
        method: 'post',
        prefix: '/crmApi',
        data,
    });
}
export async function contractsList(data) {
    return request(`/contracts/${data.id}/comment/list`, {
        method: 'post',
        prefix: '/crmApi',
        data,
    });
}
// 合同执行-执行进度变更
export async function changeContractAppointment(id, data) {
    return request(`/contract/contractAppointment/${id}`, {
        prefix: '/crmApi',
        method: 'post',
        data,
    });
}
// 一般审批
export async function approvalAdd(data) {
    return request(`/approval/comment/`, { method: 'post', prefix: '/approvalApi', data });
}
export async function approvalList(params) {
    return request(`/approval/comments/${params.instanceId}`, { prefix: '/approvalApi', params });
}
// 自定义筛选
// 保存
export async function setSift(data) {
    return request(`/labels`, { method: 'post', prefix: '/adminApi', data });
}
// 获取
export async function getSift(data) {
    return request(`/labels/list`, { method: 'post', prefix: '/adminApi', data });
}
// 获取
export async function deleteTag(id) {
    return request(`/tag/${id}`, { method: 'delete', prefix: '/adminApi' });
}
// 根据流程ID查看审核详情
export async function getCommerceId(id) {
    return request(`/commerce/approval/${id}`, { method: 'get', prefix: '/crmApi' });
}

/*
*  审批催办
*/
export async function hastenWorkApi(instanceId, nodeId) {
    return request(`/instance/hastenWork/${instanceId}/${nodeId}`, {prefix: '/approvalApi'})
}
// 查询审批流
export async function getInstance(id) {
    return request(`/instance/${id}`, { prefix: '/approvalApi', method: 'get' });
}