export const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.id === key)) {
                parentKey = node.id;
            }
            else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};
let allNodes = [];
export const handleUserData = (data) => {
    return formateAllData(data);
};
export const getAllUaers = (data = []) => {
    let users = [];
    if (!data || data.length === 0)
        return;
    for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        let newArr = Array.isArray(obj.userList) ? obj.userList : [];
        newArr = newArr.map((item) => ({
            ...item,
            id: String(item.userId),
            name: item.userChsName || '',
        }));
        users = [...users, ...newArr];
        if (obj.subDepartmentList && obj.subDepartmentList.length > 0) {
            users = [...users, ...getAllUaers(obj.subDepartmentList)];
        }
    }
    return users;
};
export const formateAllData = (data) => {
    let users = [];
    if (!data || data.length === 0)
        return;
    for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        obj.id = obj.departmentId;
        obj.symbol = 'org';
        let newArr = Array.isArray(obj.allSubLoginUserList) ? obj.allSubLoginUserList : [];
        newArr = newArr.map((item) => ({
            ...item,
            id: item.userId,
            children: [],
            symbol: 'user',
            avatar: item.userIcon,
        }));
        obj.children = [...newArr];
        allNodes = [...allNodes, ...newArr];
        if (obj.subDepartmentList && obj.subDepartmentList.length > 0) {
            obj.children = [...formateAllData(obj.subDepartmentList), ...obj.children];
            allNodes = [...allNodes, ...obj.children];
        }
        users.push(obj);
    }
    return users;
};
export const checkoutChildren = (data) => {
    let users = [];
    if (!data || data.length === 0)
        return;
    for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        if (obj.symbol === 'user') {
            users.push(obj);
        }
        if (obj.children && obj.children.length > 0) {
            users = [...users, ...checkoutChildren(obj.children)];
        }
    }
    return users;
};
export const checkoutParentNode = (data = []) => {
    let returnData = [];
    data.forEach((item) => {
        const parent = item.parent || item;
        if (!returnData.some((ls) => ls.id === parent.id)) {
            const newArr = [...parent.children, parent];
            returnData = returnData.concat([], newArr);
        }
    });
    return returnData;
};
export const defaultConfig = {
    user: {
        avatar: 'https://static.mttop.cn/admin/avatar.png',
    },
    org: {
        avatar: 'https://static.mttop.cn/org-icon.png',
    },
    role: {
        avatar: 'https://static.mttop.cn/admin/avatar.png',
    },
    department: {
        avatar: 'https://static.mttop.cn/admin/avatar.png',
    },
    get: function (type) {
        return this[type] || this['user'];
    }
};
