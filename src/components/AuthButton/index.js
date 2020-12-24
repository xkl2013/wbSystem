import pathToRegexp from 'path-to-regexp';
import storage from '@/utils/storage';
import { routes } from '../../../config/routes';

function filterAuthignoreList(menuData) {
    const authignoreList = [];
    const flattenMenuData = (data) => {
        data.forEach((menuItem) => {
            if (menuItem.routes) {
                flattenMenuData(menuItem.routes);
            }
            if (menuItem.authignore) {
                authignoreList.push(menuItem);
            }
        });
    };
    flattenMenuData(menuData);
    return authignoreList;
}
const authignoreList = filterAuthignoreList(routes);
function checkAuthignore(pathname) {
    if (!authignoreList || !authignoreList.length) return false;
    return authignoreList.find((ls) => {
        return pathToRegexp(ls.path).test(pathname);
    });
}
export function checkPathname(authority) {
    // const authignoreData = checkAuthignore() || [];
    const list = storage.getUserAuth() || [];
    const menuKey = checkAuthignore(authority)
        || list.findIndex((item) => {
            return item.menuPath === `${authority}`;
        }) >= 0;
    // TODO:开发过程中暂时把权限关掉，发版时需开启
    if (process.env.NODE_ENV === 'development') {
        return true;
    }
    return !!menuKey;
}

/*
 * 控制按钮权限
 * 权限配置同菜单
 * */
function Index(props) {
    if (checkPathname(props.authority)) {
        return props.children;
    }
    return null;
}
export default Index;
Index.checkPathname = checkPathname;
