// 工作模块id
export const workspaceId = 13;
// 工作视图,我的日历 id
export const myProjectId = -1;
// 工作台我的日历项目想,已完成看板 id
export const finishPanelId = 4;
// 创建人type
export const createType = 0;
// 负责人type
export const leadingCadreType = 1;
// 参与人type
export const participantType = 2;
// 只会人type
export const noticeType = 3;
// 任务type
export const taskType = 1;
// 日程 type
export const calendarType = 0;
// 日程任务typeOptions
export const VIEW_TYPE = [{ id: '0', name: '日程' }, { id: '1', name: '任务' }];
// 任务紧急程度
export const PRIORITY_TYPE = [
    { id: '1', name: '普通', color: '#848f9b' },
    { id: '2', name: '紧急', color: '#F7B500' },
    { id: '3', name: '非常紧急', color: '#F05969' },
];
// 任务日程提醒方式
export const SCHEDULE_REMINDER = [
    { id: '1', name: '不提醒' },
    { id: '2', name: '事件发生时' },
    { id: '3', name: '5分钟前' },
    { id: '4', name: '15分钟前' },
    { id: '5', name: '30分钟前' },
    { id: '6', name: '1小时前' },
    { id: '7', name: '2小时前' },
    { id: '8', name: '1天前' },
    { id: '9', name: '2天前' },
    { id: '10', name: '1周前' },
];
// 任务隐私状态
export const privateHideFlag = 0;
// 任务公开状态
export const privatePublicFlag = 1;
// 任务完成状态
export const taskFinishStatus = 1;
export const TASK_STATUS = [{ id: '0', name: '未完成' }, { id: '1', name: '已完成' }];
// 全天标志
export const allDayType = 1;
// 会议室资源类型
export const meetingResourceType = 0;
// 会议室占用情况
export const occupationStatus = {
    occupy: {
        type: 2,
        name: '已占用',
    },
    noOccupy: {
        type: 1,
        name: '未占用',
    },
};
export const fileStatus = {
    not: {
        type: 1,
        name: '未归档',
    },
    already: {
        type: 2,
        name: '已归档',
    },
};
// 无权限id
export const noAuthId = -1;
// 已逾期任务或日程
export const overDueState = 1;
