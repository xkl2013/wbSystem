export const formaterApprovalNodeList = (data) => {
    return (data || []).map(item => ({
        id: item.executorId,
        name: item.name,
        type: { 0: 'user', 1: 'department', 2: 'role' }[item.executorType],
        avatar: item.icon,
    }));
}
export const formaterNoticerList = (data) => {
    return (data || []).map(item => ({
        id: item.userId,
        name: item.userName,
        type: { 0: 'user', 2: 'role' }[item.userType],
        avatar: item.avatar,
    }));
}
export const setFormaterApprovalNodeList = (data) => {
    return (data || []).map(item => ({
        executorId: item.id,
        executorType: { user: 0, department: 1, role: 2 }[item.type],
        name: item.name,
        icon: item.avatar,
    }));
}
export const setFormaterNoticerList = (data) => {
    return (data || []).map(item => ({
        userId: item.id,
        userType: { user: 0, department: 1, role: 2 }[item.type],
        userName: item.name,
        avatar: item.avatar,
    }));
}
export const parseConditions = (val) => {
    if (Array.isArray(val)) return val
    if (typeof val !== 'string') return [];
    try {
        return JSON.parse(val);
    } catch (e) {
        console.warn(e);
    }
}
// 条件枚举
export const operators = [
    {
        id: 'OO_1',
        name: '小于',
        type: 'OO',
        value: '-,${var}',
        nodeCount: 1,
        formater: (val) => {
            if (!Array.isArray(val) || !val.length) return ''
            return `<${val[1]}`
        }
    },
    {
        id: 'OC_2',
        name: '小于等于',
        type: 'OC',
        value: '-,${var}',
        nodeCount: 1,
        formater: (val) => {
            if (!Array.isArray(val) || !val.length) return ''
            return `<=${val[1]}`
        }
    },
    {
        id: 'CC_3',
        name: '等于',
        type: 'CC',
        value: '${var},${var}',
        nodeCount: 1,
        formater: (val) => {
            if (!Array.isArray(val) || !val.length) return ''
            return `=${val[0]}`
        }
    },
    {
        id: 'OO_4',
        name: '大于',
        type: 'OO',
        value: '${var},+',
        nodeCount: 1,
        formater: (val) => {
            if (!Array.isArray(val) || !val.length) return ''
            return `>${val[0]}`
        }
    },
    {
        id: 'CO_5',
        name: '大于等于',
        type: 'CO',
        value: '${var},+',
        nodeCount: 1,
        formater: (val) => {
            if (!Array.isArray(val) || !val.length) return ''
            return `>=${val[0]}`
        }
    },
    {
        id: 'CC_6',
        name: '介于',
        type: 'CC',
        value: '${var},${var}',
        nodeCount: 2,
        formater: (val) => {
            if (!Array.isArray(val) || !val.length) return ''
            return `${val[0]}=< n <=${val[1]}`
        }
    },
    {
        id: 'CO_7',
        name: '介于(左闭右开)',
        type: 'CO',
        value: '${var},${var}',
        nodeCount: 2,
        formater: (val) => {
            if (!Array.isArray(val) || !val.length) return ''
            return `${val[0]}=< n <${val[1]}`
        }

    },
    {
        id: 'OC_8',
        name: '介于(左开右闭)',
        type: 'OC',
        value: '${var},${var}',
        nodeCount: 2,
        formater: (val) => {
            if (!Array.isArray(val) || !val.length) return ''
            return `${val[0]}< n <=${val[1]}`
        }
    },
    // {
    //     id: 'in_9',
    //     name: '包含',
    //     type: 'in',
    //     value: '${var},${var}',
    //     nodeCount: 1,
    //     formater: (val) => {
    //         if (!Array.isArray(val) || !val.length) return ''
    //         return `包含${val[0]}`
    //     }
    // },
    // {
    //     id: 'notin_10',
    //     name: '不包含',
    //     type: 'notin',
    //     value: '${var},${var}',
    //     nodeCount: 1,
    //     formater: (val) => {
    //         if (!Array.isArray(val) || !val.length) return ''
    //         return `不包含${val[0]}`
    //     }
    // }
];
export const defaultVar = {
    id: 'CC_3',
    name: '等于',
    type: 'CC',
}
/*
* 可设置变量的type
*/
export const conditionTypes = ['select', 'number'];

/*
*   每一个审批流都有一个默认变量,即为申请人所在的部门
*/
export const defaultVariables = [{
    approvalFormFields: null,
    conditonField: 0,
    fieldEmpty: 0,
    fieldMessage: "申请人所属部门",
    fieldSort: 4,
    id: 384,
    inspectRules: null,
    name: "apply_department",
    parentId: 0,
    purposeType: 0,
    title: "申请人所属部门",
    type: "department"
}];