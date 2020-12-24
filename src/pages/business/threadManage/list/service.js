import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/businessTrail/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ data }) {
    return request('/businessTrail/addOrUpdate', { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ data }) {
    return request('/businessTrail/batchDelete', { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/businessTrail/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}

export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
};
