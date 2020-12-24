import request from '@/utils/request';

// 合同列表
export async function getContractList(data) {
    return request('/contracts/list', { prefix: '/crmApi', method: 'post', data });
}

// 新增合同
export async function addContract(data) {
    return request('/contracts/add', { prefix: '/crmApi', method: 'post', data });
}

// 重新提交合同
export async function reCommit(data) {
    return request('/contracts/reCommit', { prefix: '/crmApi', method: 'post', data });
}

// 重新编辑合同
export async function reCommitByEdit(data) {
    return request('/contracts/update', { prefix: '/crmApi', method: 'post', data });
}

// 合同详情
export async function getContractDetail(id) {
    return request(`/contracts/${id}`, { prefix: '/crmApi' });
}

// 新增合同计算权重
export async function calcWeight(data) {
    return request('/contracts/calc/weight', { prefix: '/crmApi', method: 'post', data });
}
// 新增合同计算权重
export async function getProjectList(data) {
    return request('/contracts/project/list', { prefix: '/crmApi', method: 'post', data });
}

// 项目费用确认详情
export async function getFeeVerifyDetail(id) {
    return request(`/project/fee/verify/${id}`, { prefix: '/crmApi' });
}

// 项目费用确认详情催办
export async function getFeeVerifyReminder(id) {
    return request(`/project/fee/verify/reminder/${id}`, { prefix: '/crmApi' });
}

// 项目费用确认完结操作
export async function postFeeVerifyEnd(data) {
    return request('/project/fee/verify/end', { prefix: '/crmApi', method: 'post', data });
}

// 验证费用确认操作
export async function getCheckVerify(id) {
    return request(`/project/fee/verify/check/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 发起项目费用确认操作
export async function getStartVerify(id) {
    return request(`/project/fee/verify/start/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 获取项目授权公司子合同信息
export async function getAuthorizedContractDetail(data) {
    return request('/contracts/authorized', { prefix: '/crmApi', method: 'post', data });
}

// 创建合同时获取项目详情
export async function getProjectDetail(projectId) {
    return request(`/project/get/${projectId}`, { prefix: '/crmApi', method: 'get' });
}
