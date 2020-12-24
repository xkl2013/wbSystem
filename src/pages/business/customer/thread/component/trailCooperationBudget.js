// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder } = obj.formData;
    // 普通单、平台单必填
    if (Number(trailPlatformOrder) === 0 || Number(trailPlatformOrder) === 1) {
        return true;
    }
    // 默认非必填
    return false;
};
// 获取提示语
const getPlaceholder = (obj) => {
    const { trailPlatformOrder } = obj.formData;
    // 长期项目
    if (Number(trailPlatformOrder) === 2) {
        return '若确定签单额请填写';
    }
    // CPS项目
    if (Number(trailPlatformOrder) === 3) {
        return '若存在保底金额请填写';
    }
    // 默认
    return '请输入预估签单额';
};
const renderTrailCooperationBudget = (obj) => {
    return {
        label: '预估签单额',
        key: 'trailCooperationBudget',
        checkOption: {
            rules: [
                {
                    required: getRequired(obj),
                    message: '预估签单额不能为空',
                },
            ],
        },
        placeholder: getPlaceholder(obj),
        type: 'inputNumber',
        componentAttr: {
            precision: 2,
            min: 0,
            max: 9999999999.99,
        },
    };
};
export default renderTrailCooperationBudget;
