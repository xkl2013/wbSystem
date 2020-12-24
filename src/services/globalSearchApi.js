import request from '@/utils/request';
// eslint-disable-next-line import/no-cycle
import { getOriginTableId } from '@/components/airTable';
/*
 *  模糊搜索品牌
 *  customerId 否 客户编码
 *  businessName  是 品牌名称
 */
export async function getCustomerBusiness(params) {
    return request('/customer/business', {
        method: 'get',
        params,
        prefix: '/crmApi',
    });
}

/*
 *模糊搜索用户
 *userChsName 否 用户名
 *userId 否      用户id
 */
export async function getUserList(data) {
    return request('/select/user/list', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

/*
 *模糊搜索用户
 *userChsName 否 用户名
 *userId 否      用户id
 */
export async function getUserListV2(data) {
    return request('/select/user/list/v2', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

/*
 *模糊搜索项目
 *projectName 否 项目名称
 */
export async function getProjectList(data) {
    return request('/select/project/list', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

/*
 *模糊搜索项目
 *projectName 否 项目名称 过滤费用
 */
export async function getFlowsListOutFee(data) {
    return request('/flows/base', {
        method: 'get',
        params: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/approvalApi',
    });
}

/*
 *模糊搜索项目
 *projectName 否 项目名称 未过滤费用
 */
export async function getFlowsList(data) {
    return request('/flows/excludeContractCommerce/base', {
        method: 'get',
        params: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/approvalApi',
    });
}

/*
 *模糊搜索客户
 *customerName 否 客户名称
 *customerTypeId 否 客户类型 0 直客 1代理商 不传查所有
 */
export async function getCustomerList(data) {
    return request('/select/customer/list', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

/*
 *模糊搜索公司
 *companyName 否 公司名称
 */
export async function getCompanyList(data) {
    return request('/select/company/list', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

/*
 *模糊搜索工作室
 *studioName 否 工作室名称
 */
export async function getStudioList(data) {
    return request('/select/studio/list', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

/*
 *模糊搜索合同名称
 *contractName
 */
export async function getContractList(data) {
    return request('/select/contract/list', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

/*
 *模糊搜艺人博主
 *talentName
 */
export async function getTalentList(data) {
    return request('/select/talent/list', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

/*
 *模糊搜供应商
 *supplierName
 */
export async function getSupplierList(data) {
    return request('/select/supplier/list', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

// 通用审批  模糊搜索
export async function approvalBusinessData(params) {
    if (params.paramsJson) {
        // 刊例编辑映射tableId
        try {
            params.paramsJson = JSON.parse(params.paramsJson);
            if (params.paramsJson.tableId) {
                params.paramsJson.tableId = getOriginTableId(params.paramsJson.tableId);
            }
            params.paramsJson = JSON.stringify(params.paramsJson);
        } catch (e) {
            console.log('json解析失败');
        }
    }
    return request('/approval/business', {
        method: 'get',
        params: { pageNum: 1, pageSize: 50, ...params },
        prefix: '/approvalApi',
    });
}

/*
* 通用审批  数据值接口
* fieldValueName string   数据名称
* fieldValueValue string  数据值
* name string             模糊搜索值
* paramsJson any

*/
export async function approvalValue(params) {
    return request('/approval/value', {
        method: 'get',
        params,
        prefix: '/approvalApi',
    });
}

/*
 *获取角色列表(无角色成员)
 */
export async function getRoleList(data) {
    return request('/roles/list2', {
        method: 'post',
        data,
    });
}

// Talent账号查询
export async function getTalentAccountList(data) {
    return request('/select/talent/account/list', {
        prefix: '/crmApi',
        method: 'post',
        data,
    });
}

/*
 *模糊查询天眼查公司数据列表
 *companyName
 */
export async function getPublicCompanyList(data) {
    return request('/select/customer/public/list', {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}

/*
 *获取已定稿合同审核列表
 *commerce
 */
export async function getCommerceListSearch(id) {
    return request(`/commerce/list/${id}`, { method: 'get', prefix: '/crmApi' });
}

// 分组列表
export async function getDictionariesList(data) {
    return request('/dictionaries/list', { method: 'post', data });
}
// 数据转交
export async function connectChange(data) {
    return request('/handover/data', { prefix: '/crmApi', method: 'post', data });
}
/*
 *模糊查询内容客户数据列表
 */
export async function getContentFollowList(tableId, data) {
    return request(`/select/content/follow/list/${tableId}`, {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}
/*
 *模糊查询商务客户数据列表
 */
export async function getCustomerFollowList(tableId, data) {
    return request(`/select/customer/follow/simple/list/${tableId}`, {
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
        prefix: '/crmApi',
    });
}
// 产品列表
export async function getProductList(data) {
    return request('/select/business/product/list', {
        prefix: '/crmApi',
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
    });
}

// 直播场次产品列表
export async function getLiveProductList(data) {
    return request('/select/business/live/product/list', {
        prefix: '/crmApi',
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
    });
}

// 直播列表
export async function getLiveList(data) {
    return request('/select/business/live/list', {
        prefix: '/crmApi',
        method: 'post',
        data: { pageNum: 1, pageSize: 50, ...data },
    });
}
// 获取api前缀
const getPrefix = (type) => {
    switch (type) {
        case 'crm':
            return '/crmApi';
        default:
            return '/crmApi';
    }
};

// 模糊搜素通用接口
export async function getSearchList({ prefix, url, data }) {
    const realPrefix = getPrefix(prefix);
    return request(url, {
        prefix: realPrefix,
        method: 'post',
        data: { pageNumber: 1, pageSize: 50, ...data },
    });
}
