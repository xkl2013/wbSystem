import request from '@/utils/request';

// 获取数据权限树
export async function getDataTree() {
    return request('/data/tree');
}
// 获取数据权限详情
export async function getDataTreeDetail(id) {
    return request(`/data/${id}`, { method: 'get' });
}
// 更新数据权限详情
export async function pushDataTree(data) {
    return request('/data/edit', { method: 'post', data });
}
// 保存定制盘信息
export async function saveCustomization(data) {
    return request('/data/customization', { method: 'post', data });
}

// 获取定制盘信息详情
export async function getCustomizationDetail(id) {
    return request(`/data/customization/${id}`);
}

// 更新定制盘信息
export async function updateCustomization(id, data) {
    return request(`/data/customization/${id}`, { method: 'post', data });
}

// 获取定制盘信息列表
export async function getCustomizationList(data) {
    return request('/data/customization/list', { method: 'post', data });
}

// 删除定制盘信息详情
export async function delCustomization(id) {
    return request(`/data/customization/${id}`, {method: 'delete'});
  }
