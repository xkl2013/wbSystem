import request from '@/utils/request';

// ——————————————————————————————————台账筛选列表数据 START—————————————————————————————————————
//获取项目合同收入台帐列表
export async function postEarningData(data) {
    return request('/ledger/input/list', { prefix: '/crmApi', method: 'post', data });
}
//获取项目合同成本台帐列表
export async function postCostingData(data) {
    return request('/ledger/cost/list', { prefix: '/crmApi', method: 'post', data });
}
//获取费用类台帐列表
export async function postExpensesData(data) {
    return request('/ledger/fee/list', { prefix: '/crmApi', method: 'post', data });
}
//获取费用类台帐列表
export async function postTravelData(data) {
    return request('/ledger/travel/list', { prefix: '/crmApi', method: 'post', data });
}
// ——————————————————————————————————台账筛选列表数据 END—————————————————————————————————————
// 收入确认导出
export async function exportEarning(data) {
    return request(`/ledger/input/export`, {
        prefix: '/crmApi',
        method: 'post',
        stream: 'bolb',
        data,
    });
}

// ——————————————————————————————————联想搜索————————————————————————————————————————

// 项目名称
export async function getProjectList(data) {
    return request('/select/project/list', { prefix: '/crmApi', method: 'post', data });
}
// 艺人博主
export async function getTalentList(data) {
    return request(`/trails/talent/list`, { prefix: '/crmApi', method: 'post', data });
}
// 检查台账NC资格
export async function checkNCIds(type, data) {
    return request(`/ledger/${type}/checkIds`, { prefix: '/crmApi', method: 'post', data });
}
// 同步台账NC
export async function syncNCIds(type, data) {
    return request(`/ledger/${type}/syncToNc`, { prefix: '/crmApi', method: 'post', data });
}
// NC任务队列
export async function getSyncTaskList(type, data) {
    return request(`/ledger/${type}/syncTaskList`, { prefix: '/crmApi', method: 'post', data });
}

// ————————————————————————————————详情————————————————————————————————
// 合同成本台账详情
export async function getCostingDetail(id) {
    return request(`/ledger/cost/detail/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 合同成本台账详情编辑
export async function putCostingDetail(data) {
    return request(`/ledger/cost`, { prefix: '/crmApi', method: 'put', data });
}
