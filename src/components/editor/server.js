
import request from '@/utils/request';

// 查询审批流
export async function getInstance(id) {
  return request(`/instance/${id}`, {prefix: '/approvalApi', method: 'get'})
}

// @用户和部门列表
export async function selUser(data) {
  return request(`/select/userDept/list`, {prefix: '/crmApi', method: 'post', data});
}
