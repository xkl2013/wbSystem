import request from '@/utils/request';

// 获取表头配置
export async function getColumnConfig({ tableId, data }) {
    return request(`/airTable/userConfig/${tableId}`, { method: 'get', prefix: '/crmApi', data });
}

// 设置表头显隐配置
export async function setHideConfig({ tableId, data }) {
    return request(`/airTable/hideConfig/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 获取操作栏配置
export async function getOperateConfig({ tableId }) {
    return request(`/airTable/table/config/${tableId}`, { method: 'post', prefix: '/crmApi' });
}

// 修改操作栏配置
export async function setOperateConfig({ tableId, data }) {
    return request(`/airTable/table/config/save/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

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
/* ***************************************新版airtable************************************************ */
// 获取用户可见配置
export async function getUserConfig(tableId) {
    return request(`/airTable/userConfig/${tableId}`, { method: 'get', prefix: '/crmApi' });
}
// 保存用户拖拽排序配置
export async function setUserDragConfig({ tableId, data }) {
    return request(`/airTable/table/drag/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

export default {
    getColumnConfig,
    setHideConfig,
    getOperateConfig,
    setOperateConfig,
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
    setUserDragConfig,
};
