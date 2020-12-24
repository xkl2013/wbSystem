// 设置成用户看板数据列表
export const setFormateUsers = (data = []) => {
    return data.map((item) => {
        return {
            ...item,
            avatar: item.memberAvatar,
            name: item.memberName,
            id: item.memberId,
        };
    });
};
// 设置接口需要的出局
export const getFormateUsers = (value = [], memberType) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        return {
            memberAvatar: item.avatar,
            userId: Number(item.id),
            userName: item.name,
            memberType,
            memberId: Number(item.id),
            memberName: item.name,
        };
    });
};
