import request from '@/utils/request';

// 年框客户列表
export function getDataSource({ tableId, data }) {
    return request(`/year/frame/project/list/${tableId}`, {
        prefix: '/crmApi',
        method: 'get',
        params: data,
    });
}
// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/year/frame/project/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}
export default {
    getDataSource,
    getDetail,
};
