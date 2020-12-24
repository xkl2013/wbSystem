import request from '@/utils/request';

// 查询艺人列表
export async function getStarList(data) {
    return request('/stars/list', { method: 'post', data, prefix: '/crmApi' });
}

// 新增艺人
export async function addStar(data) {
    return request('/stars', { method: 'post', data, prefix: '/crmApi' });
}

// 编辑艺人
export async function editStar(id, data) {
    return request(`/stars/${id}`, { method: 'post', data, prefix: '/crmApi' });
}

// 艺人详情
export async function getStarDetail(data) {
    return request(`/stars/${data}`, { prefix: '/crmApi' });
}

// 模糊查询艺人名称
export async function getStarNameList(data) {
    return request('/stars/list/names', { method: 'post', data, prefix: '/crmApi' });
}

// 获取艺人合同进度
export async function getContractStatus(id, data) {
    return request(`/stars/${id}/contract/list`, { method: 'post', data, prefix: '/crmApi' });
}
