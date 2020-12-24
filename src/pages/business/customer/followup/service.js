import request from '@/utils/request';
// 获取数据
export async function getDataSource({ tableId, data }) {
    return request(`/follow/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 获取分组数据
export async function getGroupDataSource({ tableId, data }) {
    return request(`/follow/group/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ data }) {
    return request('/follow/addOrUpdate', { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ data }) {
    return request('/follow/del', { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/follow/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}

// 追加数据
export async function appendData({ data }) {
    return request('/follow/append', { method: 'post', prefix: '/crmApi', data });
}
// 获取跟进记录列表数据
export async function getHistoryData({ tableId, rowId, sortType = 0, data }) {
    return request(`/follow/history/list/${tableId}/${rowId}/${sortType}`, { method: 'post', prefix: '/crmApi', data });
}
// 添加联系人
export async function addContact(data) {
    return request('/customer/contacts/add', { method: 'post', prefix: '/crmApi', data });
}
export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
    appendData,
    getHistoryData,
};
