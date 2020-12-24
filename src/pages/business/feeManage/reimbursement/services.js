import request from '@/utils/request';

// 费用报销列表
export async function getReimburses(data) {
    return request('/reimburses', { prefix: '/crmApi', method: 'post', data });
}

// 新增费用申请
export async function addReimburse(data) {
    return request('/reimburse/submit', { prefix: '/crmApi', method: 'post', data });
}

// 编辑费用申请
export async function editReimburse(data) {
    return request('/reimburse', { prefix: '/crmApi', method: 'put', data });
}
// 重新提交
export async function resubmitReimburse(data) {
    return request('/reimburse/resubmit', { prefix: '/crmApi', method: 'post', data });
}

// 费用报销详情
export async function getReimburseDetail(data) {
    return request(`/reimburse/${data}`, { prefix: '/crmApi', method: 'get' });
}

// 费用报销撤销
export async function reimburseCancel(data) {
    return request(`/reimburse/${data}/repeal`, { prefix: '/crmApi', method: 'get' });
}

// 费用报销-付款确认
export async function reimburseConfirmPay(data) {
    return request(`/reimburse/${data}/pay`, { prefix: '/crmApi', method: 'get' });
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

// 费用报销导出
export async function exportReimburses(data) {
    return request('/reimburse/export', {
        prefix: '/crmApi',
        method: 'post',
        stream: 'bolb',
        data,
    });
}
// 报销批量付款确认
export async function reimbursePayList(data) {
    return request('/reimburse/pay', { prefix: '/crmApi', method: 'post', data });
}
// 报销修改报销单付款信息
export async function putReimbursePayInfo(data) {
    return request('/reimburse/batch/payinfo', { prefix: '/crmApi', method: 'put', data });
}
