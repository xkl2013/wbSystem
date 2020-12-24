import storage from '@/utils/storage';
import avatar1 from '@/assets/avatar.png';
import { calendarType, leadingCadreType, privatePublicFlag } from '../../../_enum';

export const initCalendar = () => {
    const { userId, userName, avatar } = storage.getUserInfo();
    return {
        type: calendarType,
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
        scheduleType: '0',
        scheduleNoticeList: [
            {
                timeIntervalFlag: 1,
                noticeName: '不提醒',
                noticeType: 0,
            },
        ],
        privateFlag: privatePublicFlag,
        finishFlag: 0,
        schedulePriority: 1, // 优先级默认是普通
    };
};
export default {
    initCalendar,
};
