export const project = {
    path: '/foreEnd/business/project',
    component: '../components/renderRouter',
    name: '项目管理',
    routes: [
        // 项目合同
        {
            path: '/foreEnd/business/project/contract',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/project/contract', name: '项目合同' },
                { path: '/foreEnd/business/project/manage', name: '项目管理' },
            ],
            name: '项目合同',
            routes: [
                {
                    path: '/foreEnd/business/project/contract',
                    component: './business/project/contract/list',
                    name: '项目合同',
                },
                {
                    path: '/foreEnd/business/project/contract/add',
                    component: './business/project/contract/add',
                    name: '新增合同',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/project/contract/edit',
                    component: './business/project/contract/edit',
                    name: '编辑合同',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/project/contract/detail',
                    component: './business/project/contract/detail',
                    name: '合同详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/project/contract/verify/detail',
                    component: './business/project/contract/verify/detail',
                    name: '项目费用确认单详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
            ],
        },
        // 项目管理
        {
            path: '/foreEnd/business/project/manage',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/project/contract', name: '项目合同' },
                { path: '/foreEnd/business/project/manage', name: '项目管理' },
            ],
            name: '项目管理',
            routes: [
                {
                    path: '/foreEnd/business/project/manage',
                    component: './business/project/manage/list',
                    name: '项目管理',
                },
                {
                    path: '/foreEnd/business/project/manage/add',
                    component: './business/project/manage/add',
                    name: '新增项目',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/project/manage/edit',
                    component: './business/project/manage/edit',
                    name: '编辑项目',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/project/manage/detail',
                    component: './business/project/manage/detail',
                    name: '项目详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                    routes: [
                        {
                            path: '/foreEnd/business/project/manage/detail', //立项概况
                            component: './business/project/manage/detail/info',
                            name: '立项概况',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },

                        {
                            path: '/foreEnd/business/project/manage/detail/contract', //合同
                            component: './business/project/manage/detail/contract',
                            name: '合同',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                        {
                            path: '/foreEnd/business/project/manage/detail/cost', // 项目费用
                            component: './business/project/manage/detail/projectCost',
                            name: '项目费用',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                        {
                            path: '/foreEnd/business/project/manage/detail/settlement', //项目结算
                            component: './business/project/manage/detail/projectSettlement',
                            name: '项目结算',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                        {
                            path: '/foreEnd/business/project/manage/detail/apply', // 审批信息
                            component: './business/project/manage/detail/approval',
                            name: '审批信息',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                    ],
                },
            ],
        },
    ],
};
