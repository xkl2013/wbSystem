export const settle = {
    path: '/foreEnd/business/settleManage',
    component: '../components/renderRouter',
    name: '结算管理',
    routes: [
        {
            path: '/foreEnd/business/settleManage/charge',
            component: '../components/renderRouter',
            name: '收款管理',
            routes: [
                {
                    path: '/foreEnd/business/settleManage/charge/register',
                    component: '../components/renderRouter',
                    name: '款项登记',
                    tagGroup: [
                        {
                            path: '/foreEnd/business/settleManage/charge/register',
                            name: '款项登记',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/claim',
                            name: '款项认领',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/examine',
                            name: '认领结果审核',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/return',
                            name: '项目回款',
                        },
                    ],
                    routes: [
                        {
                            path: '/foreEnd/business/settleManage/charge/register',
                            component: './business/settleManage/charge/register',
                            name: '款项登记',
                        },
                    ],
                },
                {
                    path: '/foreEnd/business/settleManage/charge/claim',
                    component: '../components/renderRouter',
                    name: '款项认领',
                    tagGroup: [
                        {
                            path: '/foreEnd/business/settleManage/charge/register',
                            name: '款项登记',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/claim',
                            name: '款项认领',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/examine',
                            name: '认领结果审核',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/return',
                            name: '项目回款',
                        },
                    ],
                    routes: [
                        {
                            path: '/foreEnd/business/settleManage/charge/claim',
                            component: './business/settleManage/charge/claim',
                            name: '款项认领',
                        },
                    ],
                },
                {
                    path: '/foreEnd/business/settleManage/charge/examine',
                    component: '../components/renderRouter',
                    name: '认领结果审核',
                    tagGroup: [
                        {
                            path: '/foreEnd/business/settleManage/charge/register',
                            name: '款项登记',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/claim',
                            name: '款项认领',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/examine',
                            name: '认领结果审核',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/return',
                            name: '项目回款',
                        },
                    ],
                    routes: [
                        {
                            path: '/foreEnd/business/settleManage/charge/examine',
                            component: './business/settleManage/charge/examine',
                            name: '认领结果审核',
                        },
                    ],
                },
                {
                    path: '/foreEnd/business/settleManage/charge/return',
                    component: '../components/renderRouter',
                    name: '项目回款',
                    tagGroup: [
                        {
                            path: '/foreEnd/business/settleManage/charge/register',
                            name: '款项登记',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/claim',
                            name: '款项认领',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/examine',
                            name: '认领结果审核',
                        },
                        {
                            path: '/foreEnd/business/settleManage/charge/return',
                            name: '项目回款',
                        },
                    ],
                    routes: [
                        {
                            path: '/foreEnd/business/settleManage/charge/return',
                            component: './business/settleManage/charge/return',
                            name: '项目回款',
                        },
                    ],
                },
            ],
        },
        {
            path: '/foreEnd/business/settleManage/statement',
            component: '../components/renderRouter',
            name: '结算单',
            routes: [
                {
                    path: '/foreEnd/business/settleManage/statement',
                    component: '../components/renderRouter',
                    name: '结算单',
                    tagGroup: [
                        {
                            path: '/foreEnd/business/settleManage/statement/list',
                            name: '结算单',
                        },
                    ],
                    routes: [
                        {
                            path: '/foreEnd/business/settleManage/statement/list',
                            component: './business/settleManage/statement/list',
                            name: '结算单',
                        },
                        {
                            path: '/foreEnd/business/settleManage/statement/detail',
                            component: './business/settleManage/statement/detail',
                            name: '结算单详情',
                            hideSecondMenu: true,
                            isDoBack: true,
                        },
                    ],
                },
            ],
        },
        {
            path: '/foreEnd/business/settleManage/progress',
            component: '../components/renderRouter',
            name: '结算进度',
            routes: [
                {
                    path: '/foreEnd/business/settleManage/progress',
                    component: './business/settleManage/progress/list',
                    name: '结算进度',
                },
            ],
        },
    ],
};
