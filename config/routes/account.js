export const account = {
    path: '/foreEnd/business/account',
    component: '../components/renderRouter',
    name: '台账管理',
    routes: [
        {
            path: '/foreEnd/business/account/earning',
            tagGroup: [
                {
                    path: '/foreEnd/business/account/earning',
                    name: '项目合同收入确认台账',
                },
                {
                    path: '/foreEnd/business/account/costing',
                    name: '项目合同成本确认台账',
                },
                { path: '/foreEnd/business/account/expenses', name: '费用类台账' },
            ],
            name: '项目合同收入确认台账',
            routes: [
                {
                    path: '/foreEnd/business/account/earning',
                    component: './business/account/earning',
                    name: '项目合同收入确认台账',
                },
            ],
        },
        {
            path: '/foreEnd/business/account/costing',
            tagGroup: [
                {
                    path: '/foreEnd/business/account/earning',
                    name: '项目合同收入确认台账',
                },
                {
                    path: '/foreEnd/business/account/costing',
                    name: '项目合同成本确认台账',
                },
                { path: '/foreEnd/business/account/expenses', name: '费用类台账' },
            ],
            name: '项目合同成本确认台账',
            routes: [
                {
                    path: '/foreEnd/business/account/costing',
                    component: './business/account/costing',
                    name: '项目合同成本确认台账',
                },
                {
                    path: '/foreEnd/business/account/costing/edit',
                    component: './business/account/costing/edit',
                    name: '成本确认台账编辑',
                },
            ],
        },
        {
            path: '/foreEnd/business/account/expenses',
            tagGroup: [
                {
                    path: '/foreEnd/business/account/earning',
                    name: '项目合同收入确认台账',
                },
                {
                    path: '/foreEnd/business/account/costing',
                    name: '项目合同成本确认台账',
                },
                { path: '/foreEnd/business/account/expenses', name: '费用类台账' },
            ],
            name: '费用类台账',
            routes: [
                {
                    path: '/foreEnd/business/account/expenses',
                    component: './business/account/expenses',
                    name: '费用类台账',
                },
            ],
        },
    ],
};
