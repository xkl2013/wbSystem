// import React from 'react';
import { columnsFn } from './selfTable';
import { formatSelfCols } from './selfForm';
import { checkEditAppointAuthority } from '../../config/authority';
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
    if (key === 'projectAppointments') {
        // 排序
        temp[key]
            .map((item) => {
                if (!item.no) {
                    item.no = value.length > 1 ? value[value.length - 2].no + 1 : value.length;
                }
                return item;
            })
            .sort((a, b) => {
                return a.no - b.no;
            });
        obj.changeSelfForm({
            projectAppointments: temp[key],
        });
    }
};
export const renderProjectExecute = (obj, { from }) => {
    const { trailPlatformOrder } = obj.formData;
    return (
        Number(trailPlatformOrder) === 0 && {
            title: '项目执行链接',
            fixed: true,
            columns: [
                [
                    {
                        key: 'projectAppointments',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            border: true,
                            tableCols: columnsFn.bind(this, { formData: obj.formData, from }),
                            formCols: formatSelfCols.bind(this, obj),
                            formKey: 'projectAppointments',
                            addBtnText: '添加',
                            editBtnText: '编辑',
                            changeParentForm: changeParentForm.bind(this, obj),
                            disabled: !checkEditAppointAuthority(obj.formData),
                        },
                    },
                ],
            ],
        }
    );
};
export default renderProjectExecute;
