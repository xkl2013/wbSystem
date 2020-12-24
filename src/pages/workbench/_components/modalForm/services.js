import request from '@/utils/request';

/*
 *  查询所有普通项目及普通项目下所有看板
 */
export async function getProjectsPanels(params) {
    return request('/projects/panels', { method: 'get', params, prefix: '/crmApi' });
}
// new新建编辑删除
export async function addSchedule(data, param) {
    const { panelId, projectId } = param;
    let newParam = '';
    if (panelId && projectId) {
        newParam = `panelId=${panelId}&projectId=${projectId}`;
    } else if (!panelId && projectId) {
        newParam = `projectId=${projectId}`;
    } else if (panelId && !projectId) {
        newParam = `panelId=${panelId}`;
    }
    return request(`/panel/schedule/add?${newParam}`, { method: 'post', data, prefix: '/crmApi' });
}
// 编辑
export async function editSchedule(data) {
    return request('/panel/schedule/update', { method: 'post', data, prefix: '/crmApi' });
}
// 归档任务
export async function returnSchedule(data) {
    return request('/panel/schedule/file', { method: 'post', data, prefix: '/crmApi' });
}
// 删除日程/任务
export async function deleteSchedule(data) {
    return request(`/panel/schedule/del/${data.scheduleId}`, { method: 'post', prefix: '/crmApi' });
}
// 获取会议室列表（是否占用）
export async function getOccupationMeeting(params) {
    return request('/schedule/occupation/meetings/', { params, prefix: '/crmApi' });
}
// 获取日程详情
export async function getScheduleDetail(scheduleId) {
    return request(`/schedules/${scheduleId}`, { prefix: '/crmApi' });
}
// 查询任务标签列表
export async function getScheduleTags() {
    return request('/schedule/tags', { prefix: '/crmApi' });
}
// 修改任务标签
export async function updateScheduleTags(data) {
    return request('/schedule/tag/update', { method: 'post', data, prefix: '/crmApi' });
}
// 删除任务标签
export async function delScheduleTags(id) {
    return request(`/schedule/tag/del/${id}`, { method: 'post', data: { id }, prefix: '/crmApi' });
}
// 新增任务标签
export async function addScheduleTags(data) {
    return request('/schedule/tag/add', { method: 'post', data, prefix: '/crmApi' });
}
// 修改日程完成状态（批量）
export async function finishflagStatusAll(data) {
    return request('/schedule/finishflag/status', { method: 'post', data, prefix: '/crmApi' });
}
// 修改日程任务完成状态（单个）
export async function finishflagStatus(data) {
    return request(`/schedule/${data.id}/${data.status}`, { method: 'post', data, prefix: '/crmApi' });
}
// 查询任务标签列表
export async function getSubnodeFinish(id) {
    return request(`/schedule/subnode/finish/status/${id}`, { prefix: '/crmApi' });
}
