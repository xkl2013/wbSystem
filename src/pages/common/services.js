/*
 * @Author: CaiChuanming
 * @Date: 2020-01-02 10:39:53
 * @LastEditTime : 2020-01-06 16:40:11
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/common/services.js
 */
import request from '@/utils/request';

// 获取转交记录
export async function getHandover(businessId) {
    return request(`/handover/summary/${businessId}`, { prefix: '/crmApi', method: 'get' });
}
// 获取各模块转交的数据
export async function postHandoverList(moduleId, businessId, data) {
    return request(`/handover/list/${moduleId}/${businessId}`, { prefix: '/crmApi', method: 'post', data });
}

// 根据审批流实例id获取业务id
export async function getHandoverFromFlowMark(flowMark, instanceId) {
    return request(`/handover/getBusinessId/${flowMark}/${instanceId}`, { prefix: '/crmApi', method: 'get' });
}
