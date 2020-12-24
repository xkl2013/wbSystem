import request from '@/utils/request';

// 查询我关注的看板视图（日程任务混合）
export async function getMemberPanel(data) {
    return request('/focus/member/schedules', { method: 'post', data, prefix: '/crmApi' });
}
export async function getMemberPanel1(data) {
    return request('/focus/member/schedules', { method: 'post', data, prefix: '/crmApi' });
}
// 查询我关注的看板列表，分页
export async function getMemberPanelPaging(data) {
    return request('/focus/member/panel/paging', { method: 'post', data, prefix: '/crmApi' });
}
// 查询我关注的某一个看板中任务，分页
export async function getMemberSchedulePaging(data) {
    return request('/focus/member/schedule/paging', { method: 'post', data, prefix: '/crmApi' });
}
// 获取关注成员列表
export async function getMemberList(params) {
    return request('/schedules/members', { prefix: '/crmApi', params });
}
