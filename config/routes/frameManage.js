export const frameManage = {
    path: '/foreEnd/business/frameManage',
    component: '../components/renderRouter',
    name: '年框管理',
    routes: [
        {
            path: '/foreEnd/business/frameManage/customer',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/frameManage/customer', name: '年框客户' },
                { path: '/foreEnd/business/frameManage/project', name: '年框项目' },
                { path: '/foreEnd/business/frameManage/rebate', name: '项目返点明细' },
            ],
            name: '年框客户',
            routes: [
                {
                    path: '/foreEnd/business/frameManage/customer',
                    component: './business/frameManage/customer',
                    name: '年框客户',
                },
            ],
        },
        {
            path: '/foreEnd/business/frameManage/project',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/frameManage/customer', name: '年框客户' },
                { path: '/foreEnd/business/frameManage/project', name: '年框项目' },
                { path: '/foreEnd/business/frameManage/rebate', name: '项目返点明细' },
            ],
            name: '年框项目',
            routes: [
                {
                    path: '/foreEnd/business/frameManage/project',
                    component: './business/frameManage/project',
                    name: '年框项目',
                },
            ],
        },
        {
            path: '/foreEnd/business/frameManage/rebate',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/frameManage/customer', name: '年框客户' },
                { path: '/foreEnd/business/frameManage/project', name: '年框项目' },
                { path: '/foreEnd/business/frameManage/rebate', name: '项目返点明细' },
            ],
            name: '项目返点明细',
            routes: [
                {
                    path: '/foreEnd/business/frameManage/rebate',
                    component: './business/frameManage/rebate',
                    name: '项目返点明细',
                },
            ],
        },
    ],
};
