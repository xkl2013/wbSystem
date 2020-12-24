import storage from '@/submodule/utils/storage';





export function checkPathname(authority) {
    // const authignoreData = checkAuthignore() || [];
    const list = storage.getUserAuth() || [];
    const menuKey = list.findIndex((item) => {
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
