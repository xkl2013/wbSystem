import request from '@/utils/request';

// 刊例审批
export async function getKanLiApprovalFormData(instanceId) {
    return request(`/quotation/kol/getApprovalFormData/${instanceId}`, { prefix: '/crmApi', method: 'get' });
}
export default {
    getKanLiApprovalFormData,
};
