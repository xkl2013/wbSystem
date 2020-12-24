/**
 * pathname: 跳转详情路由
 * authignore: 设为 true 时不校验权限直接跳转 --- 可选
 * name: 详情页名字
 */
/**
 * 发起人详情及审批历史记录
 *  flowKeys: {
 *      PROJECTING("立项审批","projecting"),
        REIMBURSE("费用报销","reimburse"),
        CONTRACT("合同审批","contract"),
        APPLICATION("费用申请","application"),
        COMMONCONTRACTCOMMERCE("合同条款审核非商单类","common_ContractCommerce"),
        CONTRACTCOMMERCE("合同条款审核商单类","ContractCommerce"),
        TRAVEL("出差申请","travel"),
        OUTWORK("外勤","outwork"),
        PROPAGATE("宣传费用申请","propagate"),
 * }
 *
 */

export const config = [
    {
        type: 1,
        flowKey: 'projecting',
        pathname: '/foreEnd/business/project/establish/detail',
        name: '立项详情',
    },
    {
        type: 2,
        flowKey: 'contract',
        pathname: '/foreEnd/business/project/contract/detail',
        name: '合同详情',
    },
    {
        type: 3,
        flowKey: 'reimburse',
        pathname: '/foreEnd/business/feeManage/reimbursement/detail',
        name: '费用报销详情',
    },
    {
        type: 4,
        flowKey: 'application',
        pathname: '/foreEnd/business/feeManage/apply/detail',
        name: '费用申请详情',
    },
    {
        type: 5,
        flowKey: 'ContractCommerce',
        pathname: '/foreEnd/approval/approval/business/detail',
        name: '合同条款审核详情（商单类）',
    },
    {
        type: 6,
        flowKey: 'common_ContractCommerce',
        pathname: '/foreEnd/approval/approval/contract/detail',
        name: '合同条款审核详情（非商单类）',
    },
    {
        type: 7,
        flowKey: 'flow_key_talent_expand',
        pathname: '/foreEnd/business/bloggerCRM/approval',
        name: '博主拓展CRM审批详情',
    },
];

export const checkoutAuth = (key) => {
    return (
        config.find((item) => {
            return key === item.flowKey;
        }) || {}
    );
};
