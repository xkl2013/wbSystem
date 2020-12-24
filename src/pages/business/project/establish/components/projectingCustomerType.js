import { COMPANY_TYPE } from '@/utils/enum';
// 获取不可编辑状态
const getDisabled = (obj, from) => {
    // 没有数据时，默认可编辑
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder } = obj.formData;
    // 平台单不允许编辑||项目管理中只有编辑，编辑时不允许修改公司类型
    if (Number(trailPlatformOrder) === 1 || from === 'manage') {
        return true;
    }
    // 默认可编辑
    return false;
};
// 修改公司类型时，清空公司名称和品牌信息
const changeCustomerType = (obj, value) => {
    obj.changeSelfForm({
        projectingCustomerType: value,
        projectingCompanyId: undefined,
        projectingCompanyName: undefined,
        projectingCustomerId: undefined,
        projectingCustomerName: undefined,
    });
};
const renderProjectingCustomerType = (obj, { from }) => {
    return {
        label: '公司类型',
        key: 'projectingCustomerType',
        placeholder: '请选择',
        type: 'select',
        options: COMPANY_TYPE,
        disabled: getDisabled(obj, from),
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择公司类型',
                },
            ],
        },
        componentAttr: {
            onChange: changeCustomerType.bind(this, obj),
        },
        getFormat: (value, form) => {
            form.projectingCustomerType = Number(value);
            return form;
        },
        setFormat: (value) => {
            return String(value);
        },
    };
};
export default renderProjectingCustomerType;
