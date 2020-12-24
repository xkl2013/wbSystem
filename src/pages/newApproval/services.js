import request from '@/utils/request';

// 审批列表
export async function getApprovalInstance(id) {
    return request(`/approval/instance/${id}`, { prefix: '/approvalApi', method: 'get' });
}

// 审批实例节点查询
export async function getInstanceNodes(id) {
    return request(`/instance/${id}`, { prefix: '/approvalApi', method: 'get' });
}
