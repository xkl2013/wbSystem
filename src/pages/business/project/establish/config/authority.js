import storage from '@/utils/storage';

// 立项重新提交权限
export const checkResubmitAuthority = (formData) => {
    const { projectingApprovalState = '', restartTimes = '' } = formData || {};
    const myself = storage.getUserInfo();
    // 审批状态=4|5|-1，且登录人为创建人，且没有重新提交过，显示重新提交按钮
    return (
        (Number(projectingApprovalState) === 4
            || Number(projectingApprovalState) === 5
            || Number(projectingApprovalState) === -1)
        && String(formData.projectingCreatedId) === String(myself.userId)
        && !restartTimes
    );
};
export default {
    checkResubmitAuthority,
};
