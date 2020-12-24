import _dvaDynamic from 'dva/dynamic';

export const config = {
    Filter: {
        name: '数据筛选',
        component: _dvaDynamic({
            component: () => {
                return import('./Filter');
            },
        }),
    },
    KanBoard: {
        name: '视图选择框',
        component: _dvaDynamic({
            component: () => {
                return import('./KanBoard');
            },
        }),
    },
    Search: {
        name: '搜索框',
        component: _dvaDynamic({
            component: () => {
                return import('./Search');
            },
        }),
    },
    Setting: {
        name: '设置',
        component: _dvaDynamic({
            component: () => {
                return import('./Setting');
            },
        }),
    },
    Participant: {
        name: '参与人',
        component: _dvaDynamic({
            component: () => {
                return import('./Notify');
            },
        }),
    },
};
export default {
    config,
};
