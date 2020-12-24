import request from '@/utils/request';

// 查询审批流列表
export async function getFlowsList(params) {
  return request('/flowGroups/', { prefix: '/approvalApi', method: 'get', params });
}
// 移动分组
export async function changeGroupList(id, data) {
  return request(`/flow/${id}/changeGroup`, { prefix: '/approvalApi', method: 'post', data });
}
// 更新审批流排序
export async function flowSort(data) {
  return request(`/flow/${data.id}/${data.groupId}/${data.type}`, { prefix: '/approvalApi', method: 'post', data });
}
// 修改流程状态
export async function changeFlowStatus(data) {
  return request(`/flow/${data.id}/status/${data.status}`, { prefix: '/approvalApi', method: 'post', data });
}
// 高级设置编辑
export async function editFlowSetting(data, flowId) {
  return request(`/flow/configure/${flowId}`, { prefix: '/approvalApi', method: 'post', data });
}
// 高级设置详情获取
export async function getFlowSetting(data) {
  return request(`/flow/${data.flowId}/configure`, { prefix: '/approvalApi' });
}
// 查询审批流-角色关系列表
export async function getApprovalRole(flowId) {
  return request(`/approval/role/${flowId}`, { prefix: '/approvalApi' });
}
// 设置审批流角色关系接口
export async function setApprovalRole(data) {
  return request(`/approval/role/`, { prefix: '/approvalApi', method: 'post', data });
}
// 查询审批流历史记录显示字段表和关联字段接口
export async function getApprovalHistory(flowId) {
  return request(`/approval/history/field/${flowId}`, { prefix: '/approvalApi', method: 'get' });
}
// 设置审批流历史记录显示字段表和关联字
export async function setApprovalHistory(data) {
  return request(`/approval/history/field/`, { prefix: '/approvalApi', method: 'post', data });
}