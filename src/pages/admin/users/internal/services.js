import request from '@/utils/request';

// 内部用户列表
export async function getUsersList(data) {
  return request('/users/list', {method: 'post', data:{pageNum:1,pageSize:20,...data}});
}

// 新增内部用户
export async function addUser(data) {
  return request('/users', {method: 'post', data});
}

// 编辑内部用户
export async function editUser(id, data) {
  return request(`/users/${id}`, {method: 'post', data});
}

// 用户详情
export async function getUserDetail(id) {
  return request(`/users/back/${id}`);
}

//内部用户转正
export async function becomeOffice(id,data) {
  return request(`/users/${id}/become`, {method: 'post', data});
}

//内部用户转岗
export async function transferOffice(data) {
  return request('/users/{id}/transfer', {method: 'post', data})
}

// 内部用户离职
export async function leaveOffice(id,data) {
  return request(`/users/${id}/leave`, {method: 'post', data})
}

//内部用户归档
export async function addOfficeFile(data) {
  return request('/users/{id}/file', {method: 'post', data})
}
//禁止
export async function userDisable(id) {
  return request(`/users/${id}/disable`, {method: 'post'})
}
//启用
export async function userEnabled(id) {
  return request(`/users/${id}/enabled`, {method: 'post'})
}
//重置密码
export async function resetPassword(id) {
  return request(`/users/${id}/reset`, {method: 'post'})
}
//模糊搜索花名和用户
export async function selectUsername(data){
  return request(`/users/select/username`, {method: 'post',data})
}
//模糊搜索花名和用户
export async function checkNickName(data){
  return request(`/users/checkNickName`, {method: 'post',data})
}
//差旅标准列表
export async function travelList(data){
  return request(`/dictionaries/list`, {method: 'post',data})
}