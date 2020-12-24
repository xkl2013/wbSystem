export const settle = {
    path: '/foreEnd/business/settleManage',
    component: '../components/renderRouter',
    name: '结算管理',
    routes: [
        // 项目合同
        {
            path: '/foreEnd/business/settleManage/progress',
            component: './business/settleManage/progress/list',
            tagGroup: [
                { path: '/foreEnd/business/settleManage/progress', },
            ],
            name: '结算进度',
        },
    ],
};
export const receivable = {
    path: '/foreEnd/business/receivable',
    component: '../components/renderRouter',
    name: '应收管理',
    routes: [
        // 项目合同
        {
            path: '/foreEnd/business/receivable',
            component: './business/settleManage/progress/list',
            tagGroup: [
                { path: '/foreEnd/business/receivable', },
            ],
            name: '结算进度',
        },
    ],
};
