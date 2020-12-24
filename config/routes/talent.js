import { publication } from './publication';

export const talent = {
    path: '/foreEnd/business/talentManage',
    component: '../components/renderRouter',
    name: 'Talent管理',
    routes: [
        {
            path: '/foreEnd/business/talentManage/schedule',
            component: '../components/renderRouter',
            name: '档期管理',
            routes: [
                {
                    path: '/foreEnd/business/talentManage/schedule/actor',
                    component: '../components/renderRouter',
                    name: '艺人档期',
                    hideSecondMenu: true,
                    // hideBackIcon: true,
                    tagGroup: [
                        {
                            path: '/foreEnd/business/talentManage/schedule/actor',
                            name: '艺人档期',
                        },
                        {
                            path: '/foreEnd/business/talentManage/schedule/blogger',
                            name: '博主档期',
                        },
                    ],
                    routes: [
                        {
                            path: '/foreEnd/business/talentManage/schedule/actor',
                            component: './business/talent/schedule/actor',
                            name: '艺人档期',
                        },
                    ],
                },
                {
                    path: '/foreEnd/business/talentManage/schedule/blogger',
                    component: '../components/renderRouter',
                    hideSecondMenu: true,
                    // hideBackIcon: true,
                    tagGroup: [
                        {
                            path: '/foreEnd/business/talentManage/schedule/actor',
                            name: '艺人档期',
                        },
                        {
                            path: '/foreEnd/business/talentManage/schedule/blogger',
                            name: '博主档期',
                        },
                    ],
                    name: '博主档期',
                    routes: [
                        {
                            path: '/foreEnd/business/talentManage/schedule/blogger',
                            component: './business/talent/schedule/blogger',
                            name: '博主档期',
                        },
                    ],
                },
            ],
        },
        {
            path: '/foreEnd/business/talentManage/throwManage',
            component: '../components/renderRouter',
            name: '投放管理',
            routes: [
                // {
                //     path: '/foreEnd/business/talentManage/throwManage',
                //     component: '../components/renderRouter',
                //     // component: './business/talent/throwManage/list',
                //     name: '投放列表',
                //     routes: [
                {
                    path: '/foreEnd/business/talentManage/throwManage/list',
                    component: './business/talent/throwManage/list',
                    name: '投放列表',
                    tagGroup: [
                        {
                            path: '/foreEnd/business/talentManage/throwManage/list',
                            name: '投放列表',
                        },
                        {
                            path: '/foreEnd/business/talentManage/throwManage/effect',
                            name: '投放效果',
                        },
                        {
                            path: '/foreEnd/business/talentManage/throwManage/analyze',
                            name: '投放分析',
                        },
                    ],
                },
                {
                    path: '/foreEnd/business/talentManage/throwManage/effect',
                    component: './business/talent/throwManage/effect',
                    name: '投放效果',
                    tagGroup: [
                        {
                            path: '/foreEnd/business/talentManage/throwManage/list',
                            name: '投放列表',
                        },
                        {
                            path: '/foreEnd/business/talentManage/throwManage/effect',
                            name: '投放效果',
                        },
                        {
                            path: '/foreEnd/business/talentManage/throwManage/analyze',
                            name: '投放分析',
                        },
                    ],
                },
                {
                    path: '/foreEnd/business/talentManage/throwManage/analyze',
                    component: './business/talent/throwManage/analyze',
                    name: '投放分析',
                    tagGroup: [
                        {
                            path: '/foreEnd/business/talentManage/throwManage/list',
                            name: '投放列表',
                        },
                        {
                            path: '/foreEnd/business/talentManage/throwManage/effect',
                            name: '投放效果',
                        },
                        {
                            path: '/foreEnd/business/talentManage/throwManage/analyze',
                            name: '投放分析',
                        },
                    ],
                },
                {
                    path: '/foreEnd/business/talentManage/throwManage/add',
                    component: './business/talent/throwManage/list/add',
                    name: '新增推广',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/talentManage/throwManage/edit',
                    component: './business/talent/throwManage/list/edit',
                    name: '编辑推广',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/talentManage/throwManage/detail',
                    component: './business/talent/throwManage/list/detail',
                    name: '推广详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                //     ],
                // },
            ],
        },
        {
            path: '/foreEnd/business/talentManage/talent',
            component: '../components/renderRouter',
            name: 'Talent',
            routes: [
                {
                    path: '/foreEnd/business/talentManage/talent/actor',
                    component: '../components/renderRouter',
                    name: '艺人',
                    tagGroup: [
                        {
                            path: '/foreEnd/business/talentManage/talent/actor',
                            name: '艺人',
                        },
                        {
                            path: '/foreEnd/business/talentManage/talent/blogger',
                            name: '博主',
                        },
                    ],
                    routes: [
                        {
                            path: '/foreEnd/business/talentManage/talent/actor',
                            component: './business/talent/actor/list',
                            name: '艺人',
                        },
                        {
                            path: '/foreEnd/business/talentManage/talent/actor/add',
                            component: './business/talent/actor/add',
                            name: '新增艺人',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                        {
                            path: '/foreEnd/business/talentManage/talent/actor/edit',
                            component: './business/talent/actor/edit',
                            name: '编辑艺人',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                        {
                            path: '/foreEnd/business/talentManage/talent/actor/detail',
                            component: './business/talent/actor/detail',
                            name: '艺人详情',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                    ],
                },
                {
                    path: '/foreEnd/business/talentManage/talent/blogger',

                    tagGroup: [
                        {
                            path: '/foreEnd/business/talentManage/talent/actor',
                            name: '艺人',
                        },
                        {
                            path: '/foreEnd/business/talentManage/talent/blogger',
                            name: '博主',
                        },
                    ],
                    name: '博主',
                    routes: [
                        {
                            path: '/foreEnd/business/talentManage/talent/blogger',
                            component: './business/talent/blogger/list',
                            name: '博主',
                        },
                        {
                            path: '/foreEnd/business/talentManage/talent/blogger/add',
                            component: './business/talent/blogger/add',
                            name: '新增博主',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                        {
                            path: '/foreEnd/business/talentManage/talent/blogger/edit',
                            component: './business/talent/blogger/edit',
                            name: '编辑博主',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                        {
                            path: '/foreEnd/business/talentManage/talent/blogger/detail',
                            component: './business/talent/blogger/detail',
                            name: '博主详情',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                    ],
                },
            ],
        },
        //刊例管理
        ...publication,
    ],
};
