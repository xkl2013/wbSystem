import { Base64 } from 'js-base64';
import { formateMenu, getBreadcrumbNameMap, transformTree } from '@/utils/menu';
import { getDashboardPanels } from '@/pages/workbench/services';

/*
 * 此方法用于请求工作台项目列表数据
 */

export default {
    namespace: 'menu',

    state: {
        menuData: [],
        projectMenuData: [],
        breadcrumbNameMap: {},
    },

    effects: {
        * getMenu({ payload }, { put }) {
            const { routes, authData } = payload;
            const originalMenuData = formateMenu(routes);
            const breadcrumbNameMap = getBreadcrumbNameMap(originalMenuData);
            // 将扁平数据转成树状结构
            const treeData = transformTree(authData, breadcrumbNameMap);
            const menuObj = treeData.find((item) => {
                return item;
            }) || {};
            const authignoreList = Object.keys(breadcrumbNameMap).filter((ls) => {
                return breadcrumbNameMap[ls].authignore;
            });
            yield put({
                type: 'saveMenu',
                payload: { menuData: menuObj.children || [], breadcrumbNameMap, authignoreList },
            });
        },
        /*
         * 此方法用于请求工作台项目列表数据
         */
        * getProjectTask(_, { put }) {
            let projectMenuData = [];
            const result = yield getDashboardPanels();
            if (result && result.success) {
                projectMenuData = Array.isArray(result.data) ? result.data : [];
                projectMenuData = projectMenuData
                    .map((ls) => {
                        return {
                            ...ls,
                            id: Base64.encode(`${ls.projectId}`),
                            name: ls.projectName,
                        };
                    })
                    .sort((a, b) => {
                        return a.sortNo - b.sortNo;
                    });
            }
            yield put({
                type: 'saveProjectMenuData',
                payload: {
                    projectMenuData,
                },
            });
        },
    },

    reducers: {
        saveMenu(state, { payload }) {
            return { ...state, ...payload };
        },
        saveProjectMenuData(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
