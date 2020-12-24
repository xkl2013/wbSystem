import request from '@/utils/request';

// 线索列表/trails/list
export async function getTrailsList(data) {
    return request('/trails/list', { prefix: '/crmApi', method: 'post', data });
}

// 新增直客
export async function addCustomer(data) {
    return request('/customer/addCustomer', { prefix: '/crmApi', method: 'post', data });
}

// 新增代理
export async function addAgentCustomer(data) {
    return request('/customer/addAgentCustomer', { prefix: '/crmApi', method: 'post', data });
}

// 编辑直客
export async function updateCustomer(data) {
    return request('/customer/updateCustomer', { prefix: '/crmApi', method: 'post', data });
}

// 编辑代理
export async function updateAgentCustomer(data) {
    return request('/customer/updateAgentCustomer', { prefix: '/crmApi', method: 'post', data });
}

// 客户详情
export async function getCustomerDetail(params) {
    return request('/customer/getCustomer', { prefix: '/crmApi', params });
}

// 主营行业全量查询接口
export async function getIndustryList(params) {
    return request('/customer/listIndustry', { prefix: '/crmApi', params });
}

// 线索联系人创建接口/trails/contacts
export async function TrailsContacts(data) {
    return request('/trails/contacts', { prefix: '/crmApi', method: 'post', data });
}

// 当前客户所有联系人列表查询
export async function getContactsList(id) {
    return request(`/trails/contacts/list/${id}`, { prefix: '/crmApi' });
}

// 当前线索有关联系人列表查询/trails/contacts/about/{trailId}
export async function getContactsAboutList(id) {
    return request(`/trails/contacts/about/${id}`, { prefix: '/crmApi' });
}

// 线索联系人创建接口
export async function addTrailsContacts(data) {
    return request('/trails/contacts', { prefix: '/crmApi', method: 'post', data });
}

// 当前线索有关联系人列表查询
export async function trailsContactsAbout(id) {
    return request(`/trails/contacts/about/${id}`, { prefix: '/crmApi', method: 'get' });
}

// 当前客户所有联系人列表查询
export async function trailsContacts(id) {
    return request(`/trails/contacts/list/${id}`, { prefix: '/crmApi', method: 'get' });
}

// 删除客户联系人接口
export async function deleteTrailsContacts(data) {
    return request('/trails/contacts/delete', { prefix: '/crmApi', method: 'post', data });
}

// 更新客户联系人接口
export async function updateTrailsContacts(data) {
    return request('/trails/contacts/about/update', { prefix: '/crmApi', method: 'post', data });
}

// 撤销线索接口
export async function cancelTrail(id) {
    return request(`/trails/${id}/cancel`, { prefix: '/crmApi', method: 'get' });
}

// 当前客户所有联系人列表查询
export async function companyBrands(id) {
    return request(`/trails/contacts/list/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 获取客户管理列表
export async function getCustomerControlList(data) {
    return request('/customer/list', { prefix: '/crmApi', method: 'post', data });
}

// 获取联系人详情
export async function getContactDetail(params) {
    return request('/customer/contacts/get', { prefix: '/crmApi', method: 'get', params });
}
