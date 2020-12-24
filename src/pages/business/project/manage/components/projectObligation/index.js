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
export const renderProjectObligation = (obj, { from }) => {
    const { trailPlatformOrder, trailOrderPlatformId } = obj.formData;
    return (
        Number(trailPlatformOrder) === 1 && {
            title: '履约义务明细',
            fixed: true,
            columns: [
                [
                    {
                        key: 'projectAppointments',
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
                                {
                                    validator: (rule, value, callback) => {
                                        let result = false;
                                        if (obj && obj.formData.projectingTalentDivides) {
                                            for (let i = 0; i < obj.formData.projectingTalentDivides.length; i += 1) {
                                                const item = obj.formData.projectingTalentDivides[i];
                                                if (Number(item.divideAmountRate) > 0) {
                                                    const index = value.findIndex((temp) => {
                                                        return (
                                                            temp.projectAppointmentTalentId === item.talentId
                                                            && temp.projectAppointmentTalentType === item.talentType
                                                        );
                                                    });
                                                    if (index === -1) {
                                                        result = true;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        if (result) {
                                            callback('获得分成的艺人/博主必须要有履约义务');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        let flag = false;
                                        const result = {};
                                        for (let i = 0; i < value.length; i += 1) {
                                            const item = value[i];
                                            // eslint-disable-next-line max-len
                                            const key = `${item.projectAppointmentTalentId}_${item.projectAppointmentTalentType}`;
                                            if (result[key] !== undefined) {
                                                if (result[key] !== item.projectAppointmentBrand) {
                                                    flag = true;
                                                    break;
                                                }
                                            } else {
                                                result[key] = item.projectAppointmentBrand;
                                            }
                                        }
                                        if (flag) {
                                            callback('同一艺人/博主的品牌类型须唯一');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        componentAttr: {
                            border: true,
                            initForm: (record) => {
                                if (Number(trailPlatformOrder) === 1) {
                                    // 平台项目默认推广平台为下单平台
                                    record.projectPopularizePlatform = trailOrderPlatformId;
                                    record.hasShoppingCart = record.hasShoppingCart || '0';
                                }
                                if (Number(trailPlatformOrder) === 2) {
                                    // 长期项目默认执行进度类型为手动输入
                                    record.projectAppointmentProgressType = '1';
                                }
                                return record;
                            },
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
export default renderProjectObligation;
