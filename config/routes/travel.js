export const travel = {
    path: '/foreEnd/business/travelOrder',
    component: '../components/renderRouter',
    name: '差旅订单管理',
    routes: [
        {
            path: '/foreEnd/business/travelOrder/travelOrderManage',
            component: '../components/renderRouter',
            tagGroup: [
                {
                    path: '/foreEnd/business/travelOrder/travelOrderManage',
                    name: '差旅订单管理',
                },
            ],
            name: '差旅订单管理',
            routes: [
                {
                    path: '/foreEnd/business/travelOrder/travelOrderManage',
                    component: './business/travelOrder/travelOrderManage',
                    name: '差旅订单管理',
                },
                {
                    path: '/foreEnd/business/travelOrder/travelOrderManage/detail',
                    component: './business/travelOrder/detail',
                    name: '差旅订单管理详情',
                    hideSecondMenu: true,
                    isDoBack: true,
                },
            ],
        },
    ],
};
