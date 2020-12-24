import moment from 'moment';
import { getProjectsPanels, getOccupationMeeting, getScheduleDetail } from './services';
import storage from '@/utils/storage';
import avatar1 from '@/assets/avatar.png';
import { myProjectId, finishPanelId } from '../../_enum';

// 会议室格式化时间
export const dateFormateStr = 'YYYY-MM-DD HH:mm:00';

// 新增列表关联看板
export const getProjectsPanelsFn = async (proId) => {
    const projectId = (proId && Number(proId)) || undefined;
    const response = await getProjectsPanels();
    if (response && response.success) {
        if (response.data) {
            response.data.forEach((item, i) => {
                const newItem = { ...item };
                newItem.id = item.projectId;
                newItem.name = item.projectName;
                if (item.schedulePanelList) {
                    item.schedulePanelList.forEach((ls, i1) => {
                        const newLs = { ...ls };
                        newLs.id = ls.panelId;
                        newLs.name = ls.panelName;
                        response.data[i].schedulePanelList[i1] = newLs;
                    });
                }
                response.data[i] = newItem;
            });
            const newArr = response.data.filter((item) => {
                return item.projectId === projectId;
            })[0];
            const schedulePanelList = (newArr && newArr.schedulePanelList) || [];
            if (projectId || projectId === 0) {
                // 特殊项目
                return { scheduleProjectDto: response.data, schedulePanelList };
            }
        }
    }
};
// 获取会议室资源
export const getMeetingList = async (data) => {
    const response = await getOccupationMeeting(data);
    if (response && response.success) {
        if (response.data) {
            response.data.forEach((item, i) => {
                const newItem = { ...item };
                newItem.name = `${item.companyAddress}-${item.buildingLayer}-${item.name}`;
                newItem.disabled = item.occupationStatus === 2;
                response.data[i] = newItem;
            });
        }
        return { meetingList: response.data || [] };
    }
};
// 表单默认值
export const defaultFormData = () => {
    const { userId, userName, avatar } = storage.getUserInfo() || {};
    return {
        scheduleType: '0',
        timeIntervalFlag: '1',
        privateFlag: 1,
        memberType1: [
            {
                avatar: avatar || avatar1,
                memberType: 1,
                userId,
                userName,
                memberId: userId,
                memberName: userName,
            },
        ],
        memberType0: [
            {
                avatar: avatar || avatar1,
                memberType: 0,
                userId,
                userName,
                memberId: userId,
                memberName: userName,
            },
        ],
    };
};
// 获取详情
export const getScheduleDetailFn = async (id, taskData) => {
    let response = taskData;
    if (!taskData) {
        response = await getScheduleDetail(id);
    }

    if (response && response.success) {
        const {
            type,
            scheduleNoticeList,
            scheduleMemberList,
            scheduleResource,
            beginTime,
            endTime,
            scheduleProjectDto,
            // projectAndPanelAccessibleStatus,
        } = response.data;
        const projectId = scheduleProjectDto && scheduleProjectDto.projectId;
        const panelId = scheduleProjectDto
            && scheduleProjectDto.schedulePanelList
            && scheduleProjectDto.schedulePanelList[0].panelId;
        const proObj = await getProjectsPanelsFn(projectId);
        let meetingList = {}; // 临时方案
        if (type === 0) {
            meetingList = await getMeetingList({
                startTime: moment(beginTime).format('YYYY-MM-DD HH:mm:00'),
                endTime: moment(endTime).format('YYYY-MM-DD HH:mm:00'),
                resourceIndexId: scheduleResource && scheduleResource.id,
            });
        }

        const { timeIntervalFlag } = scheduleNoticeList.length ? scheduleNoticeList[0] : {};
        const memberType0 = [];
        const memberType1 = [];
        const memberType2 = [];
        const memberType3 = [];

        scheduleMemberList.forEach((item) => {
            if (item.memberType === 1) {
                // 执行人
                memberType1.push({
                    memberType: 1,
                    avatar: item.memberAvatar,
                    userId: item.memberId,
                    userName: item.memberName,
                });
            } else if (item.memberType === 2) {
                // 参与人
                memberType2.push({
                    memberType: 2,
                    avatar: item.memberAvatar,
                    userId: item.memberId,
                    userName: item.memberName,
                });
            } else if (item.memberType === 3) {
                // 部分可见
                memberType3.push({
                    memberType: 3,
                    avatar: item.memberAvatar,
                    userId: item.memberId,
                    userName: item.memberName,
                });
            }
            if (item.memberType === 0) {
                // 创建人
                memberType0.push({
                    memberType: 0,
                    avatar: item.memberAvatar,
                    userId: item.memberId,
                    userName: item.memberName,
                });
            }
        });
        if (scheduleProjectDto) {
            scheduleProjectDto.schedulePanelList.forEach((item, i) => {
                const newItem = { ...item };
                newItem.id = item.panelId;
                newItem.name = item.panelName;
                scheduleProjectDto.schedulePanelList[i] = newItem;
            });
        }
        let newScheduleProjectDto = {};
        // if (projectAndPanelAccessibleStatus && projectAndPanelAccessibleStatus !== 3) {
        newScheduleProjectDto = scheduleProjectDto.projectId;
        // } else {
        // newScheduleProjectDto = scheduleProjectDto;
        // }
        return {
            formData: {
                ...response.data,
                memberType1,
                memberType2,
                memberType3,
                memberType0,
                timeIntervalFlag: timeIntervalFlag ? String(timeIntervalFlag) : '',
                daterange: [beginTime, endTime]
                    .filter((ls) => {
                        return ls;
                    })
                    .map((ls) => {
                        return moment(ls);
                    }),
                meeting: scheduleResource && scheduleResource.resourceId,
                scheduleProjectDto: newScheduleProjectDto,
                schedulePanelList: panelId,
                scheduleType: '0', // todo 默认写死0，现在只有一个，后期多了需要改
            },
            visible: true,
            panelId,
            projectId,
            scheduleType: scheduleProjectDto,
            type: response.data.type,
            resourceIndexId: scheduleResource && scheduleResource.id,
            ...meetingList,
            ...proObj,
            taskData: response.data, // 兼容处理数据
        };
    }
};
// 格式化上传数据
export const formatData = (formData, obj) => {
    const { userId, userName, avatar } = storage.getUserInfo() || {};
    const { id, type, scheduleProjectDto, schedulePanelList, scheduleType } = obj;
    const data = { ...formData, scheduleNoticeList: [] };
    Object.keys(data).map((key) => {
        switch (key) {
            case 'memberType1':
            case 'memberType2':
            case 'memberType3':
                if (data[key]) {
                    data[key].forEach((item, i) => {
                        data[key][i].scheduleId = id;
                        data[key][i].memberId = item.userId;
                        data[key][i].memberName = item.userName;
                    });
                }
                data.scheduleMemberList.push(data[key]);
                break;
            case 'daterange':
                const [beginTime, endTime] = (Array.isArray(formData.daterange) ? formData.daterange : []).map((ls) => {
                    return moment(ls).format(dateFormateStr);
                });
                data.beginTime = beginTime;
                data.endTime = endTime;
                break;

            case 'timeIntervalFlag':
                data.scheduleNoticeList.push({
                    noticeName: data.scheduleName,
                    noticeType: 0,
                    timeIntervalFlag: Number(data.timeIntervalFlag),
                });
                break;
            case 'finishFlag':
                if (Number(data.finishFlag) === 1) {
                    if (data.memberType1 && data.memberType1.length === 0) {
                        data.memberType1 = [
                            {
                                scheduleId: id,
                                memberType: 1,
                                avatar,
                                userId,
                                userName,
                            },
                        ];
                    }
                }
                break;
            case 'scheduleProjectDto':
                // if (Number(formData.projectAndPanelAccessibleStatus) !== 3) {
                data.scheduleProjectDto = scheduleProjectDto.filter((item) => {
                    return item.id === data[key];
                })[0];
                // }
                break;
            case 'schedulePanelList':
                if (data.scheduleProjectDto) {
                    data.scheduleProjectDto.schedulePanelList = schedulePanelList.filter((item) => {
                        return item.id === data[key];
                    });
                }
                break;
            case 'scheduleType': // 所属日历,把接口返回的传回去
                if (!type) {
                    data.scheduleProjectDto = scheduleType;
                }
                break;
            default:
                break;
        }
    });
    return data;
};
// 获取列表id
export const getDefaultPanelId = (scheduleProjectDto, proId, projectId) => {
    let newPanelId = null;
    if (!proId) {
        if (projectId) {
            newPanelId = scheduleProjectDto.filter((item) => {
                return item.projectId === Number(projectId);
            })[0].schedulePanelList[0].panelId;
        }
    }
    return newPanelId;
};
// 获取用户列表
export const renderNoticers = (Noticers = []) => {
    return Noticers.map((item) => {
        return {
            ...item,
            avatar: item.avatar,
            name: item.userName,
            id: item.id || item.userId,
        };
    });
};
// 自定义字段
const delArr = [
    'memberType0',
    'memberType1',
    'memberType2',
    'memberType3',
    'daterange',
    'meeting',
    'timeIntervalFlag',
    'schedulePanelList',
];
// 删除自定义字段
export const deleteNoUse = (data) => {
    const newData = data;
    delArr.forEach((key) => {
        delete newData[key];
    });
    return newData;
};
// 渲染头部标题
export const renderModalTitle = (key, detailType) => {
    if (detailType === 'detailPage') {
        switch (key) {
            case '1_0':
                return '日程详情';
            case '1_1':
                return '任务详情';
            default:
                break;
        }
    }
    switch (key) {
        case '0_0':
            return '新增日程';
        case '0_1':
            return '修改日程';
        case '1_0':
            return '新增任务';
        case '1_1':
            return '修改任务';
        default:
            break;
    }
};

// 区分操作人
export const operatePerson = (type, obj) => {
    if (type === 1) {
        // 执行人
        return { memberType1: obj };
    }
    if (type === 2) {
        // 参与人
        return { memberType2: obj };
    }
    if (type === 3) {
        // 部分可见人
        return { memberType3: obj };
    }
};
export const reduceScheduleMemberList = (scheduleMemberList) => {
    const filterList = scheduleMemberList.filter((item) => {
        return item;
    });
    const newData = (filterList.length
            && filterList.reduce((a, b) => {
                return a.concat(b);
            }))
        || [];
    return newData;
};
/*
 *
 * @params 用于创建和编辑日历任务的全量量参数
 * @return 处理完任务完成状态的全量参数
 * 逻辑: 项目属于我的日历,时任务的完成状态应该受到所属项目列表控制,判断是否是已完成列表,非的话就是未完成
 */
export const handleTaskFinishStatus = (params = {}) => {
    const newParams = { ...params };
    const scheduleProjectDto = params.scheduleProjectDto || {};
    if (scheduleProjectDto.projectId !== myProjectId || params.parentScheduleId !== 0) return newParams;
    const panleId = (
        (scheduleProjectDto.schedulePanelList || []).find((ls) => {
            return ls;
        }) || {}
    ).panelId;
    newParams.finishFlag = Number(panleId) === finishPanelId ? 1 : 0;
    return newParams;
};
