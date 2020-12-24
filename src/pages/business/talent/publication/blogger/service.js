import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/quotation/kol/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ tableId, data }) {
    return request(`/quotation/kol/addOrUpdate/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ tableId, data }) {
    return request(`/quotation/kol/del/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/quotation/kol/get/${tableId}/${rowId}`, { method: 'post', prefix: '/crmApi' });
}

// 锁定
export async function lock({ tableId, data }) {
    return request(`/quotation/kol/lock/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}
// 解锁
export async function unlock({ tableId, data }) {
    return request(`/quotation/kol/unlock/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 导出
export async function exportData({ tableId, data }) {
    return request(`/quotation/kol/export/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}
// 获取锁定配置
export async function getLockConfig({ tableId, data }) {
    return request(`/quotation/kol/getLockConfig/${tableId}`, { method: 'get', prefix: '/crmApi', data });
}
// 更新锁定配置
export async function updateLockConfig({ tableId, data }) {
    return request(`/quotation/kol/updateLockConfig/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}
// 获取修改信息和审批流
export async function getChangedDataAndFlow({ tableId, data }) {
    return request(`/quotation/kol/getChangedDataAndFlow/${tableId}`, { method: 'get', prefix: '/crmApi', data });
}
// 提交审批
export async function submitApprovalFlow({ tableId, data }) {
    return request(`/quotation/kol/submitApprovalFlow/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}
// 获取审批详情(在途的审批列表)
export async function getApprovalList({ tableId, data }) {
    return request(`/quotation/kol/getApprovalList/${tableId}`, { method: 'get', prefix: '/crmApi', data });
}

export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
};
