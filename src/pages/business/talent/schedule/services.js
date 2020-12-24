import request from '@/utils/request';

// 获取档期列表
export async function getSchedule(data) {
    return request('/talent/calendar/list', {method: 'post', data, prefix: '/crmApi',},);
}

// 获取艺人档期相关信息列表
export async function getStartsList(data) {
    return request('/stars/calendar/list', {method: 'post', data, prefix: '/crmApi',},);
}

// 获取博主档期相关信息列表
export async function getBloggersList(data) {
    return request('/bloggers/calendar/list', {method: 'post', data, prefix: '/crmApi',},);
}

// 获取Talent档期预警标识
export async function getListFreeFlag(data) {
    return request('/talent/calendar/listFreeFlag', {method: 'post', data, prefix: '/crmApi',},);
}

// 新建档期
export async function addSchedule(data) {
    return request('/talent/calendar/add', {method: 'post', data, prefix: '/crmApi',},);
}

// 获取档期详情
export async function getScheduleDetail(id) {
    return request(`/talent/calendar/get/${id}`, {prefix: '/crmApi',},);
}

// 修改档期
export async function updateSchedule(data) {
    return request('/talent/calendar/update', {method: 'post', data, prefix: '/crmApi',},);
}

// 删除档期
export async function delSchedule(data) {
    return request('/talent/calendar/del', {method: 'post', data, prefix: '/crmApi',},);
}


// 获取项目类型下拉列表查询
export async function getProjectType() {
    return request('/select/projectType/list', {method: 'post', prefix: '/crmApi',},);
}


// 获取行政区域列表
export async function getRegions(data) {
    return request('/regions/list', {method: 'post',data},);
}

// 获取艺人详情
export async function getStarsDetail(id) {
    return request(`/stars/${id}`, {prefix: '/crmApi',},);
}

// 更新艺人详情
export async function updateStarsDetail(data) {
    return request('/stars/calendar/edit', {method: 'post',data,prefix: '/crmApi',},);
}

// 获取博主详情
export async function getBloggersDetail(id) {
    return request(`/bloggers/${id}`, {prefix: '/crmApi',},);
}

// 更新博主详情
export async function updateBloggersDetail(data) {
    return request('/bloggers/calendar/edit', {method: 'post',data,prefix: '/crmApi',},);
}

// 关注/取消关注
export async function followTalent(data) {
    return request('/talent/calendar/follow', {method: 'post',data,prefix: '/crmApi',},);
}


