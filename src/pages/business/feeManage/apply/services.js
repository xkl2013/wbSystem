/*
 * @Author: your name
 * @Date: 2019-12-27 15:40:13
 * @LastEditTime : 2020-02-14 20:12:52
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/business/feeManage/apply/services.js
 */
import request from '@/utils/request';

// 费用申请列表
export async function getApply(data) {
    return request('/applications', { prefix: '/crmApi', method: 'post', data });
}

// 新增费用申请
export async function addApply(data) {
    return request('/applications/submit', { prefix: '/crmApi', method: 'post', data });
}

// 编辑费用申请
export async function editApply(data) {
    return request('/applications', { prefix: '/crmApi', method: 'put', data });
}

// 重新提交费用申请
export async function resubmitApply(data) {
    return request('/applications/resubmit', { prefix: '/crmApi', method: 'post', data });
}

// 获取费用申请详情
export async function getApplyDetail(id, params) {
    return request(`/application/${id}`, { prefix: '/crmApi', method: 'get', params });
}

// 项目列表
export async function getProjectList(data) {
    return request('/projects/list/nonCancel', { prefix: '/crmApi', method: 'post', data });
}

// 项目合同列表
export async function getProjectContractList(id, data) {
    return request(`/projects/${id}/contract/approvalList`, {
        prefix: '/crmApi',
        method: 'post',
        data,
    });
}

// 费用申请详情
export async function getReimburseDetail(data) {
    return request(`/application/${data}`, { prefix: '/crmApi', method: 'get' });
}

// 费用申请撤销
export async function reimburseCancel(data) {
    return request(`/application/${data}/repeal`, { prefix: '/crmApi', method: 'get' });
}

// 费用申请-付款确认
export async function reimburseConfirmPay(data) {
    return request(`/application/${data}/pay`, { prefix: '/crmApi', method: 'get' });
}

// 费用申请-下推
export async function reimbursePushDown(data) {
    return request('/application/pushdown', { prefix: '/crmApi', method: 'post', data });
}

// 查询审批流
export async function getInstance(id) {
    return request(`/instance/${id}`, { prefix: '/approvalApi', method: 'get' });
}

// 撤销审批流
export async function cancelApproval(id, data) {
    return request(`/approval/instance/${id}/cancel`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}
// 费用批量付款确认
export async function applicationPayList(data) {
    return request('/application/pay', { prefix: '/crmApi', method: 'post', data });
}
// 报销修改报销单付款信息
export async function putApplicationPayInfo(data) {
    return request('/application/batch/payinfo', { prefix: '/crmApi', method: 'put', data });
}

// 费用申请 - 下推剩余金额
export async function getPushdownSurplusMoney(id) {
    return request(`/application/pushdown/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 费用申请 - 下推记录
export async function getPushdownRecord(id) {
    return request(`/application/pushdown/record/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 费用申请 - 下推记录
export async function getPushdownRepeal(id) {
    return request(`/application/revoke/reimburse/${id}`, { prefix: '/crmApi', method: 'get' });
}
