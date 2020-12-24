import request from '@/utils/request';

// GMV实时分析列表
export async function getGMVList({ tableId, liveId, data }) {
    return request(`/business/room/data/list/${liveId}/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}
// 链接实时分析列表
export async function getLinkList({ tableId, liveId, data }) {
    return request(`/business/room/product/list/${liveId}/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}
// 获取直播间状态
export async function getLiveStatus(liveId) {
    return request(`/business/live/${liveId}/room`, { method: 'get', prefix: '/crmApi' });
}
// 批量保存直播talent
export async function saveLiveTalent(data) {
    return request('/business/live/talent/save', { method: 'post', prefix: '/crmApi', data });
}
// 获取直播talent
export async function getLiveTalentList() {
    return request('/business/live/talent/list', { method: 'get', prefix: '/crmApi' });
}
// 移至校验必填
export async function checkRequired(data) {
    return request('/business/live/product/required/check', { method: 'post', prefix: '/crmApi', data });
}
// 导入
export async function importExcel(data) {
    return request('/business/product/doImport', { method: 'post', prefix: '/crmApi', data });
}
// 文件解析
export async function productParse(data) {
    return request('/business/product/parse', { method: 'post', prefix: '/crmApi', data });
}
// 模版下载
export async function getTemplate(data) {
    return request('/business/product/getTemplate', { method: 'post', prefix: '/crmApi', data });
}
// 根据场次id获取直播间id
export async function getRoomId(id) {
    return request(`/business/live/${id}/room`, { method: 'get', prefix: '/crmApi' });
}
