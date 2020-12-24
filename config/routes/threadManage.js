export const threadManage = {
    path: '/foreEnd/business/threadManage',
    component: '../components/renderRouter',
    name: '商务线索管理',
    routes: [
        {
            path: '/foreEnd/business/threadManage/list',
            component: './business/threadManage/list',
            tagGroup: [
                {
                    path: '/foreEnd/business/threadManage/list',
                    name: '商务线索管理',
                },
            ],
            name: '商务线索管理',
        },
    ],
};
