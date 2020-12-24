// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder } = obj.formData;
    // 除长期、cps项目必填
    if (Number(trailPlatformOrder) !== 2 && Number(trailPlatformOrder) !== 3) {
        return true;
    }
    // 默认非必填
    return false;
};
// 修改公司总金额
const changeCompanyMoney = (obj, values) => {
    obj.changeSelfForm({ contractMoneyCompany: values });
};
const renderContractMoneyCompany = (obj) => {
    const { contractMoneyTotal } = obj.formData;
    return {
        label: '公司金额',
        key: 'contractMoneyCompany',
        checkOption: {
            rules: [
                {
                    required: getRequired(obj),
                    message: '请输入公司金额',
                },
                {
                    validator: (rule, value, callback) => {
                        if (value > contractMoneyTotal) {
                            callback('公司金额不能大于合同总金额');
                        } else {
                            callback();
                        }
                    },
                },
            ],
        },
        placeholder: '请输入',
        type: 'inputNumber',
        componentAttr: {
            precision: 2,
            min: 0,
            max: contractMoneyTotal || 1000000000000,
            onChange: changeCompanyMoney.bind(this, obj),
        },
    };
};
export default renderContractMoneyCompany;
