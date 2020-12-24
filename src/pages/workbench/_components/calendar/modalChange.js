import moment from 'moment';

// 日历原始数据转换成日历所需数据结构
export const changeCalendarFun = (list = []) => {
    return list.map((item) => {
        // state: 1-日程  2-已完成、未逾期  3-已认领、未逾期  4-已认领、已逾期  5-未认领、未逾期 6-未认领、已逾期 7-已完成、已逾期
        let state;
        let backgroundColor;
        let textColor;
        if (item.type == 0) {
            state = 1;
            backgroundColor = 'rgba(66,202,196,0.1)';
            textColor = '#2C3F53';
        } else if (item.finishFlag == 1) {
            if (item.overdue == 0) {
                state = 2;
                backgroundColor = 'rgba(234,238,242,1)';
                textColor = 'rgba(163,169,183,1)';
            } else if (item.overdue == 1) {
                state = 7;
                backgroundColor = 'rgba(242,43,82,0.2)';
                textColor = 'rgba(255,93,93,1)';
            }
        } else if (item.received == 1) {
            if (item.overdue == 0) {
                state = 3;
                backgroundColor = 'rgba(92,153,255,0.2)';
                textColor = '#2C3F53';
            } else if (item.overdue == 1) {
                state = 4;
                backgroundColor = 'rgba(242,43,82,0.2)';
                textColor = 'rgba(255,93,93,1)';
            }
        } else if (item.received == 0) {
            if (item.overdue == 0) {
                state = 5;
                backgroundColor = 'rgba(92,153,255,0.2)';
                textColor = '#2C3F53';
            } else if (item.overdue == 1) {
                state = 6;
                backgroundColor = 'rgba(242,43,82,0.2)';
                textColor = 'rgba(255,93,93,1)';
            }
        }
        let imgList = [];
        if (item.scheduleMemberList && item.scheduleMemberList.length > 0) {
            if (item.type == 0) {
                imgList = item.scheduleMemberList.filter((item) => {
                    return item.memberType == 0;
                });
            } else if (item.type == 1) {
                imgList = item.scheduleMemberList.filter((item) => {
                    return item.memberType == 1;
                });
            }
        }
        // 判断是否全天
        const bT = moment(item.beginTime).format('YYYY-MM-DD');
        const eT = moment(item.endTime).format('YYYY-MM-DD');
        const allDay = !!(item.wholeDayFlag == 1 || bT != eT);
        // 因日历显示需要(allDay true时，endTime + 1天）
        let newEnd = moment(moment(item.endTime).add(1, 'd')).format('YYYY-MM-DD HH:mm:ss');
        newEnd = allDay ? newEnd : item.endTime;
        return {
            id: item.id,
            title: item.scheduleName,
            start: item.beginTime,
            end: newEnd,
            backgroundColor,
            textColor,
            allDay,
            extendedProps: {
                ...item,
                state,
                imgList,
            },
        };
    });
};

// 会议室tree 转换成 日历所需数据结构 tree
export const changeMeetingTreeListFun = (list = []) => {
    // 会议室循环（三级循环）
    const lever3Arr = (list3 = [], id1, id2) => {
        return list3.map((item) => {
            return {
                ...item,
                level: 3,
                id: `meetingId${id1}-${id2}-${item.id}`,
                title: item.name,
            };
        });
    };

    // 楼层循环（二级循环）
    const lever2Arr = (list2 = [], id) => {
        return list2.map((item) => {
            const length = (item.meetingRoomDtoList && item.meetingRoomDtoList.length) || 0;
            return {
                ...item,
                level: 2,
                id: `${id}-${item.id}-0`,
                title: `${item.name}(${length})`,
                length,
                children: lever3Arr(item.meetingRoomDtoList, id, item.id),
            };
        });
    };

    // 地区循环(一级循环)
    const arr = list.map((item) => {
        return {
            ...item,
            level: 1,
            id: `${item.id}-0-0`,
            title: `${item.name}(${item.meetingAmount})`,
            children: lever2Arr(item.companyBuildingLayerList, item.id),
        };
    });

    return arr || [];
};

// 将会议室日历列表 转化成 资源日历所需格式
export const changeMeetingCalendarFun = (list = []) => {
    return list.map((item) => {
        return {
            title: item.scheduleName,
            start: item.startTime,
            end: item.endTime,
            resourceId: `meetingId${item.companyAddressId}-${item.buildingLayerId}-${item.resourceId}`,
            extendedProps: {
                ...item,
            },
        };
    });
};
