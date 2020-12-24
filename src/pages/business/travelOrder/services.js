import request from '@/utils/request';

// 差旅管理列表
export async function getTravelOrderList(data) {
  return request('/travelOrder/list', { prefix: '/crmApi', method: 'post', data });
}

// 差旅管理列表详情
export async function getTravelOrderDetail(data) {
  return request(`/travelOrder/detail/${Number(data.orderId)}`, { prefix: '/crmApi', method: 'get' });
}

// 差旅管理修改税率
export async function postTravelOrderModifyRate(data) {
  return request('/travelOrder/changeTaxRatio', { prefix: '/crmApi', method: 'post', data });
}

// 差旅管理付款确认
export async function postTravelOrderPaymentConfirm(data) {
  return request('/travelOrder/payConfirm', { prefix: '/crmApi', method: 'post', data });
}

// 审核
export async function postTravelOrderAudit(data) {
  return request('/travelOrder/audit', { prefix: '/crmApi', method: 'post', ...data });
}

export async function getCompanies(id) {
  return request(`/companies/${id}`, { prefix: '/adminApi', method: 'get' });
}

// 获取公司列表
export async function getCompaniesList(data) {
  return request(`/companies/list`, { prefix: '/adminApi', method: 'post', data });
}

