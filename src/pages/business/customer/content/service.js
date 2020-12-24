import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/content/follow/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ data }) {
    return request('/content/follow/addOrUpdate', { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ data }) {
    return request('/content/follow/del', { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/content/follow/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}
// 追加数据
export async function appendData({ data }) {
    return request('/content/follow/append', { method: 'post', prefix: '/crmApi', data });
}
// 获取跟进记录列表数据
export async function getHistoryData({ tableId, rowId, sortType = 0, data }) {
    return request(`/content/follow/history/list/${tableId}/${rowId}/${sortType}`, {
        method: 'post',
        prefix: '/crmApi',
        data,
    });
}
export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
    appendData,
    getHistoryData,
};
