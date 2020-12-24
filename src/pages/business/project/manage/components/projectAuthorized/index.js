// import React from 'react';
import { columnsFn } from './selfTable';
import { formatSelfCols } from './selfForm';
// import storage from '@/utils/storage';
// import { ROLE_SOP } from '@/utils/constants';

// 获取不可编辑状态
// const getDisabled = (obj, from) => {
//     const myself = storage.getUserInfo();
//     // 没有数据时，默认可编辑
//     if (!obj || !obj.formData) {
//         return false;
//     }
//     // 项目编辑时只有sop组可以编辑
//     if (from === 'manage') {
//         if (Number(myself.roleId) === ROLE_SOP) {
//             return false;
//         }
//         return true;
//     }
//     // 默认可编辑
//     return false;
// };
// 修改父表单数据
const changeParentForm = async (obj, key, value) => {
    const temp = {};
    temp[key] = value;
    if (key === 'projectAuthorized') {
        obj.changeSelfForm({
            projectAuthorized: temp[key],
        });
    }
};
export const renderProjectAuthorized = (obj, { from }) => {
    return {
        title: '授权项目信息',
        fixed: true,
        columns: [
            [
                {
                    key: 'projectAuthorized',
                    type: 'formTable',
                    labelCol: { span: 0 },
                    wrapperCol: { span: 24 },
                    checkOption: {
                        validateFirst: true,
                        rules: [
                            {
                                required: true,
                                message: '履约义务明细信息填写不完整',
                            },
                        ],
                    },
                    componentAttr: {
                        border: true,
                        tableCols: columnsFn.bind(this, { formData: obj.formData, from }),
                        formCols: formatSelfCols.bind(this, obj),
                        formKey: 'projectAuthorized',
                        addBtnText: '添加',
                        editBtnText: '编辑',
                        changeParentForm: changeParentForm.bind(this, obj),
                    },
                },
            ],
        ],
    };
};
export default renderProjectAuthorized;
