import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/business/live/product/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ data }) {
    return request('/business/live/product/addOrUpdate', { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ data }) {
    return request('/business/live/product/delete', { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/business/live/product/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}

// 获取跟进列表
export async function getHistoryData({ tableId, rowId, sortType = 0, data }) {
    return request(`/business/live/product/history/list/${tableId}/${rowId}/${sortType}`, {
        method: 'post',
        prefix: '/crmApi',
        data,
    });
}

// 获取跟进详情
export async function appendData({ data }) {
    return request('/business/live/product/append', { method: 'post', prefix: '/crmApi', data });
}

export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
    getHistoryData,
    appendData,
};
