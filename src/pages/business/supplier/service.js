import request from '@/utils/request';

// 获取供应商详细信息
export async function getSupplierDetail(supplierId) {
    return request(`/supplier/${supplierId}`, { method: 'get', prefix: '/adminApi' });
}
// 添加供应商信息
export async function addSupplier(data) {
    return request('/supplier', { method: 'post', prefix: '/adminApi', data });
}
// 更新供应商信息
export async function updateSupplier(data) {
    return request('/supplier', { method: 'put', prefix: '/adminApi', data });
}
// 更新供应商信息
export async function getSupplierList(params) {
    return request('/supplier', { method: 'get', prefix: '/adminApi', params });
}
// 更新供应商信息
export async function getSupplierNameList(data) {
    return request('/select/supplier/list', { method: 'post', prefix: '/crmApi', data });
}
// 字典
export async function dictionariesList(data) {
    return request('/dictionaries/list', { method: 'post', data });
}
