import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/business/product/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ data }) {
    return request('/business/product/addOrUpdate', { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
// export async function delData({ data }) {
//     return request('/content/follow/del', { method: 'post', prefix: '/crmApi', data });
// }

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/business/product/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}

// 添加直播场次
export async function addProductToLive(data) {
    return request('/business/product/toLive', { method: 'post', prefix: '/crmApi', data });
}
// 批量添加直播场次
export async function batchToLive(data) {
    return request('/business/live/product/batchToLive', { method: 'post', prefix: '/crmApi', data });
}
// 移至直播场次
export async function moveProductToLive(data) {
    return request('/business/live/product/move', { method: 'post', prefix: '/crmApi', data });
}
// 移至直播场次
export async function batchAddOrUpdate(data) {
    return request('/business/live/product/batchAddOrUpdate', { method: 'post', prefix: '/crmApi', data });
}
// 商务直播商品详情-无需TableId
export async function getLiveTable(rowId) {
    return request(`/business/live/product/get/table/${rowId}`, { method: 'get', prefix: '/crmApi' });
}
// 商务直播商品校验必填
export async function checkRequired(data) {
    return request('/business/product/required/check', { method: 'post', prefix: '/crmApi', data });
}

export default {
    getDataSource,
    addOrUpdateDataSource,
    // delData,
    getDetail,
};
