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
            name: item.userChsName,
        }));
        users = [...users, ...newArr];
        if (obj.subDepartmentList && obj.subDepartmentList.length > 0) {
            users = [...users, ...getAllUaers(obj.subDepartmentList)];
        }
    }
    return users;
};
