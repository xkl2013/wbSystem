import { COMPANY_TYPE } from '@/utils/enum';
// 获取不可编辑状态
const getDisabled = (obj) => {
    // 没有数据时，默认可编辑
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder } = obj.formData;
    // 平台下单不允许编辑
    if (Number(trailPlatformOrder) === 1) {
        return true;
    }
    // 默认可编辑
    return false;
};
// 修改公司类型时，清空公司名称
const changeCustomerType = (obj, value) => {
    obj.changeSelfForm({
        trailCustomerType: value,
        trailCompanyName: undefined,
        trailCustomerName: undefined,
    });
};
const renderTrailCustomerType = (obj) => {
    return {
        label: '公司类型',
        key: 'trailCustomerType',
        placeholder: '请选择',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择公司类型',
                },
            ],
        },
        componentAttr: {
            disabled: getDisabled(obj),
            onChange: changeCustomerType.bind(this, obj),
        },
        type: 'select',
        options: COMPANY_TYPE,
        getFormat: (value, form) => {
            form.trailCustomerType = Number(value);
            return form;
        },
        setFormat: (value) => {
            return String(value);
        },
    };
};
export default renderTrailCustomerType;
