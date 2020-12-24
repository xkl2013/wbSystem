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
                { path: '/foreEnd/business/project/establish', name: '立项管理' },
                { path: '/foreEnd/business/project/verify', name: '项目条款审核' },
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
                { path: '/foreEnd/business/project/establish', name: '立项管理' },
                { path: '/foreEnd/business/project/verify', name: '项目条款审核' },
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
        // 立项管理
        {
            path: '/foreEnd/business/project/establish',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/project/contract', name: '项目合同' },
                { path: '/foreEnd/business/project/manage', name: '项目管理' },
                { path: '/foreEnd/business/project/establish', name: '立项管理' },
                { path: '/foreEnd/business/project/verify', name: '项目条款审核' },
            ],
            name: '立项管理',
            routes: [
                {
                    path: '/foreEnd/business/project/establish',
                    component: './business/project/establish/list',
                    name: '立项管理',
                },
                {
                    path: '/foreEnd/business/project/establish/add',
                    component: './business/project/establish/add',
                    name: '新增立项',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/project/establish/edit',
                    component: './business/project/establish/edit',
                    name: '编辑立项',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/project/establish/detail',
                    component: './business/project/establish/detail',
                    name: '立项详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
            ],
        },
        // 项目条款审核
        {
            path: '/foreEnd/business/project/verify',
            component: '../components/renderRouter',
            tagGroup: [
                { path: '/foreEnd/business/project/contract', name: '项目合同' },
                { path: '/foreEnd/business/project/manage', name: '项目管理' },
                { path: '/foreEnd/business/project/establish', name: '立项管理' },
                { path: '/foreEnd/business/project/verify', name: '项目条款审核' },
            ],
            name: '项目条款审核',
            routes: [
                {
                    path: '/foreEnd/business/project/verify',
                    component: './approval/contract/apply/businessList',
                    name: '项目条款审核',
                },
                {
                    path: '/foreEnd/business/project/verify/detail',
                    component: './approval/contract/detail',
                    name: '合同条款审核详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
            ],
        },
    ],
};
