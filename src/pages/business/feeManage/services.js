import request from '@/utils/request';

// 费用报销
// 新增费用报销
export async function addReimburse(data) {
    return request('/reimburse/submit', { prefix: '/crmApi', method: 'post', data });
}
// 编辑费用报销
export async function editAddReimburse(data) {
    return request('/reimburse', { prefix: '/crmApi', method: 'put', data });
}

// 获取供应商详细信息
export async function getSupplierDetail(supplierId) {
    return request(`/supplier/${supplierId}`, { method: 'get', prefix: '/adminApi' });
}
