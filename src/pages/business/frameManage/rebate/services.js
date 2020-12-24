import request from '@/utils/request';

// 年框客户列表
export function getDataSource({ tableId, data }) {
    return request(`/year/frame/point/flow/list/${tableId}`, {
        prefix: '/crmApi',
        method: 'post',
        data,
    });
}
// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/year/frame/point/flow/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}
// 新增年框客户
export function addOrUpdateDataSource({ data }) {
    return request('/year/frame/point/flow/update', {
        prefix: '/crmApi',
        method: 'post',
        data,
    });
}
export default {
    addOrUpdateDataSource,
    getDataSource,
    getDetail,
};
