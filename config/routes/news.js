import { Base64 } from 'js-base64';
import qs from 'qs';
// messageModule 消息模块名称
export const news = [
    {
        path: '/foreEnd/message',
        component: './message',
        type: 'iconxiaoxiguanlix1',
        activeType: 'iconxiaoxiguanlix',
        name: '消息',
        authignore: true,
        routes: [
            {
                path: '/foreEnd/message',
                redirect: `/foreEnd/message/${Base64.encode(qs.stringify({ messageModule: null }))}`,
            },
            {
                path: '/foreEnd/message/:id',
                component: './message/list',
                authignore: true,
                name: '消息',
            },
        ],
    },
];
