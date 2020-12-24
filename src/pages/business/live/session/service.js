import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/business/live/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ data }) {
    return request('/business/live/addOrUpdate', { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ data }) {
    return request('/business/live/delete', { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/business/live/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}
// GMV实时分析列表
export async function getGMVList({ tableId, liveId }) {
    return request(`/business/room/data/list/${liveId}/${tableId}`, { method: 'post', prefix: '/crmApi' });
}
// 链接实时分析列表
export async function getLinkList({ tableId, liveId }) {
    return request(`/business/room/data/list/${liveId}/${tableId}`, { method: 'post', prefix: '/crmApi' });
}

export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
};
