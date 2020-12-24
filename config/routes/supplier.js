export const supplier = {
    path: '/foreEnd/business/supplier',
    component: '../components/renderRouter',
    name: '供应商管理',
    routes: [
        // 供应商
        {
            path: '/foreEnd/business/supplier',
            component: '../components/renderRouter',
            name: '供应商',
            routes: [
                {
                    path: '/foreEnd/business/supplier',
                    component: './business/supplier/list',
                    name: '供应商',
                },
                {
                    path: '/foreEnd/business/supplier/add',
                    component: './business/supplier/add',
                    name: '新增',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/supplier/edit',
                    component: './business/supplier/edit',
                    name: '编辑',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/supplier/detail',
                    component: './business/supplier/detail',
                    name: '供应商详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
            ],
        },
    ],
};
