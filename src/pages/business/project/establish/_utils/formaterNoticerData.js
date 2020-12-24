/*
 * 此方法用于处理从form信息中获取只会人信息,根据需求需要从立项审批中获取负责人,执行人,参与人项目关联艺人经理人,项目关联博主自作人
 */

/*
 *@params formData
 *@return noticers集合
 */
export const formaterNoticersData = ({ formData, instanceName }) => {
    //cooperateUserId
    const projectingHeaders = projectingHeadersFormater(formData, instanceName) || []; //   负责人;
    const projectingUserList = projectingUserListFormater(formData, instanceName) || []; //   执行人;
    const projectingUsers = projectingUsersFormater(formData, instanceName) || []; //   参与人;
    const cooperateUserIds = cooperateUserIdFormater(formData, instanceName) || []     // 合作人
    return [...projectingHeaders, ...projectingUserList, ...projectingUsers, ...cooperateUserIds];
};
/*
 *@params formData
 *@return 负责人集合
 */
export const projectingHeadersFormater = (data, instanceName) => {
    if (!data.projectingHeaderName) return [];
    if (typeof data.projectingHeaderName === 'string') {
        return [{
            id: data.projectingHeaderId || data.label,
            name: data.projectingHeaderName || data.label,
            type: 'user',
            key: 'projectingHeaders',
            keyName: '负责人',
        }]
    }
    if (typeof data.projectingHeaderName === 'object') {
        const obj = data.projectingHeaderName || {};
        return [
            {
                id: obj.userId || obj.value,
                name: obj.userChsName || obj.label,
                type: 'user',
                key: 'projectingHeaders',
                keyName: '负责人',
            },
        ];
    }

};

/*
 *@params formData
 *@return 执行人集合
 */
export const projectingUserListFormater = (data, instanceName) => {
    if (!Array.isArray(data.projectingUserList)) return [];
    const projectingUserList = data.projectingUserList;
    return projectingUserList.map(item => {
        const reTrailId = instanceName === 'trail' ? item.trailParticipantId : null;
        const reTrailName = instanceName === 'trail' ? item.trailParticipantName : null;
        const reProjectingId = instanceName === 'projecting' ? item.projectingParticipantId : null;
        const reProjectingName = instanceName === 'projecting' ? item.projectingParticipantName : null;
        return {
            id: item.userId || item.value || reTrailId || reProjectingId,
            name: item.userChsName || item.label || reTrailName || reProjectingName,
            type: 'user',
            key: 'projectingUserList',
            keyName: '执行人',
        }
    });
};

/*
 *@params formData
 *@return 参与人人集合
 */
export const projectingUsersFormater = (data, instanceName) => {
    if (!Array.isArray(data.projectingUsers)) return [];
    const projectingUsers = data.projectingUsers;
    return projectingUsers.map(item => {
        const reTrailId = instanceName === 'trail' ? item.trailParticipantId : null;
        const reTrailName = instanceName === 'trail' ? item.trailParticipantName : null;
        const reProjectingId = instanceName === 'projecting' ? item.projectingParticipantId : null;
        const reProjectingName = instanceName === 'projecting' ? item.projectingParticipantName : null;
        return {
            id: item.userId || item.value || reTrailId || reProjectingId,
            name: item.userChsName || item.label || reTrailName || reProjectingName,
            type: 'user',
            key: 'projectingUser',
            keyName: '参与人',
        }
    });
};
/*
 *@params formData
 *@return 合作人人集合
 */
export const cooperateUserIdFormater = (data, instanceName) => {
    if (!data.cooperateUserId || String(data.cooperate) === '0') return [];
    const cooperateUserId = data.cooperateUserId;

    const reTrailId = instanceName === 'trail' ? data.cooperateUserId : null;
    const reTrailName = instanceName === 'trail' ? data.cooperateUserName : null;
    const reProjectingId = instanceName === 'projecting' ? data.cooperateUserId : null;
    const reProjectingName = instanceName === 'projecting' ? data.cooperateUserName : null;
    return [{
        id: cooperateUserId.cooperateUserId || cooperateUserId.value || reTrailId || reProjectingId,
        name: cooperateUserId.cooperateUserName || cooperateUserId.label || reTrailName || reProjectingName,
        type: 'user',
        key: 'projectingUser',
        keyName: '参与人',
    }].filter(ls => ls.id)
};