export const workbench = [
    {
        path: '/foreEnd/workbench',
        component: './workbench/mine',
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
        ],
    },
];
