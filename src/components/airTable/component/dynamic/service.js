import request from '@/utils/request';

// 立项列表
export async function getOpUserList(data) {
    return request('/comments/user/list', { prefix: '/crmApi', method: 'post', data });
}
export default {
    getOpUserList,
};
