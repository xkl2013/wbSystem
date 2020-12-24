import request from '@/utils/request';

// 查询分组列表
export async function getFlowsList(params) {
  return request('/flowGroups/', { prefix: '/approvalApi', method: 'get',params});
}
// 删除分组
export async function delGroup(data) {
  return request(`/groups/delete/${data}`, {prefix: '/approvalApi',method: 'post'});
}
// 更新审批分组排序
export async function flowGroupSort(data) {
  return request(`/group/${data.id}/${data.type}`, { prefix: '/approvalApi', method: 'post',data});
}
// 新增分组
export async function addGroup(data) {
  return request(`/group/`, { prefix: '/approvalApi', method: 'post',data});
}
// 编辑分组
export async function editGroup(data) {
  return request(`/group/${data.id}`, { prefix: '/approvalApi', method: 'post',data});
}
// 获取分组详情
export async function getFlowsDetail(groupId) {
  return request(`/flowGroup/${groupId}`, { prefix: '/approvalApi'});
}