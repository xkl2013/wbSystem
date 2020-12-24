export const approval = [
    {
        path: '/foreEnd/approval',
        component: '../components/renderRouter',
        type: 'iconshenpiguanlix1',
        activeType: 'iconshenpiguanlix',
        name: '审批',
        routes: [
            {
                path: '/foreEnd/approval/initiate',
                component: './approval/initiate',
                name: '发起审批',
            },
            {
                path: '/foreEnd/approval/approval',
                component: '../components/renderRouter',
                name: '我审批的',
                routes: [
                    {
                        path: '/foreEnd/approval/approval/myjob',
                        name: '一般审批',
                        component: '../components/renderRouter',
                        tagGroup: [
                            { path: '/foreEnd/approval/approval/myjob', name: '一般审批' },
                            {
                                path: '/foreEnd/approval/approval/contract',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/business',
                                name: '合同条款审核（商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/reimbursement',
                                name: '费用报销',
                            },
                            {
                                path: '/foreEnd/approval/approval/application',
                                name: '费用申请',
                            },
                        ],
                        routes: [
                            {
                                path: '/foreEnd/approval/approval/myjob',
                                component: './approval/approval/list',
                                name: '一般审批',
                            },
                            {
                                path: '/foreEnd/approval/approval/myjob/detail',
                                component: './approval/approval/detail',
                                name: '一般审批详情',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                    {
                        path: '/foreEnd/approval/approval/contract',
                        name: '合同条款审核（非商单类）',
                        component: '../components/renderRouter',
                        tagGroup: [
                            { path: '/foreEnd/approval/approval/myjob', name: '一般审批' },
                            {
                                path: '/foreEnd/approval/approval/contract',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/business',
                                name: '合同条款审核（商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/reimbursement',
                                name: '费用报销',
                            },
                            {
                                path: '/foreEnd/approval/approval/application',
                                name: '费用申请',
                            },
                        ],
                        routes: [
                            {
                                path: '/foreEnd/approval/approval/contract',
                                component: './approval/contract/approval/commonList',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/contract/detail',
                                component: './approval/contract/detail',
                                name: '合同条款审核（非商单类）详情',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                    {
                        path: '/foreEnd/approval/approval/business',
                        name: '合同条款审核（商单类）',
                        component: '../components/renderRouter',
                        tagGroup: [
                            { path: '/foreEnd/approval/approval/myjob', name: '一般审批' },
                            {
                                path: '/foreEnd/approval/approval/contract',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/business',
                                name: '合同条款审核（商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/reimbursement',
                                name: '费用报销',
                            },
                            {
                                path: '/foreEnd/approval/approval/application',
                                name: '费用申请',
                            },
                        ],
                        routes: [
                            {
                                path: '/foreEnd/approval/approval/business',
                                component: './approval/contract/approval/businessList',
                                name: '合同条款审核（商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/business/detail',
                                component: './approval/contract/detail',
                                name: '合同条款审核（商单类）详情',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                    {
                        path: '/foreEnd/approval/approval/reimbursement',
                        name: '费用报销',
                        component: '../components/renderRouter',
                        tagGroup: [
                            { path: '/foreEnd/approval/approval/myjob', name: '一般审批' },
                            {
                                path: '/foreEnd/approval/approval/contract',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/business',
                                name: '合同条款审核（商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/reimbursement',
                                name: '费用报销',
                            },
                            {
                                path: '/foreEnd/approval/approval/application',
                                name: '费用申请',
                            },
                        ],
                        routes: [
                            {
                                path: '/foreEnd/approval/approval/reimbursement',
                                component: './approval/feeManage/reimbursement',
                                name: '费用报销',
                            },
                        ],
                    },
                    {
                        path: '/foreEnd/approval/approval/application',
                        name: '费用申请',
                        component: '../components/renderRouter',
                        tagGroup: [
                            { path: '/foreEnd/approval/approval/myjob', name: '一般审批' },
                            {
                                path: '/foreEnd/approval/approval/contract',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/business',
                                name: '合同条款审核（商单类）',
                            },
                            {
                                path: '/foreEnd/approval/approval/reimbursement',
                                name: '费用报销',
                            },
                            {
                                path: '/foreEnd/approval/approval/application',
                                name: '费用申请',
                            },
                        ],
                        routes: [
                            {
                                path: '/foreEnd/approval/approval/application',
                                component: './approval/feeManage/application',
                                name: '费用申请',
                            },
                        ],
                    },
                ],
            },
            {
                path: '/foreEnd/approval/apply',
                component: '../components/renderRouter',
                name: '我发起的',
                routes: [
                    {
                        path: '/foreEnd/approval/apply/myjob',
                        component: '../components/renderRouter',
                        name: '一般申请',
                        tagGroup: [
                            { path: '/foreEnd/approval/apply/myjob', name: '一般申请' },
                            {
                                path: '/foreEnd/approval/apply/contract',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/apply/business',
                                name: '合同条款审核（商单类）',
                            },
                        ],
                        routes: [
                            {
                                path: '/foreEnd/approval/apply/myjob',
                                component: './approval/apply/list',
                                name: '一般申请',
                            },
                            {
                                path: '/foreEnd/approval/apply/myjob/detail',
                                component: './approval/apply/detail',
                                name: '项目详情',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                    {
                        path: '/foreEnd/approval/apply/contract',
                        name: '合同条款审核（非商单类）',
                        tagGroup: [
                            { path: '/foreEnd/approval/apply/myjob', name: '一般申请' },
                            {
                                path: '/foreEnd/approval/apply/contract',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/apply/business',
                                name: '合同条款审核（商单类）',
                            },
                        ],
                        routes: [
                            {
                                path: '/foreEnd/approval/apply/contract',
                                component: './approval/contract/apply/commonList',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/apply/contract/detail',
                                component: './approval/contract/detail',
                                name: '合同条款审核（非商单类）详情',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                            {
                                path: '/foreEnd/approval/apply/contract/notify',
                                component: './approval/contract/detail',
                                name: '合同条款审核（非商单类）详情',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                    {
                        path: '/foreEnd/approval/apply/business',
                        name: '合同条款审核（商单类）',
                        tagGroup: [
                            { path: '/foreEnd/approval/apply/myjob', name: '一般申请' },
                            {
                                path: '/foreEnd/approval/apply/contract',
                                name: '合同条款审核（非商单类）',
                            },
                            {
                                path: '/foreEnd/approval/apply/business',
                                name: '合同条款审核（商单类）',
                            },
                        ],
                        routes: [
                            {
                                path: '/foreEnd/approval/apply/business',
                                component: './approval/contract/apply/businessList',
                                name: '合同条款审核（商单类）',
                            },
                            {
                                path: '/foreEnd/approval/apply/business/detail',
                                component: './approval/contract/detail',
                                name: '合同条款审核（商单类）详情',
                                hideSecondMenu: true,
                                isDoBack: true,
                            },
                        ],
                    },
                ],
            },
            {
                path: '/foreEnd/approval/notify',
                component: '../components/renderRouter',
                name: '知会我的',
                routes: [
                    {
                        path: '/foreEnd/approval/notify',
                        component: './approval/notify/list',
                        name: '知会我的',
                    },
                    {
                        path: '/foreEnd/approval/notify/detail',
                        component: './approval/notify/detail',
                        name: '详情',
                        hideSecondMenu: true,
                        isDoBack: true,
                    },
                ],
            },
        ],
    },
];

// 重构审批路由
export const newApproval = [
    {
        path: '/foreEnd/newApproval',
        component: '../components/renderRouter',
        type: 'iconshenpiguanlix1',
        activeType: 'iconshenpiguanlix',
        name: '新审批',
        authignore: true,
        routes: [
            {
                path: '/foreEnd/newApproval',
                redirect: '/foreEnd/newApproval/approvalForward',
            },
            {
                path: '/foreEnd/newApproval/approvalForward',
                component: './newApproval/approvalForward',
                name: '待审批',
            },
            {
                path: '/foreEnd/newApproval/approvalDone',
                component: './newApproval/approvalDone',
                name: '已审批',
            },
            {
                path: '/foreEnd/newApproval/approvalLaunched',
                component: './newApproval/approvalLaunched',
                name: '已发起',
            },
            {
                path: '/foreEnd/newApproval/detail',
                component: './newApproval/detail',
                name: '一般审批详情',
                hideSecondMenu: true,
                isDoBack: true,
                authignore: true,
            },
        ],
    },
];
