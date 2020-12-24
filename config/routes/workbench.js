export const workbench = [
    {
        path: '/foreEnd/workbench',
        component: '../components/renderRouter',
        type: 'icongongzuotai1',
        activeType: 'icongongzuotai',
        name: '工作台',
        newLayout: true,
        authignore: true,
        routes: [
            {
                path: '/foreEnd/workbench',
                redirect: '/foreEnd/workbench/mine',
            },
            {
                path: '/foreEnd/workbench/mine',
                component: './workbench/mine',
                name: '我的',
                authignore: true,
            },
            {
                path: '/foreEnd/workbench/member',
                component: './workbench/member',
                name: '关注',
            },
            {
                path: '/foreEnd/workbench/resources/meeting',
                component: './workbench/resources/meeting',
                name: '会议室',
            },
            {
                path: '/foreEnd/workbench/project',
                authignore: true,
                component: '../components/renderRouter',
                name: '项目列表',
                routes: [
                    {
                        path: '/foreEnd/workbench/project/:id',
                        authignore: true,
                        component: './workbench/project',
                        name: '项目列表',
                    },
                ],
            },
        ],
    },
];
