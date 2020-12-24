import CRM_Routes from './routes/foreEnd';
import { adminRouter } from './routes/admin';

export const routes = [
    // 文档配置模块
    {
        path: '/doc',
        component: '../components/renderRouter',
        routes: [
            {
                path: '/doc',
                component: './doc',
            },
            {
                path: '/doc/approval',
                component: './doc/approval',
            },
            {
                path: '/doc/editor',
                component: './doc/editor',
            },
        ],
    },
    // 登录模块
    {
        path: '/loginLayout',
        component: '../layouts/LoginLayout',
        routes: [
            {
                path: '/loginLayout/loginIn',
                // component: './login/loginIn',
                component: './login/apolloLoginIn',
            },
            {
                path: '/loginLayout/wx',
                component: './login/apolloLoginIn/wx/result',
            },
        ],
    },
    //异常模块
    {
        path: '/exception',
        component: '../layouts/ExceptionLayout',
        routes: [
            {
                path: '/exception/403',
                component: './exception/403',
            },
            {
                path: '/exception/404',
                component: './exception/404',
            },
            {
                path: '/exception/500',
                component: './exception/500',
            },
        ],
    },
    // 主要业余模块
    {
        path: '/',
        redirect: '/foreEnd',
    },
    {
        path: '/',
        component: '../layouts/BaseLayout',
        routes: [
            // 前端部分
            {
                path: '/foreEnd',
                authignore: true,
                component: '../layouts/ForeEndLayout',
                routes: [...CRM_Routes],
            },

            ...adminRouter,
        ],
    },
];
// 待优化
export function checkAuthignore() {
    return ['/admin', '/admin/indexPage', '/foreEnd', '/foreEnd/indexPage'];
}
