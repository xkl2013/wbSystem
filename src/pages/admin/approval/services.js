import request from '@/utils/request';

// 获取审批分组
export const getApproGroup = () => {
    return request('/flowGroups/', {
        method: 'get',
        prefix: '/approvalApi',
    })
}

//获取审批流详情
export const getApprovalFlowInfo = (flowId) => {
    return request(`/flow/${flowId}`, {
        method: 'get',
        prefix: '/approvalApi',
    })
}

// 配置审批流,查看详情
export const getflowCud = (data) => {
    return request(`/getflow/cud/`, {
        method: 'post',
        data,
        prefix: '/approvalApi',
    })
}
// 更新审批流
export const updateFlowCud = (data) => {
    return request(`/updateflow/cud/`, {
        method: 'post',
        data,
        prefix: '/approvalApi',
    })
}
