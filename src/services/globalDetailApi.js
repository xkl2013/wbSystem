/*
 * @Author: your name
 * @Date: 2020-01-13 15:12:52
 * @LastEditTime : 2020-02-03 10:41:31
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/services/globalDetailApi.js
 */
import request from '@/utils/request';

/*
 *  用户详情
 *  userId 是 客户ID
 */
export async function getUserDetail(id) {
    return request(`/users/back/${id}`);
}

/*
 *  组织详情
 *  departmentId 是 组织ID
 */
export async function getDepartmentDetail(id) {
    return request(`/departments/${id}`);
}

/*
 *  公司详情
 *  companyId 是 公司ID
 */
export async function getCompanyDetail(id) {
    return request(`/companies/${id}`);
}

/*
 *  线索详情
 *  trailId 是 线索ID
 */
export async function getTrailDetail(id) {
    return request(`/trails/${id}`, { prefix: '/crmApi' });
}

/*
 *  项目详情
 *  projectId 是 项目ID
 */
export async function getProjectDetail(id) {
    return request(`/project/${id}`, { prefix: '/crmApi' });
}

/*
 *  项目详情
 *  projectId 是 项目ID
 *  无权限控制
 */
export async function getProjectDetailNoAuth(id) {
    return request(`/project/${id}/noAuth`, { prefix: '/crmApi' });
}

/*
 *  合同详情
 *  contractId 是 合同ID
 */
export async function getContractDetail(id) {
    return request(`/contracts/${id}`, { prefix: '/crmApi' });
}

/*
 *  合同详情
 *  contractId 是 合同ID
 *  无权限控制
 */
export async function getContractDetailNoAuth(id) {
    return request(`/contracts/${id}/noAuth`, { prefix: '/crmApi' });
}

/*
 *  用户简介列表
 */
export async function getUserNameInfo(data) {
    return request('/users/shortList', { method: 'post', prefix: '/adminApi', data });
}

// 获取外勤记录
export async function getOutWork() {
    return request('/approval/outwork/instances', { method: 'get', prefix: '/approvalApi' });
}

// 获取关联报销
export async function getOutOffice(id) {
    return request(`/reimburse/outoffice/${id}`, { method: 'get', prefix: '/crmApi' });
}

// 获取转交详情
export async function connectDetail(id) {
    return request(`/handover/summary/${id}`, { method: 'get', prefix: '/crmApi' });
}

// 获取转交记录
export async function connectInfo(businessId, moduleId) {
    return request(`/handover/${moduleId}/${businessId}`, { prefix: '/crmApi', method: 'get' });
}
// 根据费用报销ID查看报销明细
export async function getReimburseInfoDetail(id) {
    return request(`/reimburse/details/${id}`, { prefix: '/crmApi', method: 'get' });
}
// 根据费用申请ID查看申请明细
export async function getApplicationInfoDetail(id) {
    return request(`/application/details/${id}`, { prefix: '/crmApi', method: 'get' });
}
