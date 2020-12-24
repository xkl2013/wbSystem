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
                name: '工作台',
                authignore: true,
            },
            {
                path: '/foreEnd/workbench/monitor',
                component: './workbench/monitor',
                name: '数据监控',
                authignore: true,
            },
        ],
    },
];
