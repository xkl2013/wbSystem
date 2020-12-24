import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/contract/receipt/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ tableId, data }) {
    return request(`/contract/receipt/addOrUpdate/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ tableId, data }) {
    return request(`/contract/receipt/del/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/contract/receipt/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}

// 下发、提交、审核、退回
export async function process({ data }) {
    return request('/contract/receipt/process', { method: 'post', prefix: '/crmApi', data });
}

// 拆分行数据
export async function split({ tableId, data }) {
    return request(`/contract/receipt/split/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 导入数据
export async function importData(data) {
    return request('/contract/receipt/import', { method: 'post', prefix: '/crmApi', data });
}

// 批量删除数据
export async function batchDelData(data) {
    return request('/contract/receipt/del/batch', { method: 'post', prefix: '/crmApi', data });
}

export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
};
