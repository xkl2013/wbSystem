import storage from '@/utils/storage';
import { ROLE_SOP } from '@/utils/constants';

// 验证用户为创建人或负责人或属于sop组
const checkUser = (formData, type = 'creator') => {
    const { projectingHeaderId, projectingCreatedId } = formData || {};
    const myself = storage.getUserInfo();
    if (typeof type !== 'string') {
        throw new Error('验证类型错误');
    }
    const checkTypeFunc = {
        // 创建人
        creator: () => {
            return String(projectingCreatedId) === String(myself.userId);
        },
        // 负责人
        header: () => {
            return String(projectingHeaderId) === String(myself.userId);
        },
        // sop角色
        sop: () => {
            return Number(myself.roleId) === ROLE_SOP;
        },
    };
    checkTypeFunc.C = checkTypeFunc.creator;
    checkTypeFunc.H = checkTypeFunc.header;
    if (!checkTypeFunc[type]) {
        throw new Error('验证类型错误');
    }
    return checkTypeFunc[type]();
};
// 项目编辑权限
export const checkEditAuthority = (formData) => {
    return checkUser(formData) || checkUser(formData, 'H') || checkUser(formData, 'sop');
};
// 项目结案权限
export const checkEndAuthority = (formData) => {
    const { endStatus } = formData || {};
    // 可结案
    return Number(endStatus) === 2;
};
// 终止项目权限
export const checkStopAuthority = (formData) => {
    const { projectingSignState, projectingState, trailPlatformOrder } = formData || {};
    // 未签约且未终止且非平台单且登录人为创建者
    return (
        Number(projectingSignState) === 0
        && Number(projectingState) !== -1
        && Number(trailPlatformOrder) !== 1
        && checkUser(formData)
    );
};
// 新增合同权限
export const checkAddContractAuthority = (formData) => {
    const { projectingSignState, projectingState, trailPlatformOrder, contractNum } = formData || {};
    // 未签约且未终止且非平台单且登录人为创建者且没有主合同
    return (
        Number(projectingSignState) === 0
        && Number(projectingState) !== -1
        && Number(trailPlatformOrder) !== 1
        && checkUser(formData)
        && !contractNum
    );
};
// 项目艺人博主分成编辑权限
export const checkEditDividesAuthority = (formData) => {
    return checkEditAuthority(formData);
};
// 项目详情编辑履约义务权限
export const checkEditAppointAuthority = (formData) => {
    return checkEditAuthority(formData);
};
// 项目详情编辑回款计划权限
export const checkEditReturnAuthority = (formData) => {
    return checkEditAuthority(formData);
};
// 项目详情编辑授权信息权限
export const checkEditAuthorizedAuthority = (formData) => {
    return checkEditAuthority(formData);
};

export default {
    checkEndAuthority,
    checkStopAuthority,
    checkAddContractAuthority,
    checkEditAuthority,
    checkEditDividesAuthority,
    checkEditAppointAuthority,
};
