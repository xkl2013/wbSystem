import { leadingCadreType, participantType, noticeType, createType } from '../../_enum';
// 可输入最大任务名称
export const maxScheduleNameLength = 300;
// 可输入最大描述
export const maxScheduleDescription = 1000;
export const handleMembers = (data) => {
    if (!Array.isArray(data)) return;
    const leadingCadreList = [];
    const participantList = [];
    const noticeList = [];
    const createList = [];
    data.forEach((el) => {
        switch (el.memberType) {
            case leadingCadreType:
                leadingCadreList.push(el);
                break;
            case participantType:
                participantList.push(el);
                break;
            case noticeType:
                noticeList.push(el);
                break;
            case createType:
                createList.push(el);
                break;
            default:
                break;
        }
    });
    return { leadingCadreList, participantList, noticeList, createList };
};
export const changeMembers = (val, type, scheduleMemberList = []) => {
    const memberWrap = handleMembers(scheduleMemberList);
    switch (type) {
        case leadingCadreType:
            memberWrap.leadingCadreList = val || [];
            break;
        case participantType:
            memberWrap.participantList = val || [];
            break;
        case noticeType:
            memberWrap.noticeList = val || [];
            break;
        case createType:
            memberWrap.createList = val || [];
            break;
        default:
            break;
    }
    let arr = [];
    Object.values(memberWrap).map((ls) => {
        arr = arr.concat([], Array.isArray(ls) ? ls : []);
    });
    return arr;
};
/*
 * 提交是处理的副作用
 * 1.在scheduleMemberList字段为成员添加scheduleId
 *
 */
export const submitEffects = (params = {}) => {
    const { id } = params;
    const newParams = {};
    Object.keys(params).forEach((key) => {
        let value = params[key];
        switch (key) {
            case 'scheduleMemberList':
                value = Array.isArray(value)
                    ? value.map((ls) => {
                        return { ...ls, scheduleId: id };
                    })
                    : [];
                break;
            default:
                value = params[key];
                break;
        }
        newParams[key] = value;
    });
    return newParams;
};

export default { handleMembers };
