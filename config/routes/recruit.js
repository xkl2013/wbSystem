export const recruit = {
    path: '/foreEnd/business/recruit',
    component: '../components/renderRouter',
    name: '全球招募报名库',
    routes: [
        {
            path: '/foreEnd/business/recruit/list',
            component: './business/recruit/list',
            tagGroup: [
                {
                    path: '/foreEnd/business/recruit/list',
                    name: '报名初筛',
                },
                {
                    path: '/foreEnd/business/recruit/list2',
                    name: '报名二筛',
                },
            ],
            name: '报名初筛',
        },
        {
            path: '/foreEnd/business/recruit/list2',
            component: './business/recruit/list2',
            tagGroup: [
                {
                    path: '/foreEnd/business/recruit/list',
                    name: '报名初筛',
                },
                {
                    path: '/foreEnd/business/recruit/list2',
                    name: '报名二筛',
                },
            ],
            name: '报名二筛',
        },
    ],
};
