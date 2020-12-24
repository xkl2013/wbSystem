import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/business/product/link/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 获取表格数据
export async function getChildDataSource({ data }) {
    return request(`/business/live/product/${data.parentProductId}`, { method: 'get', prefix: '/crmApi' });
}

// 修改数据
export async function addOrUpdateDataSource({ data }) {
    return request('/business/product/link/addOrUpdate', { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ data }) {
    return request('/business/product/link/delete', { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/business/product/link/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}

export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
};
