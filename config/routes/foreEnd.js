//CRM 相关路由
import { customer } from './customer';
import { news } from './news';
import { approval, newApproval } from './approval';
import { shimo } from './shimo';
import { workbench } from './workbench';
import { settle } from './settle';
import { talent } from './talent';
import { project } from './project';
import { fee } from './fee';
import { account } from './account';
import { travel } from './travel';
import { frameManage } from './frameManage';
import { live } from './live';
import { supplier } from './supplier';
import { recruit } from './recruit';
import { threadManage } from './threadManage';
import { bloggerCRM } from './bloggerCrm';

const routes = [
    {
        path: '/foreEnd',
        redirect: '/foreEnd/message',
    },
    {
        path: '/foreEnd/indexPage',
        component: './indexPage',
        authignore: true,
        hideSecondMenu: true,
    },
    // 消息模块
    ...news,
    // ...calendar,
    {
        path: '/foreEnd/executorApproval',
        component: '../components/renderRouter',
        name: '发起人详情',
        authignore: true,
        hideMenu: true,
        routes: [
            {
                path: '/foreEnd/executorApproval/executor',
                component: '../components/renderRouter',
                name: '发起人详情',
                authignore: true,
                routes: [
                    {
                        path: '/foreEnd/executorApproval/executor/detail',
                        component: './approval/executor/detail',
                        name: '发起人详情',
                        isDoBack: true,
                        authignore: true,
                        hideSecondMenu: true,
                    },
                ],
            },
        ],
    },
    // 审批管理
    ...approval,
    // 新审批管理
    ...newApproval,
    {
        path: '/foreEnd/business',
        component: '../components/renderRouter',
        name: '业务',
        type: 'iconyewuguanlix',
        activeType: 'iconyewuguanli',
        routes: [
            // 项目管理
            project,
            // 结算管理
            settle,
            // 费用管理
            fee,
            // 客户管理
            customer,
            // talent管理
            talent,
            // 差旅订单管理
            travel,
            // 台账管理
            account,
            // 年框管理
            frameManage,
            // 直播管理
            live,
            // 供应商管理
            supplier,
            // 艺人招募
            recruit,
            // 商务线索管理
            threadManage,
            // 博主拓展CRM
            bloggerCRM,
        ],
    },
    ...workbench,
    ...shimo,
    {
        path: '/foreEnd/dataChange',
        component: './common/dataChange',
        authignore: true,
        hideSecondMenu: true,
    },
];
export default routes;
