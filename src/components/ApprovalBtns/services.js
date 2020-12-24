import request from '@/utils/request';

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

// 审批实例节点查询
export async function getInstanceNodes(id) {
    return request(`/instance/${id}`, { prefix: '/approvalApi', method: 'get' });
}

// 审批转交
export function handOverProject(id, data) {
    return request(`/approval/instance/${id}/deliver`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}

// 审批回退
export function rebackProject(id, data) {
    return request(`/approval/instance/${id}/reback`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}

// 回退 节点查询
export async function getProvors(params) {
    return request('/approval/getNodes', { prefix: '/approvalApi', method: 'get', params });
}

// 撤销审批流
export async function cancelApproval(id, data) {
    return request(`/approval/instance/${id}/cancel`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}

export async function getExecutors(params) {
    // 基于审批流查询审批人
    return request('/approval/executors', { prefix: '/approvalApi', method: 'get', params });
}
