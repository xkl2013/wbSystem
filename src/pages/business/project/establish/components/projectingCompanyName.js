import { getCustomerList } from '@/services/globalSearchApi';
import { getYearFrame } from '@/pages/business/project/establish/services';

// 获取不可编辑状态
const getDisabled = (obj, from) => {
    // 没有数据时，默认可编辑
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder, yearFrameCustomerId, projectingCompanyId } = obj.formData;
    // 平台单不允许编辑
    if (Number(trailPlatformOrder) === 1) {
        return true;
    }
    if (from === 'establish') {
        return false;
    }
    // 关联年框时不可编辑
    return yearFrameCustomerId && Number(yearFrameCustomerId) === Number(projectingCompanyId);
};
const changeCompany = async (obj, value) => {
    const { trailPlatformOrder, realCustomerType } = obj.formData;
    const data = {
        projectingCompanyName: value,
    };
    // 平台单年框只受下单客户级联
    if (Number(trailPlatformOrder) === 1) {
        return obj.changeSelfForm(data);
    }
    let customerType = 1;
    if (Number(realCustomerType) === 2) {
        customerType = 2;
    }
    const res = await getYearFrame({
        customerId: Number(value.value),
        customerType,
    });
    if (res && res.success) {
        if (res.data && res.data.length > 0) {
            data.showYearFrame = true;
            data.yearFrameCustomerId = Number(value.value);
            data.yearFrameCustomerType = customerType;
        } else {
            data.showYearFrame = false;
            data.yearFrameCustomerId = undefined;
            data.yearFrameCustomerType = undefined;
        }
        data.yearFrameType = undefined;
        data.yearFrameId = undefined;
        data.yearFrameName = undefined;
    }
    obj.changeSelfForm(data);
};
const renderProjectingCompanyName = (obj) => {
    const { projectingCustomerType } = obj.formData;
    // 公司类型为代理时显示代理公司名称
    return (
        Number(projectingCustomerType) === 1 && {
            label: '代理公司名称',
            key: 'projectingCompanyName',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请输入代理公司名称',
                    },
                ],
            },
            type: 'associationSearch',
            componentAttr: {
                allowClear: true,
                request: (val) => {
                    const data = {
                        customerTypeIdList: [1, 2],
                        customerName: val || '',
                    };
                    return getCustomerList(data);
                },
                fieldNames: { value: 'id', label: 'customerName' },
                disabled: getDisabled(obj),
                initDataType: 'onfocus',
                onChange: changeCompany.bind(this, obj),
            },
            getFormat: (value, form) => {
                form.projectingCompanyId = value.value;
                form.projectingCompanyName = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return { label: form.projectingCompanyName, value: form.projectingCompanyId };
            },
        }
    );
};
export default renderProjectingCompanyName;
