import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/talent/recruitment/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ data }) {
    return request('/talent/recruitment/add-or-update', { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ data }) {
    return request('/talent/recruitment/delete', { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/talent/recruitment/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}

export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
};
