import request from '@/utils/request';

// 获取结算单列表
export async function getStatementLists(data) {
    return request('/settlementReceipt/list', { prefix: '/crmApi', method: 'post', data });
}
// 获取结算单详情
export async function getStatementDetail(id) {
    return request(`/settlementReceipt/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 成本差异调整
export async function differentChange(data) {
    return request('/settlementReceipt/cost/adjust', { prefix: '/crmApi', method: 'post', data });
}
// 结算调整
export async function statementChange(data) {
    return request('/settlementReceipt/adjust', { prefix: '/crmApi', method: 'post', data });
}
// 发送台账
export async function creatAccount(id) {
    return request(`/settlementReceipt/${id}/ledger`, { prefix: '/crmApi', method: 'get' });
}
// 发起付款
export async function creatPay(id) {
    return request(`/settlementReceipt/${id}/start`, { prefix: '/crmApi', method: 'get' });
}
// 发起付款
export async function checkPay(id) {
    return request(`/settlementReceipt/${id}/startcheck`, { prefix: '/crmApi', method: 'get' });
}

// 付款规则明细编辑更新
export async function updatePayrule(data) {
    return request('/settlementReceipt/payrule', { prefix: '/crmApi', method: 'put', data });
}
// 获取结算进度列表
export async function getProgressList(data) {
    return request('/settlementReceipt/progress/list', { prefix: '/crmApi', method: 'post', data });
}
