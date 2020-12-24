import moment from 'moment';
/* eslint-disable import/prefer-default-export */
// 日历原始数据转换成日历所需数据结构
export const changeCalendarFun = (list = [], { talentType, onlineDatePlan, onlineDate }) => {
    return list.map((item) => {
        // state: 1-已完成  2-新建  3-已存在
        let state;
        let backgroundColor;
        let textColor;
        if (item.isOver) {
            // 已完成
            state = 1;
            backgroundColor = 'rgba(234,238,242,1)';
            textColor = 'rgba(163,169,183,1)';
        } else if (item.origin === 1) {
            // 新建
            state = 2;
            backgroundColor = 'rgba(92,153,255,0.2)';
            textColor = '#2C3F53';
        } else if (item.origin === 2) {
            // 已存在
            state = 3;
            backgroundColor = 'rgba(66,202,196,0.1)';
            textColor = '#2C3F53';
        }
        // 艺人取项目时间，博主取上线时间
        let start = moment(item.projectStartDate).format('YYYY-MM-DD 00:00:00');
        let end = moment(item.projectEndDate).format('YYYY-MM-DD 23:59:59');
        if (talentType === 1) {
            const timeType = (onlineDatePlan ? 'onlineDatePlan' : '') || (onlineDate ? 'onlineDate' : '');
            const time = item[timeType];
            start = moment(time).format('YYYY-MM-DD 00:00:00');
            end = moment(time).format('YYYY-MM-DD 23:59:59');
        }
        return {
            id: item.id,
            title: item.projectRemark,
            start,
            end,
            resourceId: item.talentId,
            backgroundColor,
            textColor,
            extendedProps: {
                ...item,
                state,
            },
        };
    });
};
