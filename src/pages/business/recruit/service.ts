import request from '@/utils/request';

// 移动招募艺人信息（分组间移动）
export async function moveGroup(data) {
    return request('/talent/recruitment/group/move', { method: 'post', prefix: '/crmApi', data });
}

// 根据rowID 获取 tableID
export async function getRecruitmentTableId(rowId) {
    return request(`/talent/recruitment/get/table/${rowId}`, { prefix: '/crmApi' });
}


export default {
    moveGroup,
    getRecruitmentTableId,
};
