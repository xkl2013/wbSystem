// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailCustomerType } = obj.formData;
    // 直客类型直客公司必填
    if (Number(trailCustomerType) === 0) {
        return true;
    }
    // 默认非必填
    return false;
};
const renderTrailCustomerName = (obj) => {
    return {
        label: '直客公司名称',
        key: 'trailCustomerName',
        checkOption: {
            rules: [
                {
                    required: getRequired(obj),
                    message: '请输入直客公司名称',
                },
            ],
        },
        placeholder: '请输入',
        componentAttr: {
            maxLength: 50,
        },
    };
};
export default renderTrailCustomerName;
