import request from '@/utils/request';

// 字典树
export async function dictionaryTree(id, data) {
    return request(`/dictionaries/listTree/${id}`, { method: 'post', prefix: '/adminApi', data });
}

// 字典列表
export async function dictionaryList(data) {
    return request('/dictionaries/list', { method: 'post', prefix: '/adminApi', data });
}

// 获取合作产品字典树
export async function getCooperationProduct(data) {
    return dictionaryTree(346, data);
}

// 获取合作行业字典树
export async function getCooperationIndustry(data) {
    return dictionaryTree(291, data);
}

// 获取合作品牌字典树
export async function getCooperationBrand(data) {
    return dictionaryTree(490, data);
}

// 获取项目类型字典树
export async function getProjectType(data) {
    return dictionaryTree(1644, data);
}

// 获取费用类型字典列表
export async function getFeeType(data) {
    return dictionaryList({ parentId: 3, ...data });
}

// 获取直播产品阶段类型字典列表
export async function getLiveGroupType(data) {
    return dictionaryList({ parentId: 2289, ...data });
}

// 字典列表
export async function addBrand2Diction(data) {
    return request('/dictionaries/add/brand', { method: 'post', prefix: '/adminApi', data });
}
