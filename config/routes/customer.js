export const customer = {
    path: '/foreEnd/business/customer',
    component: '../components/renderRouter',
    name: '客户管理',
    routes: [
        {
            path: '/foreEnd/business/customer/followup',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/customer/followup', name: '商务客户' },
                { path: '/foreEnd/business/customer/content', name: '内容客户' },
                { path: '/foreEnd/business/customer/customer', name: '客户' },
            ],
            name: '商务客户',
            routes: [
                {
                    path: '/foreEnd/business/customer/followup',
                    component: './business/customer/followup',
                    name: '商务客户',
                },
            ],
        },
        {
            path: '/foreEnd/business/customer/content',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/customer/followup', name: '商务客户' },
                { path: '/foreEnd/business/customer/content', name: '内容客户' },
                { path: '/foreEnd/business/customer/customer', name: '客户' },
            ],
            name: '内容客户',
            routes: [
                {
                    path: '/foreEnd/business/customer/content',
                    component: './business/customer/content',
                    name: '内容客户',
                },
            ],
        },
        {
            path: '/foreEnd/business/customer/thread',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/customer/followup', name: '商务客户' },
                { path: '/foreEnd/business/customer/content', name: '内容客户' },
                { path: '/foreEnd/business/customer/customer', name: '客户' },
            ],
            name: '线索',
            routes: [
                {
                    path: '/foreEnd/business/customer/thread',
                    component: './business/customer/thread/list',
                    name: '线索',
                },
                {
                    path: '/foreEnd/business/customer/thread/add',
                    component: './business/customer/thread/add',
                    name: '新增线索',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/customer/thread/edit',
                    component: './business/customer/thread/edit',
                    name: '编辑线索',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/customer/thread/detail',
                    component: './business/customer/thread/detail',
                    name: '线索详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
            ],
        },
        {
            path: '/foreEnd/business/customer/customer',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/customer/followup', name: '商务客户' },
                { path: '/foreEnd/business/customer/content', name: '内容客户' },
                { path: '/foreEnd/business/customer/customer', name: '客户' },
            ],
            name: '客户',
            routes: [
                {
                    path: '/foreEnd/business/customer/customer',
                    component: './business/customer/customer/list',
                    name: '客户',
                },
                {
                    path: '/foreEnd/business/customer/customer/add',
                    component: './business/customer/customer/add',
                    name: '新增客户',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/customer/customer/edit',
                    component: './business/customer/customer/edit',
                    name: '编辑客户',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/customer/customer/detail',
                    component: './business/customer/customer/detail',
                    name: '客户详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
            ],
        },
    ],
};
