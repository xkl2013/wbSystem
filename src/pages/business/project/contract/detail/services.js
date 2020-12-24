import request from '@/utils/request';

// 收款管理 - 查询回款
export async function getContractReturns(params) {
    return request('/contract/contractReturns', { prefix: '/crmApi', method: 'get', params });
}

// 收款管理 - 删除回款
export async function delContractReturn(id) {
    return request(`/contract/contractReturn/${id}/delete`, { prefix: '/crmApi', method: 'post' });
}

// 收款管理 - 新增回款
export async function addContractReturn(data) {
    return request('/contract/contractReturn', { prefix: '/crmApi', method: 'post', data });
}

// 收款管理 - 编辑回款
export async function editContractReturn(id, data) {
    return request(`/contract/contractReturn/${id}`, { prefix: '/crmApi', method: 'post', data });
}

// 收款管理 - 查询发票
export async function getContractInvoices(params) {
    return request('/contract/contractInvoices', { prefix: '/crmApi', method: 'get', params });
}

// 收款管理 - 删除发票
export async function delContractInvoices(id) {
    return request(`/contract/contractInvoice/${id}/delete`, { prefix: '/crmApi', method: 'post' });
}

// 收款管理 - 新增发票
export async function addContractInvoice(data) {
    return request('/contract/contractInvoice', { prefix: '/crmApi', method: 'post', data });
}

// 收款管理 - 编辑发票
export async function editContractInvoice(id, data) {
    return request(`/contract/contractInvoice/${id}`, { prefix: '/crmApi', method: 'post', data });
}

// 获取公司信息
export async function getCompanies(id) {
    return request(`/companies/${id}`, { prefix: '/adminApi', method: 'get' });
}

// 获取公司列表
export async function getCompaniesList(data) {
    return request('/companies/list', { prefix: '/adminApi', method: 'post', data });
}

// 获取合同详情
export async function getContracts(id) {
    return request(`/contracts/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 签约信息-变更艺人
export async function changeTalent(data, id) {
    return request(`/contracts/${id}/changeTalent`, { prefix: '/crmApi', method: 'post', data });
}
// 合同执行-执行进度明细
export async function contractAppointment(params) {
    return request('/contract/contractAppointment', { prefix: '/crmApi', method: 'get', params });
}
// 合同执行-执行总进度
export async function appointmentTotal(contractId) {
    return request(`/contract/appointmentTotal/${contractId}`, {
        prefix: '/crmApi',
        method: 'get',
    });
}
// 合同执行-执行进度变更
export async function changeContractAppointment(id, data) {
    return request(`/contract/contractAppointment/${id}`, {
        prefix: '/crmApi',
        method: 'post',
        data,
    });
}
// 合同执行-附件查询
export async function contractAttach(contractAppointmentId) {
    return request(`/contract/contractAttach/${contractAppointmentId}`, {
        prefix: '/crmApi',
        method: 'get',
    });
}
// 合同费用-费用预估
export async function contractBudget(id) {
    return request(`/contracts/${id.id}/budget`, { prefix: '/crmApi', method: 'get' });
}
// 合同费用-实际费用明细
export async function contractExpense(contractCode) {
    return request(`/contracts/${contractCode.id}/expense`, { prefix: '/crmApi', method: 'get' });
}

// 合同费用-查询合同实际花费列表新接口
export async function newContractExpense(data) {
    return request('/contract/actualFee/list', { prefix: '/crmApi', method: 'post', data });
}

// 合同费用-删除合同实际花费
export async function deleteActualFeeItem(id) {
    return request(`/contract/actualFee/${id}`, { prefix: '/crmApi', method: 'delete' });
}

// 合同费用-保存合同实际花费
export async function saveActualFee(data) {
    return request('/contract/actualFee', { prefix: '/crmApi', method: 'post', data });
}

// 合同费用-编辑合同实际花费
export async function editActualFeeItem(id, data) {
    return request(`/contract/actualFee/${id}`, { prefix: '/crmApi', method: 'post', data });
}

// 合同费用-实际费用汇总
export async function contractSummary(contractCode) {
    return request(`/contracts/${contractCode.id}/expense/summary`, {
        prefix: '/crmApi',
        method: 'get',
    });
}

// 合同费用-实际费用汇总新接口
export async function contractSummary2(id) {
    return request(`/contracts/v2/${id}/expense/summary`, {
        prefix: '/crmApi',
        method: 'get',
    });
}

// 合同结算-合同结算列表
export async function contractSettles(params) {
    return request('/contract/contractSettles', { prefix: '/crmApi', method: 'get', params });
}
// 合同结算-编辑合同结算
export async function contractSettleEdit(data) {
    return request(`/contract/contractSettle/${data.id}`, {
        prefix: '/crmApi',
        method: 'post',
        data,
    });
}
// 合同结算-艺人结算明细
export async function contractFeedetail(params) {
    return request('/contract/feedetail/', { prefix: '/crmApi', method: 'get', params });
}

// 合同结算-艺人结算明细新接口
export async function newContractFeedetail(id) {
    return request(`/v2/contract/feedetail/${id}`, { prefix: '/crmApi' });
}

// 查询审批流
export async function getInstance(id) {
    return request(`/instance/${id}`, { prefix: '/approvalApi', method: 'get' });
}

// 合同撤销
export async function contractCancel(id, params) {
    return request(`/contracts/${id}/cancel`, { prefix: '/crmApi', method: 'get', params });
}

// 撤销审批流
export async function cancelApproval(id, data) {
    return request(`/approval/instance/${id}/cancel`, {
        prefix: '/approvalApi',
        method: 'post',
        data,
    });
}

// 合同归档
export async function archive(data) {
    return request('/contracts/archive', { prefix: '/crmApi', method: 'post', data });
}
// 结案
export async function endContract(contractId) {
    return request(`/contracts/end/${contractId}`, { prefix: '/crmApi', method: 'post' });
}
