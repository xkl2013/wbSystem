export default {
    namespace: 'header',
    state: {
        headerName: {
            //    '/path':{title:'首页',subTitle:'一级首页',component:'自定义组件'},
        },
        collapsed: false,
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
        saveHeaderName(state, { payload }) {
            const newObj = {};
            const pathname = window.location.pathname;
            // 改为只保留最新的header
            newObj[pathname] = { ...payload };
            const headerName = { ...newObj };
            return { ...state, headerName };
        },
    },
};
