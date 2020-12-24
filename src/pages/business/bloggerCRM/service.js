import request from '@/utils/request';

// 获取表格数据
export async function getDataSource({ tableId, data }) {
    return request(`/talentexpand/list/${tableId}`, { method: 'post', prefix: '/crmApi', data });
}

// 修改数据
export async function addOrUpdateDataSource({ data }) {
    return request('/talentexpand', { method: 'put', prefix: '/crmApi', data });
}

// 导入Excel
export async function importExcel({ data }) {
    return request('/talentexpand/excel/import', {
        method: 'post',
        prefix: '/crmApi',
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
// 导入数据
export async function importDataSource(data) {
    return request('/talentexpand/import', { method: 'post', prefix: '/crmApi', data });
}

// 删除数据
export async function delData({ data }) {
    return request('/talentexpand/delete', { method: 'post', prefix: '/crmApi', data });
}

// 转移数据
export async function moveData({ data }) {
    return request('/talentexpand/move', { method: 'post', prefix: '/crmApi', data });
}

// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/talentexpand/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}

// 获取跟进列表
export async function getHistoryData({ tableId, rowId, sortType = 0, data }) {
    return request(`/talentexpand/history/list/${tableId}/${rowId}/${sortType}`, {
        method: 'post',
        prefix: '/crmApi',
        data,
    });
}

// 发起审批/重新发起
export async function startApproval({ data }) {
    return request('/talentexpand/approval', { method: 'post', prefix: '/crmApi', data });
}

// 回退编辑
export async function rebackApproval({ data }) {
    return request('/talentexpand/reback', { method: 'post', prefix: '/crmApi', data });
}

// 获取审批详情
export async function getApprovalDetail(id) {
    return request(`/talentexpand/approval_row/${id}`, { method: 'get', prefix: '/crmApi' });
}

// 获取审批详情
export async function getApprovalDetailById(id) {
    return request(`/talentexpand/approval/${id}`, { method: 'get', prefix: '/crmApi' });
}

// 查询审批流
export async function getInstance(id) {
    return request(`/instance/${id}`, { prefix: '/approvalApi', method: 'get' });
}

// 撤销审批流
export async function cancelApproval(id, data) {
    return request(`/approval/instance/${id}/cancel`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}

export default {
    getDataSource,
    addOrUpdateDataSource,
    delData,
    getDetail,
    getHistoryData,
};
