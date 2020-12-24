import storage from '@/utils/storage';
import avatar1 from '@/assets/avatar.png';
import {
    taskType,
    leadingCadreType,
    taskFinishStatus,
    myProjectId,
    finishPanelId,
    privatePublicFlag,
} from '../../../_enum';
// 获取详情
export const formateTaskData = (taskData) => {
    const { scheduleProjectDto = {} } = taskData;
    const schedulePanelList = Array.isArray(scheduleProjectDto.schedulePanelList)
        ? scheduleProjectDto.schedulePanelList
        : [];

    // if (scheduleProjectDto) {
    //     scheduleProjectDto.schedulePanelList.forEach((item, i) => {
    //         const newItem = { ...item };
    //         newItem.id = item.panelId;
    //         newItem.name = item.panelName;
    //         scheduleProjectDto.schedulePanelList[i] = newItem;
    //     });
    // }
    // newScheduleProjectDto = scheduleProjectDto.projectId;
    return {
        ...taskData,
        projectVO: { projectId: scheduleProjectDto.projectId, projectName: scheduleProjectDto.projectName },
        panelVO: schedulePanelList[0] || {},
    };
};
export const submitFormate = (params = {}) => {
    const { projectVO, panelVO, scheduleMemberList, ...others } = params;
    // scheduleMemberList字段需向里注入scheduleId;

    return {
        ...others,
        scheduleProjectDto: {
            ...projectVO,
            schedulePanelList: [panelVO],
        },
        scheduleMemberList: Array.isArray(scheduleMemberList)
            ? scheduleMemberList.map((ls) => {
                return { ...ls, scheduleId: params.id };
            })
            : [],
    };
};
/*
 *   初始化任务
 *  默认成员负责人事当前登录人
 */
export const initTask = (params = {}) => {
    const { userId, userName, avatar } = storage.getUserInfo();
    const projectVO = params.projectId ? { projectId: params.projectId, projectName: params.projectName } : {};
    const panelVO = params.panelId ? { panelId: params.panelId, panelName: params.panelName } : {};
    return {
        // beginTime,
        // endTime,

        // scheduleName,
        scheduleProjectDto: {
            ...projectVO,
            schedulePanelList: [panelVO],
        },
        type: taskType,
        scheduleMemberList: [
            {
                memberAvatar: avatar || avatar1,
                userId,
                userName,
                memberId: userId,
                memberName: userName,
                memberType: leadingCadreType,
            },
        ],
        // rootScheduleId: formData.rootScheduleId,
        // parentScheduleId: id,
        scheduleType: '0',
        scheduleNoticeList: [
            {
                timeIntervalFlag: 1,
                noticeName: '不提醒',
                noticeType: 0,
            },
        ],
        privateFlag: privatePublicFlag,
        finishFlag: projectVO.projectId === myProjectId && panelVO.panelId === finishPanelId ? taskFinishStatus : 0,
        schedulePriority: 1, // 优先级默认是普通
    };
};
export default { formateTaskData, submitFormate };
