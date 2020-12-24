import { getSchedule } from './services';
import { changeCalendarFun } from './modalChange';

export default {
    namespace: 'talent_schedule',

    state: {
        scheduleCalendarData: [], // 日历展示数据
    },

    effects: {
        * getScheduleCalendarData({ payload }, { call, put }) {
            // 获取日历数据
            const result = yield call(getSchedule, payload);
            let scheduleCalendarData = [];
            if (result && result.success === true) {
                scheduleCalendarData = changeCalendarFun(result.data || [], payload);
            }
            yield put({ type: 'save', payload: { scheduleCalendarData } });
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    subscriptions: {},
};
