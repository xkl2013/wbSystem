import request from '@/utils/request';

/*
 *  查询所有普通项目及普通项目下所有看板（关联用户权限)
 */
export async function getProjectsPanels(params) {
    return request('/projects/panels', { method: 'get', params, prefix: '/crmApi' });
}
// 查询某普通项目下所有看板及其关联任务（动态列）
export async function getProjectsPanelsSchedules(params, cancelToken = null) {
    return request('/project/panels/schedules/pagination', { method: 'get', params, prefix: '/crmApi', cancelToken });
}
// 加载更多看板数据(分页加载)
export async function getMorePagesProjectsPanelsSchedules(params) {
    return request(`/schedules/${params.projectId}/${params.panelId}/paging`, {
        method: 'get',
        params,
        prefix: '/crmApi',
    });
}
