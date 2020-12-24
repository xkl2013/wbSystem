// const config = { 1:艺人 2:博主 3:客户 4:线索 5:立项 6:项目 7:合同 8:审批 9：费用报销 10:费用申请}
// 项目详情
const manageApi = require('@/pages/business/project/manage/services');
// 艺人详情
const actorApi = require('@/pages/business/talent/actor/services');
// 博主详情
const bloggerApi = require('@/pages/business/talent/blogger/services');
// 客户详情
const customerApi = require('@/pages/business/customer/customer/services');
// 线索详情
const threadApi = require('@/pages/business/customer/thread/services');
// 立项详情
const establishApi = require('@/pages/business/project/establish/services');
// 合同详情
const contractApi = require('@/pages/business/project/contract/services');
// 费用报销详情
const reimbursementApi = require('@/pages/business/feeManage/reimbursement/services');
// 费用申请详情
const applyApi = require('@/pages/business/feeManage/apply/services');
// 合同条款审核详情
const approvalContactApi = require('@/pages/approval/services');
// 合同审核流程详情
const clauseNameApi = require('@/pages/approval/services');
// 内容客户详情
const contentApi = require('@/pages/business/customer/content/service');
// 商务客户详情
const customerFollowApi = require('@/pages/business/customer/followup/service');

/**
 * request: 跳转详情页的详情接口
 * pathname: 跳转详情路由
 * authignore: 设为 true 时不校验权限直接跳转 --- 可选
 * name: 详情页名字
 */

export const config = [
    {
        type: 1,
        pathname: '/foreEnd/business/talentManage/talent/actor/detail',
        request: actorApi.getStarDetail,
        name: '艺人详情',
    },
    {
        type: 2,
        pathname: '/foreEnd/business/talentManage/talent/blogger/detail',
        request: bloggerApi.getBloggerDetail,
        name: '博主详情',
    },
    {
        type: 3,
        pathname: '/foreEnd/business/customer/customer/detail',
        request: customerApi.getCustomerDetail,
        contactRequest: customerApi.getContactDetail,
        name: '客户详情',
    },
    {
        type: 4,
        pathname: '/foreEnd/business/customer/thread/detail',
        request: threadApi.getTrailsDetail,
        name: '线索详情',
    },
    {
        type: 5,
        pathname: '/foreEnd/business/project/establish/detail',
        request: establishApi.getProjectDetail,
        name: '立项详情',
    },
    {
        type: 6,
        pathname: '/foreEnd/business/project/manage/detail',
        request: manageApi.getProjectDetail,
        name: '项目详情',
    },
    {
        type: 7,
        pathname: '/foreEnd/business/project/contract/detail',
        request: contractApi.getContractDetail,
        name: '合同详情',
    },
    {
        type: 8,
        pathname: '/foreEnd/executorApproval/executor/detail',
        authignore: true,
        request: '',
        name: '发起人详情',
    },
    {
        type: 9,
        pathname: '/foreEnd/business/feeManage/reimbursement/detail',
        request: reimbursementApi.getReimburseDetail,
        name: '费用报销详情',
    },
    {
        type: 10,
        pathname: '/foreEnd/business/feeManage/apply/detail',
        request: applyApi.getApplyDetail,
        name: '费用申请详情',
    },
    {
        type: 11,
        pathname: '/foreEnd/approval/approval/contract/detail',
        request: approvalContactApi.getCommerceDetail,
        name: '合同条款审核详情',
    },
    {
        type: 12,
        pathname: '/foreEnd/approval/apply/contract/notify',
        request: clauseNameApi.getCommerceDetail,
        name: '合同条款审核详情',
    },
    {
        type: 26,
        pathname: '/foreEnd/business/customer/content',
        request: contentApi.getDetail,
        name: '内容客户详情',
    },
    {
        type: 99,
        pathname: '/foreEnd/business/customer/followup',
        request: customerFollowApi.getDetail,
        name: '商务客户详情',
    },
];

export const checkoutAuth = (path) => {
    return (
        config.find((item) => {
            return path === item.pathname;
        }) || {}
    );
};
