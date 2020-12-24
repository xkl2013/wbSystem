// const config = { 1:艺人 2:博主 3:客户 4:线索 5:立项 6:项目 7:合同 8:审批 9：费用报销 10:费用申请}
export const config = [
    {
        type: 1,
        pathname: '/foreEnd/business/talentManage/talent/actor/detail',
        name: '艺人',
    },
    {
        type: 2,
        pathname: '/foreEnd/business/talentManage/talent/blogger/detail',
        name: '博主',
    },
    {
        type: 3,
        pathname: '/foreEnd/business/customer/customer/detail',
        name: '客户',
    },
    {
        type: 4,
        pathname: '/foreEnd/business/customer/thread/detail',
        name: '线索',
    },
    {
        type: 5,
        pathname: '/foreEnd/business/project/establish/detail',
        name: '立项',
    },
    {
        type: 6,
        pathname: '/foreEnd/business/project/manage/detail',
        name: '项目',
    },
    {
        type: 7,
        pathname: '/foreEnd/business/project/contract/detail',
        name: '合同',
    },
    {
        type: 8,
        pathname: '/foreEnd/approval/apply/myjob/detail',
        name: '审批',
    },
    {
        type: 9,
        pathname: '/foreEnd/business/feeManage/reimbursement/detail',
        name: '费用报销',
    },
    {
        type: 10,
        pathname: '/foreEnd/business/feeManage/apply/detail',
        name: '费用申请',
    },
    {
        type: 11,
        pathname: '/foreEnd/approval/approval/contract/detail',
        name: '合同条款审核详情',
    },
    {
        type: 12,
        pathname: '',
        name: '客户跟进',
        pageType: 'modal'
    },
    {
        type: 13,
        pathname: '/foreEnd/calendar/mine',
        name: '我的日历',
        pageType: 'modal'
    },
    {
        type: 19,
        pathname: '/foreEnd/business/project/contract/verify/detail',
        name: '项目费用确认单详情',
    },
];
export const checkoutModel = () => {
    const pathname = window.location.pathname;
    return config.find(item => pathname === item.pathname) || {};
};
