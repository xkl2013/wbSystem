import request from '@/utils/request';

// 审批列表
export async function getApprovalsList(params) {
    return request('/approvals/', { prefix: '/approvalApi', method: 'get', params });
}
// 审批流分组
export async function getFlowGroups(params) {
    return request('/flowGroups/', { prefix: '/approvalApi', method: 'get', params });
}
// 审批流状态
export async function getFlowTypes(params) {
    return request('/approval/status', { prefix: '/approvalApi', method: 'get', params });
}

// 审批通过
export async function agreeProject(id, data) {
    return request(`/approval/instance/${id}/agree`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}

// 审批驳回
export function rejectProject(id, data) {
    return request(`/approval/instance/${id}/reject`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}
// 撤销审批流
export async function cancelApproval(id, data) {
    return request(`/approval/instance/${id}/cancel`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}
// 重新提交审批流
export async function restartApproval(id, data) {
    return request(`/approval/instance/${id}`, { prefix: '/approvalApi', method: 'post', data });
}

// 立项详情
export async function getProjectDetail(id) {
    return request(`/projecting/${id}`, { prefix: '/crmApi' });
}

// 查询审批流
export async function getInstance(data) {
    return request(`/projecting/instance/${data}`, { prefix: '/crmApi', method: 'get' });
}

// 审批详情
export async function getApprlvalDetail(data) {
    return request(`/approval/instance/${data.id}`, { prefix: '/approvalApi', method: 'get' });
}
// 获取审批详情兼容删除流
export async function getFlowCompatible(flowId) {
    return request(`/flow/compatible/${flowId}`, { prefix: '/approvalApi', method: 'get' });
}
// 审批流详情
export async function getApprlvalFlow(flowId) {
    return request(`/flow/${flowId}`, { prefix: '/approvalApi', method: 'get' });
}
// 通过flowKey获取审批流详情
export async function getApprovalFlowByFlowKey(flowKey) {
    return request(`/getFlow/${flowKey}`, { prefix: '/approvalApi', method: 'get' });
}
// 添加审批流
export async function addApprovalInstance(data) {
    return request('/approval/instance', { prefix: '/approvalApi', method: 'post', data });
}
// 回显审批流详情
export async function getApprovalInstanceDetail(id) {
    return request(`/approval/instance/${id}`, { prefix: '/approvalApi', method: 'get' });
}
// 审批实例节点查询
export async function getInstanceNodes(id) {
    return request(`/instance/${id}`, { prefix: '/approvalApi', method: 'get' });
}
// 查询分支流程
export async function getFlowsSubflow(flowId, data) {
    return request(`/flows/condition/subflow/${flowId}`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}

// 合同商务条款审批 START-----------------------------------------------------------
// 获取审核列表 - 审核
export async function getApprovalCommerceLists(data) {
    return request('/commerce/list/approval', { prefix: '/crmApi', method: 'post', data });
}
// 获取审核列表 - 发起
export async function getApplyCommerceLists(data) {
    return request('/commerce/list/start', { prefix: '/crmApi', method: 'post', data });
}
// 获取审核详情
export async function getCommerceDetail(id) {
    return request(`/commerce/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 审核操作
export async function changeCommerce(data) {
    return request('/commerce/approval', { prefix: '/crmApi', method: 'post', data });
}
// 发起申请
export async function pushCommerce(data) {
    return request('/commerce/submit', { prefix: '/crmApi', method: 'post', data });
}
// 同意定稿
export async function CommerceAgree(id, data) {
    return request(`/approval/instance/${id}/agree`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}
// 反馈意见
export async function CommerceReject(id, data) {
    return request(`/approval/instance/${id}/reject`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}
// 确认定稿
export async function CommerceAgreeEnd(id) {
    return request(`/commerce/agree/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 合同商务条款审批 END-----------------------------------------------------------

// 获取审批历史列表
export async function getApprovalHistoryList(params) {
    return request(`/approval/instances/history/${params.flowId}`, {
        prefix: '/approvalApi',
        method: 'get',
        params: params.params,
    });
}

// 查询审批流按钮接口
export async function getApprovalButton(flowId) {
    return request(`/approval/button/${flowId}`, { prefix: '/approvalApi', method: 'get' });
}
// 查询审批流历史记录显示字段表
export async function getApprovalHistory(flowId) {
    return request(`/approval/history/field/${flowId}`, { prefix: '/approvalApi', method: 'get' });
}

// 发起人详情
export async function getExecutorData(data) {
    const { flowKeys, pageNum, pageSize, applicantUserId } = data;
    return request(
        `/approval/sample/myApply?flowKeys=${flowKeys}
    &applicantUserId=${applicantUserId}&pageNum=${pageNum}&pageSize=${pageSize}`,
        { prefix: '/approvalApi' },
    );
}
/*
费用审批模块
* */

// 费用报销
export async function getApprovalReimburseList(data) {
    return request('/reimburse/approval', { prefix: '/crmApi', method: 'post', data });
}
// 费用申请
export async function getApprovalApplicationList(data) {
    return request('/application/approval', { prefix: '/crmApi', method: 'post', data });
}
