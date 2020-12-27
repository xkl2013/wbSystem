//CRM 相关路由
import { news } from './news';
import { workbench } from './workbench';
import { settle, receivable } from './settle';
import { project } from './project';

const routes = [
    ...workbench,
    // 消息模块
    // ...news,
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
            // settle,
            // 应收管理
            receivable,
        ],
    },
];
export default routes;
