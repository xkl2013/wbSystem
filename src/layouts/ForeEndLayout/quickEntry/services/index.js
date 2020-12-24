import request from '@/utils/request';
// 获取动画路径(待废弃)
export async function getEnterPaths(roleId) {
    return request(`/enterPath/menuPath/${roleId}`, { method: 'get', prefix: '/nodeApi' });
}

// 快捷菜单列表
export async function getQuickGroupMenuList(data) {
    return request('/menus/quick/listByRole', { method: 'post', data });
}

// 检查当前用户是否拥有当前快捷菜单权限
export async function checkQuickMenu(data) {
    return request('/menus/quick/check', { method: 'post', data });
}

// 保存用户快捷菜单
export async function postSaveQuickMenu(data) {
    return request('/menus/quick', { method: 'post', data });
}

// 获取用户快捷菜单列表
export async function getUserQuickMenu(data) {
    return request('/menus/quick/listByUser', { method: 'post', data });
}

// export default {
//     getEnterPaths,
// };
