export const live = {
    path: '/foreEnd/business/live',
    component: '../components/renderRouter',
    name: '商务直播管理',
    routes: [
        // 直播产品
        {
            path: '/foreEnd/business/live/product',
            component: './business/live/product',
            name: '产品库',
        },
        {
            path: '/foreEnd/business/live/product/import',
            component: './business/live/importGoods',
            name: '导入',
            // hideSecondMenu: true,
            // isDoBack: true,
        },

        // 直播场次
        {
            path: '/foreEnd/business/live/session',
            component: './business/live/session',
            name: '直播场次（艺人）',
            isLeaf: true,
            routes: [
                {
                    path: '/foreEnd/business/live/session/first',
                    component: './business/live/session/first',
                    tagGroup: [
                        { path: '/foreEnd/business/live/session/first', name: '选品初筛' },
                        { path: '/foreEnd/business/live/session/second', name: '选品二筛' },
                        { path: '/foreEnd/business/live/session/final', name: '最终选品' },
                        { path: '/foreEnd/business/live/session/sorted', name: '直播排序' },
                    ],
                    params: ['liveId', 'liveName', 'roomId'],
                    name: '选品初筛',
                    hideSecondMenu: true,
                },
                {
                    path: '/foreEnd/business/live/session/second',
                    component: './business/live/session/second',
                    tagGroup: [
                        { path: '/foreEnd/business/live/session/first', name: '选品初筛' },
                        { path: '/foreEnd/business/live/session/second', name: '选品二筛' },
                        { path: '/foreEnd/business/live/session/final', name: '最终选品' },
                        { path: '/foreEnd/business/live/session/sorted', name: '直播排序' },
                    ],
                    params: ['liveId', 'liveName', 'roomId'],
                    name: '选品二筛',
                    hideSecondMenu: true,
                },
                {
                    path: '/foreEnd/business/live/session/final',
                    component: './business/live/session/final',
                    tagGroup: [
                        { path: '/foreEnd/business/live/session/first', name: '选品初筛' },
                        { path: '/foreEnd/business/live/session/second', name: '选品二筛' },
                        { path: '/foreEnd/business/live/session/final', name: '最终选品' },
                        { path: '/foreEnd/business/live/session/sorted', name: '直播排序' },
                    ],
                    params: ['liveId', 'liveName', 'roomId'],
                    name: '最终选品',
                    hideSecondMenu: true,
                },
                {
                    path: '/foreEnd/business/live/session/sorted',
                    component: './business/live/session/sorted',
                    tagGroup: [
                        { path: '/foreEnd/business/live/session/first', name: '选品初筛' },
                        { path: '/foreEnd/business/live/session/second', name: '选品二筛' },
                        { path: '/foreEnd/business/live/session/final', name: '最终选品' },
                        { path: '/foreEnd/business/live/session/sorted', name: '直播排序' },
                    ],
                    params: ['liveId', 'liveName', 'roomId'],
                    name: '直播排序',
                    hideSecondMenu: true,
                },
            ],
        },
        // 博主直播场次
        {
            path: '/foreEnd/business/live/bloggerSession',
            component: './business/live/bloggerSession',
            name: '直播场次（博主）',
            isLeaf: true,
            routes: [
                {
                    path: '/foreEnd/business/live/bloggerSession/first',
                    component: './business/live/bloggerSession/first',
                    tagGroup: [
                        { path: '/foreEnd/business/live/bloggerSession/first', name: '选品初筛' },
                        { path: '/foreEnd/business/live/bloggerSession/second', name: '选品二筛' },
                        { path: '/foreEnd/business/live/bloggerSession/final', name: '最终选品' },
                        { path: '/foreEnd/business/live/bloggerSession/sorted', name: '直播排序' },
                    ],
                    params: ['liveId', 'liveName', 'roomId'],
                    name: '选品初筛',
                    hideSecondMenu: true,
                },
                {
                    path: '/foreEnd/business/live/bloggerSession/second',
                    component: './business/live/bloggerSession/second',
                    tagGroup: [
                        { path: '/foreEnd/business/live/bloggerSession/first', name: '选品初筛' },
                        { path: '/foreEnd/business/live/bloggerSession/second', name: '选品二筛' },
                        { path: '/foreEnd/business/live/bloggerSession/final', name: '最终选品' },
                        { path: '/foreEnd/business/live/bloggerSession/sorted', name: '直播排序' },
                    ],
                    params: ['liveId', 'liveName', 'roomId'],
                    name: '选品二筛',
                    hideSecondMenu: true,
                },
                {
                    path: '/foreEnd/business/live/bloggerSession/final',
                    component: './business/live/bloggerSession/final',
                    tagGroup: [
                        { path: '/foreEnd/business/live/bloggerSession/first', name: '选品初筛' },
                        { path: '/foreEnd/business/live/bloggerSession/second', name: '选品二筛' },
                        { path: '/foreEnd/business/live/bloggerSession/final', name: '最终选品' },
                        { path: '/foreEnd/business/live/bloggerSession/sorted', name: '直播排序' },
                    ],
                    params: ['liveId', 'liveName', 'roomId'],
                    name: '最终选品',
                    hideSecondMenu: true,
                },
                {
                    path: '/foreEnd/business/live/bloggerSession/sorted',
                    component: './business/live/bloggerSession/sorted',
                    tagGroup: [
                        { path: '/foreEnd/business/live/bloggerSession/first', name: '选品初筛' },
                        { path: '/foreEnd/business/live/bloggerSession/second', name: '选品二筛' },
                        { path: '/foreEnd/business/live/bloggerSession/final', name: '最终选品' },
                        { path: '/foreEnd/business/live/bloggerSession/sorted', name: '直播排序' },
                    ],
                    params: ['liveId', 'liveName', 'roomId'],
                    name: '直播排序',
                    hideSecondMenu: true,
                },
            ],
        },
    ],
};
