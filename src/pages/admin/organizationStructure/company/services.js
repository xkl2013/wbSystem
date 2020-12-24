import request from '@/utils/request';

// 查询公司列表
export async function getCompanyList(data) {
  return request('/companies/list', {method: 'post', data});
}

// 新增公司
export async function addCompany(data) {
  return request('/companies', {method: 'post', data});
}

// 编辑公司
export async function editCompany(id, data) {
  return request(`/companies/${id}`, {method: 'post', data});
}

// 公司详情
export async function getCompanyDetail(data) {
  return request(`/companies/${data}`);
}

// 删除公司
export async function delCompany(data) {
  return request(`/companies/${data}`, {method: 'delete'});
}
