/**
 *@author   zhangwenshuai
 *@date     2019-06-22 17:47
 **/

import request from '@/utils/request';

let globalData = {};

/**
 * 检测缓存是否命中
 * @param key    数据唯一key
 * @param force  是否强制请求跳过缓存
 * @returns {*|arg is Array<any>|boolean}
 */
function checkCache(key, force) {
  return (globalData[key] && Array.isArray(globalData[key]) && globalData[key].length > 0 && !force)
}

/**
 * 缓存数据
 * @param key       数据唯一key
 * @param response  处理数据，并更新缓存
 */
function cacheData(key, response) {
  if (response && response.data && response.success) {
    globalData[key] = Array.isArray(response.data.list) ? response.data.list : [];
  } else {
    globalData[key] = [];
  }
}

//TODO:将数据格式化为接口形式的数据，为了兼容之前的组件
function formatData(list) {
  return {
    success: true,
    data: {
      list
    }
  }
}

//获取内部公司列表
export async function getInnerCompanyList(data, force = false) {
  if (checkCache('innerCompanyList')) {
    return formatData(globalData.innerCompanyList);
  }
  let response = await request('/companies/list', {method: 'post', data});
  cacheData('innerCompanyList', response);
  return formatData(globalData.innerCompanyList);
}

//获取内部用户列表
export async function getInnerUserList(data, force = false) {
  if (checkCache('innerUserList')) {
    return formatData(globalData.innerUserList);
  }
  let response = await request(`/trails/user/list`, {prefix: '/crmApi', method: 'post', data});
  cacheData('innerUserList', response);
  return formatData(globalData.innerUserList);
}

//获取线索列表
export async function getTrailList(data, force = false) {
  if (checkCache('trailList')) {
    return formatData(globalData.trailList);
  }
  let response = await request('/trails/list', {prefix: '/crmApi', method: 'post', data});
  cacheData('trailList', response);
  return formatData(globalData.trailList);
}

//获取艺人博主合并列表
export async function getTalentList(data, force = false) {
  if (checkCache('talentList')) {
    return formatData(globalData.talentList);
  }
  let response = await request(`/trails/talent/list`, {prefix: '/crmApi', method: 'post', data});
  cacheData('talentList', response);
  return formatData(globalData.talentList);
}


//Talent账号查询
export async function getTalentAccountList(data, force = false) {
    if (checkCache('talentAccountList')) {
      return formatData(globalData.talentAccountList);
    }
    let response = await request(`/select/talent/account/list`, {prefix: '/crmApi', method: 'post', data});
    cacheData('talentAccountList', response);
    return formatData(globalData.talentAccountList);
  }
