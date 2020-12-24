import React from 'react';
import storage from '@/utils/storage';
import { ROLE_SOP } from '@/utils/constants';
import SelfTable from './selfTable';

// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder } = obj.formData;
    // 非长期项目必填
    if (Number(trailPlatformOrder) !== 2) {
        return true;
    }
    // 默认非必填
    return false;
};
// 获取不可编辑状态
const getDisabled = (obj, from) => {
    const myself = storage.getUserInfo();
    // 没有数据时，默认可编辑
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder } = obj.formData;
    // 项目编辑时只有sop组可以编辑
    if (from === 'manage') {
        if (Number(trailPlatformOrder) === 2) {
            return false;
        }
        if (Number(myself.roleId) === ROLE_SOP) {
            return false;
        }
        return true;
    }
    // 默认可编辑
    return false;
};
const BUDGETS = [
    'makeupCost',
    'makeupCostType',
    'intermediaryCost',
    'intermediaryCostType',
    'tripCost',
    'tripCostType',
    'otherCost',
    'otherCostType',
    'invitationCost',
    'invitationCostType',
    'makeCost',
    'makeCostType',
];
// 更改艺人费用条目
const changeBudgets = (obj, values) => {
    const form = obj.form.props.form.getFieldsValue();
    const arr = [];
    // 保留线索自带原始数据
    if (values.projectBudgets) {
        values.projectBudgets.map((item) => {
            let temp = item;
            if (Array.isArray(form.projectBudgets)) {
                temp = form.projectBudgets.find((one) => {
                    return (
                        String(one.talentId) === String(item.talentId)
                        && String(one.talentType) === String(item.talentType)
                    );
                });
                if (!temp) {
                    temp = item;
                }
            }
            arr.push(temp);
        });
    }
    const newData = {};
    newData.projectBudgets = arr;
    obj.changeSelfForm(newData);
};
const renderProjectingBudgetInfo = (obj, { from }) => {
    const { yearFrameType } = obj.formData;
    const noEdit = Number(yearFrameType) === 1 || Number(yearFrameType) === 2;
    return {
        key: 'projectBudgets',
        type: 'custom',
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
        // 可编辑，没有新增
        component: (
            <SelfTable
                onChange={changeBudgets.bind(this, obj)}
                editable={!getDisabled(obj, from)}
                noBtn={true}
                formData={obj.formData}
            />
        ),
        checkOption: {
            validateTrigger: 'onSubmit',
            validateFirst: true,
            rules: [
                {
                    required: getRequired(obj),
                    message: '请选择艺人/博主',
                },
                {
                    validator: (rule, value, callback) => {
                        if (!value || value.length === 0) {
                            callback();
                            return;
                        }
                        for (let i = 0; i < value.length; i += 1) {
                            const item = value[i];
                            for (let j = 0; j < BUDGETS.length; j += 1) {
                                if (
                                    (BUDGETS[j] === 'intermediaryCost' || BUDGETS[j] === 'intermediaryCostType')
                                    && noEdit
                                ) {
                                    console.log('intermediaryCost,intermediaryCostType noNeed');
                                } else if (!item[BUDGETS[j]] && item[BUDGETS[j]] !== 0) {
                                    callback(rule.message);
                                    return;
                                }
                            }
                        }
                        callback();
                    },
                    message: '项目预算信息填写不完整',
                },
            ],
        },
        getFormat: (value, form) => {
            const arr = [];
            value.map((item) => {
                Object.keys(item).map((one) => {
                    if (BUDGETS.includes(one)) {
                        item[one] = Number(item[one]);
                    }
                });
                arr.push(item);
            });
            form.projectBudgets = arr;
            return form;
        },
        setFormat: (value) => {
            const arr = [];
            value.map((item) => {
                if (item.trailTalentId) {
                    arr.push({
                        talentId: item.trailTalentId,
                        talentName: item.trailTalentName,
                        talentType: item.trailTalentType,
                    });
                } else {
                    arr.push(item);
                }
            });
            return arr;
        },
    };
};
export default renderProjectingBudgetInfo;
