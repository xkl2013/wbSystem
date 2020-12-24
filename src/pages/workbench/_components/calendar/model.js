import { message } from 'antd';
import {
    getSchedule,
    addSchedule,
    editSchedule,
    deleteSchedule,
    getScheduleDetail,
    getMemberList,
    changeMemberList,
    deleteMember,
    getListTree,
    getMeetingTreeList,
    getResources,
    deleteMemberAll,
} from './services';
import { changeCalendarFun, changeMeetingTreeListFun, changeMeetingCalendarFun } from './modalChange';

export default {
    namespace: 'calendar',

    state: {
        scheduleCalendarData: [], // 我的日历/成员日历，日历展示数据
        formData: {},
        memberList: [], // 关注成员列表
        meetingList: [], // 会议室列表
        meetingTreeList: [], // 会议室预定，会议室列表（tree）
        meetingCalendarData: [], // 会议室日历列表
    },

    effects: {
        * getScheduleCalendarData({ payload }, { call, put }) {
            // 我的日历/成员日历，获取日历数据
            const result = yield call(getSchedule, payload);
            let scheduleCalendarData = [];
            if (result && result.success === true) {
                scheduleCalendarData = changeCalendarFun(result.data || []);
            }
            yield put({ type: 'save', payload: { scheduleCalendarData } });
        },
        * getScheduleDetail({ payload }, { call, put }) {
            // 详情
            const result = yield call(getScheduleDetail, payload);
            let formData = [];
            if (result && result.success === true && result.data) {
                formData = result.data;
            }
            yield put({ type: 'save', payload: { formData } });
        },
        * getListTree({ payload }, { call, put }) {
            // 获取会议室列表
            const result = yield call(getListTree, payload);
            let meetingList = [];
            if (result && result.success === true && result.data) {
                meetingList = result.data;
                meetingList.forEach((item) => {
                    item.name = `${item.companyAddress}-${item.buildingLayer}-${item.name}`;
                });
            }
            yield put({ type: 'save', payload: { meetingList } });
        },
        * addSchedule({ payload }, { call, put }) {
            // 新增
            const result = yield call(addSchedule, payload.data);
            if (result && result.success === true) {
                message.success('新增成功');
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * editSchedule({ payload }, { call, put }) {
            // 编辑
            const result = yield call(editSchedule, payload.data);
            if (result && result.success === true) {
                message.success('编辑成功');
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * deleteSchedule({ payload }, { call, put }) {
            // 删除
            const result = yield call(deleteSchedule, payload.data);
            if (result && result.success === true) {
                message.success('删除成功');
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },

        * getMemberList({ payload }, { call, put }) {
            // 获取关注成员列表
            const result = yield call(getMemberList, payload.params);
            let memberList = [];
            if (result && result.success === true && result.data) {
                memberList = result.data;
                yield typeof payload.cb === 'function' && payload.cb(memberList);
            }
            yield put({ type: 'save', payload: { memberList } });
        },
        * changeMemberList({ payload }, { call, put }) {
            // 修改关注成员列表
            const result = yield call(changeMemberList, payload);
            if (result && result.success === true) {
                // let memberList = result.data || [];
                // yield put({ type: 'save', payload: { memberList } });
            }
        },
        * deleteMember({ payload }, { call, put }) {
            // 删除关注成员
            const result = yield call(deleteMember, payload);
            if (result && result.success === true) {
                message.success('取消成功');
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * deleteMemberAll({ payload }, { call, put }) {
            // 删除关注成员 全部
            const result = yield call(deleteMemberAll, payload.data);
            if (result && result.success === true) {
                message.success('取消成功');
                yield typeof payload.cb === 'function' && payload.cb();
            }
        },
        * getMeetingTreeList({ payload }, { call, put }) {
            // 获取会议室列表(tree)
            const result = yield call(getMeetingTreeList, payload);
            let meetingTreeList = [];
            if (result && result.success === true) {
                meetingTreeList = changeMeetingTreeListFun(result.data || []);
            }
            yield put({ type: 'save', payload: { meetingTreeList } });
        },
        * getResourcesCalendarData({ payload }, { call, put }) {
            // 会议室，获取日历数据
            const result = yield call(getResources, payload);
            let meetingCalendarData = [];
            if (result && result.success === true) {
                meetingCalendarData = changeMeetingCalendarFun((result.data && result.data.list) || []);
            }
            yield put({ type: 'save', payload: { meetingCalendarData } });
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    subscriptions: {},
};
