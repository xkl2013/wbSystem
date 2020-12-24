import request from '@/utils/request';

// 获取日程列表
export async function getSchedule(data) {
    return request('/schedules', { method: 'post', data, prefix: '/crmApi' });
}
// 获取日程列表（带分页）
export async function getPageSchedule(data) {
    return request('/schedules/pageInfo', { method: 'post', data, prefix: '/crmApi' });
}

// 获取我的列表
export async function getMyPageInfo(data) {
    return request('/panel/schedules/pageInfo', { method: 'post', data, prefix: '/crmApi' });
}
// new新建编辑删除
export async function addSchedule(data, param) {
    const { panelId, projectId } = param;
    let _param = '';
    if (panelId && projectId) {
        _param = `panelId=${panelId}&projectId=${projectId}`;
    } else if (!panelId && projectId) {
        _param = `projectId=${projectId}`;
    } else if (panelId && !projectId) {
        _param = `panelId=${panelId}`;
    }
    return request(`/panel/schedule/add?${_param}`, { method: 'post', data, prefix: '/crmApi' });
}
// // 新建
// export async function addSchedule(data) {
//     return request('/schedule/add', {method: 'post', data, prefix: '/crmApi',},);
// }

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
// 获取日程详情
export async function getScheduleDetail(scheduleId) {
    return request(`/schedules/${scheduleId}`, { prefix: '/crmApi' });
}

// 获取关注成员列表
export async function getMemberList(params) {
    return request('/schedules/members', { prefix: '/crmApi', params });
}

// 批量修改成员
export async function changeMemberList(data) {
    return request('/schedule/group/upsert', { method: 'post', data, prefix: '/crmApi' });
}

// 删除关注成员
export async function deleteMember(data) {
    return request(`/schedule/group/${data.id}`, { method: 'post', prefix: '/crmApi' });
}
// 会议室列表
export async function getListTree(params) {
    return request('/meetings/list', { params });
}

// 会议室列表(tree)
export async function getMeetingTreeList() {
    return request('/meetings/listTree', { prefix: '/adminApi' });
}

// 获取会议室资源日历列表
export async function getResources(data) {
    return request('/resources', { method: 'post', data, prefix: '/crmApi' });
}

// 删除 全部 关注成员
export async function deleteMemberAll(data) {
    return request('/schedule/group/del', { method: 'post', data, prefix: '/crmApi' });
}

// 获取会议室列表（是否占用）
export async function getOccupationMeeting(params) {
    return request('/schedule/occupation/meetings/', { params, prefix: '/crmApi' });
}
