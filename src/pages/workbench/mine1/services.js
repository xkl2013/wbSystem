import request from '@/utils/request';

/*
 *  查询所有普通项目及普通项目下所有看板（关联用户权限)
 */
export async function getProjectsPanels(params) {
    return request('/projects/panels', { method: 'get', params, prefix: '/crmApi' });
}
/*
 *  执行时间查看看板
 */
export async function getExecuteTimePanel(params) {
    return request('/project/executetimepanel/schedules', { method: 'get', params, prefix: '/crmApi' });
}
/*
 *  优先级看板查询
 */
export async function getPriorityPanel(params) {
    return request('/project/prioritypanel/schedules', { method: 'get', params, prefix: '/crmApi' });
}
/*
 *  我的看板查询
 */
export async function getMyPanel(params) {
    return request('/mypanel/schedules', { method: 'get', params, prefix: '/crmApi' });
}

/*
 *  查询归档任务
 */
export async function getScheduleFile(params) {
    return request('/panel/schedule/file', { method: 'get', params, prefix: '/crmApi' });
}

/*
 *  归档- 彻底删除
 */
export async function delScheduleFile(id) {
    return request(`/panel/schedule/del/${id}`, { method: 'post', prefix: '/crmApi' });
}

/*
 *  归档- 恢复
 */
export async function recoveryScheduleFile(data) {
    return request('/panel/schedule/file', { method: 'post', data, prefix: '/crmApi' });
}
