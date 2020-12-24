import request from '@/utils/request';

/*
 *  查询所有普通项目及普通项目下所有看板
 */
export async function getProjectsPanels(params) {
    return request('/projects/panels', { method: 'get', params, prefix: '/crmApi' });
}
/*
 *  查询所有普通项目及普通项目下所有看板（关联用户权限),全局路由中使用,在menu的model中被引用
 */
export async function getDashboardPanels(params) {
    return request('/dashboard/projects', { method: 'get', params, prefix: '/crmApi' });
}

export async function moveCard(data) {
    return request('/panel/schedule/move', { method: 'post', data, prefix: '/crmApi' });
}
// 获取某项目下所有参与人及其角色

export async function getUsersAuthorities(params) {
    return request('/project/users/Authorities', { method: 'get', params, prefix: '/crmApi' });
}
// 获取某项目下所有参与人及其角色

export async function getButtonsAuthorities(params) {
    return request('/project/user/Authorities', { method: 'get', params, prefix: '/crmApi' });
}
// 设置项目参与人CUD（管理员，普通成员，访客）

export async function updateButtonsAuthorities(data) {
    return request('/project/Authority/update', { method: 'post', data, prefix: '/crmApi' });
}
// 看板，归档已完成任务（我的看板和项目看板归档已完成任务）

export async function finishedScheduleFile(data) {
    return request('/panel/finished/schedule/file', { method: 'post', data, prefix: '/crmApi' });
}
// 获取筛选条件接口

export async function getScheduleSearchForm(params) {
    return request('/schedule/search/form', { method: 'get', params, prefix: '/crmApi' });
}
// 更新删选任务参数
export async function updateScheduleSearchForm(data) {
    return request('/schedule/search/form/update', { method: 'post', data, prefix: '/crmApi' });
}
// 某个项目下修改看板
export async function updateSchedulePanel(data) {
    return request('/project/panel/update', { method: 'post', data, prefix: '/crmApi' });
}
