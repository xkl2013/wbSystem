import storage from '@/utils/storage';
import { ROLE_SOP } from '@/utils/constants';

// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder } = obj.formData;
    // 除长期、cps外必填
    if (Number(trailPlatformOrder) !== 2 && Number(trailPlatformOrder) !== 3) {
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
    // 项目编辑时只有sop组可以编辑
    if (from === 'manage') {
        if (Number(myself.roleId) === ROLE_SOP) {
            return false;
        }
        return true;
    }
    // 默认可编辑
    return false;
};
function changeProjectingBudget(obj, values) {
    obj.changeSelfForm({ projectingBudget: values });
}
const renderProjectingBudget = (obj, { from }) => {
    return {
        label: '签单额',
        key: 'projectingBudget',
        checkOption: {
            rules: [
                {
                    required: getRequired(obj),
                    message: '请输入签单额',
                },
            ],
        },
        placeholder: '请输入',
        type: 'inputNumber',
        componentAttr: {
            precision: 2,
            min: 0,
            max: 9999999999.99,
            onChange: changeProjectingBudget.bind(this, obj),
            disabled: getDisabled(obj, from),
        },
    };
};
export default renderProjectingBudget;
