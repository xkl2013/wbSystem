export default {
    namespace: 'live_analyse',
    state: {
        visible: false,
        liveId: '',
    },
    effects: {
        // 合同成本台账详情
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
        changeCollapsed(state, { payload }) {
            const liveId = payload.liveId;
            return { ...state, visible: payload.visible, liveId };
        },
    },
};
