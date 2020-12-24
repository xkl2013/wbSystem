export const fee = {
    path: '/foreEnd/business/feeManage',
    component: '../components/renderRouter',
    name: '费用管理',
    routes: [
        {
            path: '/foreEnd/business/feeManage/reimbursement',
            name: '费用报销',
            tagGroup: [
                { path: '/foreEnd/business/feeManage/reimbursement', name: '费用报销' },
                {
                    path: '/foreEnd/business/feeManage/apply',
                    name: '费用申请',
                },
            ],
            routes: [
                {
                    path: '/foreEnd/business/feeManage/reimbursement',
                    component: './business/feeManage/reimbursement/list',
                    name: '报销',
                },
                {
                    path: '/foreEnd/business/feeManage/reimbursement/add',
                    component: './business/feeManage/reimbursement/add',
                    name: '新增报销',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/feeManage/reimbursement/edit',
                    component: './business/feeManage/reimbursement/edit',
                    name: '编辑报销',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/feeManage/reimbursement/detail',
                    component: './business/feeManage/reimbursement/detail/index.js',
                    name: '费用报销详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/feeManage/reimbursement/print',
                    component: './business/feeManage/reimbursement/print',
                    name: '费用打印',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
            ],
        },
        {
            path: '/foreEnd/business/feeManage/apply',

            tagGroup: [
                { path: '/foreEnd/business/feeManage/reimbursement', name: '费用报销' },
                {
                    path: '/foreEnd/business/feeManage/apply',
                    name: '费用申请',
                },
            ],
            name: '费用申请',
            routes: [
                {
                    path: '/foreEnd/business/feeManage/apply',
                    component: './business/feeManage/apply/list',
                    name: '费用申请',
                },
                {
                    path: '/foreEnd/business/feeManage/apply/add',
                    component: './business/feeManage/apply/add',
                    name: '新增申请',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/feeManage/apply/edit',
                    component: './business/feeManage/apply/edit',
                    name: '编辑申请',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/feeManage/apply/detail',
                    component: './business/feeManage/apply/detail',
                    name: '申请详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
                {
                    path: '/foreEnd/business/feeManage/apply/print',
                    component: './business/feeManage/apply/print',
                    name: '费用打印',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
            ],
        },
    ],
};
