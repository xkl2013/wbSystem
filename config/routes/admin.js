export const adminRouter = [
    // 后台管理模块
    {
        path: '/admin',
        component: '../layouts/AdminLayout',
        routes: [
            {
                path: '/admin',
                redirect: '/admin/indexPage',
                authignore: true,
            },
            {
                path: '/admin/indexPage',
                component: './admin/indexPage',
                authignore: true,
                hideSecondMenu: true,
            },
            {
                path: '/admin/orgStructure',
                type: 'iconzuzhiguanlix1',
                activeType: 'iconzuzhiguanlix',
                component: '../components/renderRouter',
                name: '组织管理',
                routes: [
                    // 公司管理
                    {
                        path: '/admin/orgStructure/company',
                        name: '公司管理',
                        component: '../components/renderRouter',
                        routes: [
                            {
                                path: '/admin/orgStructure/company',
                                component: './admin/organizationStructure/company/list/index.jsx',
                                name: '公司管理',
                            },
                            {
                                path: '/admin/orgStructure/company/add',
                                component: './admin/organizationStructure/company/add/index.jsx',
                                name: '新增公司',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                            {
                                path: '/admin/orgStructure/company/edit',
                                component: './admin/organizationStructure/company/edit/index.jsx',
                                name: '编辑公司',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                            {
                                path: '/admin/orgStructure/company/detail',
                                component: './admin/organizationStructure/company/detail/index.jsx',
                                name: '公司详情',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                    // 组织管理
                    {
                        path: '/admin/orgStructure/organization',
                        name: '组织管理',
                        component: '../components/renderRouter',
                        routes: [
                            {
                                path: '/admin/orgStructure/organization',
                                component: './admin/organizationStructure/organization/list/index.jsx',
                                name: '组织管理',
                            },
                            {
                                path: '/admin/orgStructure/organization/add',
                                component: './admin/organizationStructure/organization/add/index.jsx',
                                name: '新增组织',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                            {
                                path: '/admin/orgStructure/organization/edit',
                                component: './admin/organizationStructure/organization/edit/index.jsx',
                                name: '编辑组织',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                            {
                                path: '/admin/orgStructure/organization/detail',
                                component: './admin/organizationStructure/organization/detail/index.jsx',
                                name: '公司组织',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                    // 角色管理
                    {
                        path: '/admin/orgStructure/role',
                        name: '角色管理',
                        component: '../components/renderRouter',
                        routes: [
                            {
                                path: '/admin/orgStructure/role',
                                component: './admin/organizationStructure/role/list/index.jsx',
                                name: '角色管理',
                            },
                            {
                                path: '/admin/orgStructure/role/add',
                                component: './admin/organizationStructure/role/add/index.jsx',
                                name: '新增角色',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                            {
                                path: '/admin/orgStructure/role/edit',
                                component: './admin/organizationStructure/role/edit/index.jsx',
                                name: '编辑角色',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                            {
                                path: '/admin/orgStructure/role/detail',
                                component: './admin/organizationStructure/role/detail/index.jsx',
                                name: '查看角色',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                    {
                        path: '/admin/orgStructure/data',
                        name: '数据管理',
                        component: '../components/renderRouter',
                        routes: [
                            {
                                path: '/admin/orgStructure/data/general',
                                name: '数据管理',
                                component: '../components/renderRouter',
                                tagGroup: [
                                    { path: '/admin/orgStructure/data/general', name: '数据管理' },
                                    {
                                        path: '/admin/orgStructure/data/customization',
                                        name: '定制盘管理',
                                    },
                                ],
                                routes: [
                                    {
                                        path: '/admin/orgStructure/data/general',
                                        component: './admin/organizationStructure/data/general',
                                        name: '数据管理',
                                    },
                                ],
                            },
                            {
                                path: '/admin/orgStructure/data/customization',
                                name: '定制盘管理',
                                component: '../components/renderRouter',
                                tagGroup: [
                                    { path: '/admin/orgStructure/data/general', name: '数据管理' },
                                    {
                                        path: '/admin/orgStructure/data/customization',
                                        name: '定制盘管理',
                                    },
                                ],
                                routes: [
                                    {
                                        path: '/admin/orgStructure/data/customization',
                                        component: './admin/organizationStructure/data/customization/list/index.jsx',
                                        name: '定制盘管理',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                path: '/admin/users',
                type: 'iconyonghuguanlix1',
                activeType: 'iconyonghuguanlix',
                component: '../components/renderRouter',
                name: '用户管理',
                routes: [
                    // 内部用户
                    {
                        path: '/admin/users/internal',
                        name: '内部用户',
                        component: '../components/renderRouter',
                        routes: [
                            {
                                path: '/admin/users/internal',
                                component: './admin/users/internal/list',
                            },
                            {
                                path: '/admin/users/internal/add',
                                component: './admin/users/internal/add/index.js',
                                name: '新增用户',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                            {
                                path: '/admin/users/internal/edit',
                                component: './admin/users/internal/edit/index.jsx',
                                name: '编辑用户',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                            {
                                path: '/admin/users/internal/detail',
                                component: './admin/users/internal/detail',
                                name: '用户详情',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                ],
            },
            // 审批管理模块
            {
                path: '/admin/approval',
                type: 'iconshenpipeizhi1',
                activeType: 'iconshenpipeizhi',
                component: '../components/renderRouter',
                name: '审批配置',
                routes: [
                    // 审批配置
                    {
                        path: '/admin/approval/group',
                        name: '分组管理',
                        // component: './admin/approval/group',
                        routes: [
                            {
                                path: '/admin/approval/group',
                                name: '分组管理',
                                component: './admin/approval/group/list',
                            },
                            {
                                path: '/admin/approval/group/add',
                                name: '新增分组',
                                component: './admin/approval/group/add',
                            },
                            {
                                path: '/admin/approval/group/edit',
                                name: '编辑分组',
                                component: './admin/approval/group/edit',
                            },
                        ],
                    },
                    {
                        path: '/admin/approval/flow',
                        name: '审批流管理',
                        routes: [
                            {
                                path: '/admin/approval/flow',
                                name: '设置审批流',
                                component: './admin/approval/flow/list',
                            },
                            {
                                path: '/admin/approval/flow/settingFlow',
                                name: '设置审批流',
                                component: './admin/approval/flow/settingFlow',
                            },
                            {
                                path: '/admin/approval/flow/advancedSetting',
                                name: '高级设置',
                                component: './admin/approval/flow/advancedSetting',
                            },
                            {
                                path: '/admin/approval/flow/add',
                                name: '新增审批流',
                                component: './admin/approval/flow/addFlow',
                            },
                            {
                                path: '/admin/approval/flow/edit',
                                name: '编辑审批流',
                                component: './admin/approval/flow/editFlow',
                            },
                        ],
                    },
                ],
            },
            // cms
            {
                path: '/admin/influencercms',
                type: 'iconshenpipeizhi1',
                activeType: 'iconshenpipeizhi',
                component: '../components/renderRouter',
                name: 'CMS',
            },
        ],
    },
];
