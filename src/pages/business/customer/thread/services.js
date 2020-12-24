import request from '@/utils/request';

// 线索列表/trails/list
export async function getTrailsList(data) {
    return request('/trails/list', { prefix: '/crmApi', method: 'post', data });
}

// 新增线索
export async function addTrails(data) {
    return request('/trails', { prefix: '/crmApi', method: 'post', data });
}

// 编辑线索
export async function editTrails(id, data) {
    return request(`/trails/${id}`, { prefix: '/crmApi', method: 'post', data });
}

// 线索详情/trails/{trailId}
export async function getTrailsDetail(data) {
    return request(`/trails/${data}`, { prefix: '/crmApi' });
}

// 撤销线索接口
export async function cancelTrail(id) {
    return request(`/trails/${id}/cancel`, { prefix: '/crmApi', method: 'get' });
}
// 平台下单列表查询
export async function getCustomerOrderPlatForm(data) {
    return request('/select/customerOrderPlatForm/list', { prefix: '/crmApi', method: 'post', data });
}
// 下单平台客户查询
export async function getCustomePlatForm(platformId) {
    return request(`/trails/customer/${platformId}`, { prefix: '/crmApi', method: 'post' });
}
