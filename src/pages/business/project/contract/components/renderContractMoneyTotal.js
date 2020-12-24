// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder } = obj.formData;
    // 除长期、cps必填
    if (!(Number(trailPlatformOrder) === 2 || Number(trailPlatformOrder) === 3)) {
        return true;
    }
    // 默认非必填
    return false;
};
// 修改合同总金额
const changeTotalAmount = (obj, values) => {
    const { contractMoneyCompany } = obj.formData;
    if (contractMoneyCompany > values) {
        obj.changeSelfForm({ contractMoneyTotal: values, contractMoneyCompany: values });
    } else {
        obj.changeSelfForm({ contractMoneyTotal: values });
    }
};
const renderContractMoneyTotal = (obj) => {
    return {
        label: '合同总金额',
        key: 'contractMoneyTotal',
        checkOption: {
            rules: [
                {
                    required: getRequired(obj),
                    message: '请输入合同总金额',
                },
            ],
        },
        type: 'inputNumber',
        placeholder: '请输入',
        componentAttr: {
            precision: 2,
            min: 0,
            max: 1000000000000,
            onChange: changeTotalAmount.bind(this, obj),
        },
    };
};
export default renderContractMoneyTotal;
