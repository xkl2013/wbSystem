export const bloggerCRM = {
    path: '/foreEnd/business/bloggerCRM',
    component: '../components/renderRouter',
    name: '博主拓展CRM',
    routes: [
        {
            path: '/foreEnd/business/bloggerCRM/first',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/bloggerCRM/first', name: '初筛' },
                { path: '/foreEnd/business/bloggerCRM/second', name: '二筛' },
                { path: '/foreEnd/business/bloggerCRM/communicating', name: '三筛' },
                // { path: '/foreEnd/business/bloggerCRM/final', name: '最终待确认' },
            ],
            name: '初筛',
            routes: [
                {
                    path: '/foreEnd/business/bloggerCRM/first',
                    component: './business/bloggerCRM/first',
                    name: '初筛',
                    isLeaf: true,
                },
            ],
        },
        {
            path: '/foreEnd/business/bloggerCRM/second',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/bloggerCRM/first', name: '初筛' },
                { path: '/foreEnd/business/bloggerCRM/second', name: '二筛' },
                { path: '/foreEnd/business/bloggerCRM/communicating', name: '三筛' },
                // { path: '/foreEnd/business/bloggerCRM/final', name: '最终待确认' },
            ],
            name: '二筛',
            routes: [
                {
                    path: '/foreEnd/business/bloggerCRM/second',
                    component: './business/bloggerCRM/second',
                    name: '二筛',
                },
            ],
        },
        {
            path: '/foreEnd/business/bloggerCRM/communicating',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/bloggerCRM/first', name: '初筛' },
                { path: '/foreEnd/business/bloggerCRM/second', name: '二筛' },
                { path: '/foreEnd/business/bloggerCRM/communicating', name: '三筛' },
                // { path: '/foreEnd/business/bloggerCRM/final', name: '最终待确认' },
            ],
            name: '三筛',
            routes: [
                {
                    path: '/foreEnd/business/bloggerCRM/communicating',
                    component: './business/bloggerCRM/communicating',
                    name: '三筛',
                },
            ],
        },
        // {
        //     path: '/foreEnd/business/bloggerCRM/final',
        //     component: '../components/renderRouter',
        //     tagGroup: [
        //         { path: '/foreEnd/business/bloggerCRM/first', name: '初筛' },
        //         { path: '/foreEnd/business/bloggerCRM/second', name: '二筛' },
        //         { path: '/foreEnd/business/bloggerCRM/communicating', name: '三筛' },
        // //         { path: '/foreEnd/business/bloggerCRM/final', name: '最终待确认' },
        //     ],
        //     name: '最终待确认',
        //     routes: [
        //         {
        //             path: '/foreEnd/business/bloggerCRM/final',
        //             component: './business/bloggerCRM/final',
        //             name: '最终待确认',
        //         },
        //     ],
        // },
        {
            path: '/foreEnd/business/bloggerCRM/import',
            component: '../components/renderRouter',
            name: '导入',
            routes: [
                {
                    path: '/foreEnd/business/bloggerCRM/import',
                    component: './business/bloggerCRM/importGoods',
                    name: '导入',
                },
            ],
        },
        {
            path: '/foreEnd/business/bloggerCRM/approval',
            component: '../components/renderRouter',
            name: '审批',
            hideSecondMenu: true,
            isDoBack: true,
            backPath: '/foreEnd/business/bloggerCRM/communicating',
            routes: [
                {
                    path: '/foreEnd/business/bloggerCRM/approval',
                    component: './business/bloggerCRM/approval',
                    name: '审批详情',
                },
            ],
        },
    ],
};
