/* eslint-disable */
import { checkPathname } from '@/components/AuthButton';
import storage from '@/utils/storage';

export function formateMenu(data) {
    if (!data) {
        return undefined;
    }
    return data
        .map((item) => {
            const result = {
                ...item,
                tagGroup: Array.isArray(item.tagGroup)
                    ? item.tagGroup.filter((ls) => {
                          return checkPathname(ls.path);
                      })
                    : [],
            };
            if (item.routes) {
                const children = formateMenu(item.routes);
                result.children = children;
            }
            delete result.routes;
            return result;
        })
        .filter((item) => {
            return (item && item.path && checkPathname(item.path)) || item.authignore;
        });
}
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
export const getBreadcrumbNameMap = (menuData) => {
    if (!menuData) {
        return {};
    }
    const routerMap = {};
    const authData = storage.getUserAuth() || [];
    const flattenMenuData = (data) => {
        data.forEach((menuItem) => {
            if (menuItem.children) {
                flattenMenuData(menuItem.children);
            }
            // Reduce memory usage
            routerMap[menuItem.path] = {
                ...authData.find((ls) => {
                    return ls.menuPath === menuItem.path;
                }),
                ...menuItem,
            };
        });
    };
    flattenMenuData(menuData);
    return routerMap;
};
export const findFirstAuthPath = (routeData) => {
    const firstModel =
        routeData.find((item) => {
            return item;
        }) || {};
    if (firstModel.children && firstModel.children.length > 0 && !firstModel.isLeaf) {
        return findFirstAuthPath(firstModel.children);
    }
    return firstModel;
};

/*
 * 此方法用于将扁平权限集合转成树状菜单兰
 * @params(list)
 * @return(newData)
 */

export function transformTree(authData, originData) {
    const tree = [];
    // 过滤掉功能按钮权限,只保留菜单权限
    const list = authData.filter((item) => {
        return item.menuPath && (item.menuType < 100 || item.menuType === 101);
    });
    for (let i = 0, len = list.length; i < len; i++) {
        if (!list[i].menuPid || list[i].menuPid === 1) {
            let item = queryChildren(list[i], list, originData);
            const obj = originData[item.menuPath];
            if (!obj) continue;
            item = { ...(obj || {}), ...item, path: item.menuPath };
            // if(item.tagGroup&&item.tagGroup.length){
            //     item.tagGroup=item.tagGroup.filter(ls=>authData.find(auth=>auth.))
            // }
            tree.push(item);
        }
    }
    return tree;
}

function queryChildren(parent, list, originData) {
    const children = [];
    for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].menuPid === parent.menuId) {
            let item = queryChildren(list[i], list, originData);
            const obj = originData[item.menuPath];
            if (!obj) continue;
            item = { ...(obj || {}), ...item, path: item.menuPath };
            const tagGroup = Array.isArray(item.tagGroup) ? item.tagGroup : [];
            item.tagGroup = tagGroup
                .map((ls) => {
                    const currentObj =
                        list.find((item) => {
                            return item.menuPath === ls.path;
                        }) || {};
                    return {
                        ...ls,
                        ...currentObj,
                    };
                })
                .sort((a, b) => {
                    return a.menuSortNumber - b.menuSortNumber;
                });
            children.push(item);
        }
    }
    if (children.length) {
        parent.children = children.sort((a, b) => {
            return a.menuSortNumber - b.menuSortNumber;
        });
    }

    return parent;
}
