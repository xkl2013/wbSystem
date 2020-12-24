import { getCustomerBusiness } from '@/services/globalSearchApi';

// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { projectingType, trailPlatformOrder, projectingCustomerType } = obj.formData;
    // 商务非平台单必填
    if (Number(projectingType) === 1 && Number(trailPlatformOrder) !== 1) {
        return true;
    }
    // 直客类型必填
    if (Number(projectingCustomerType) === 0) {
        return true;
    }
    // 默认非必填
    return false;
};
// 修改品牌
const changeBrand = (obj, value) => {
    const data = {
        brandId: value && value.value,
        brandName: value && value.label,
    };
    const { projectingType, projectingCustomerType } = obj.formData;
    // 影踪且直客类型时，修改品牌时不需清空直客公司，其他情况需清空
    if (!(Number(projectingType) !== 1 && Number(projectingCustomerType) === 0)) {
        data.projectingCustomerName = undefined;
        data.projectingCustomerId = undefined;
    }
    obj.changeSelfForm(data);
};
const renderBrandName = (obj) => {
    return {
        label: '品牌',
        key: 'brandName',
        placeholder: '请输入',
        checkOption: {
            rules: [
                {
                    required: getRequired(obj),
                    message: '请选择品牌',
                },
            ],
        },
        type: 'associationSearch',
        componentAttr: {
            allowClear: true,
            request: (val) => {
                return getCustomerBusiness({ pageNum: 1, pageSize: 50, businessName: val || '' });
            },
            fieldNames: { value: 'id', label: 'businessName' },
            onChange: changeBrand.bind(this, obj),
            initDataType: 'onfocus',
        },
        getFormat: (value, form) => {
            form.brandId = value.value;
            form.brandName = value.label;
            return form;
        },
        setFormat: (value, form) => {
            if (value.label || value.value || value.value === 0) {
                return value;
            }
            return { label: form.brandName, value: form.brandId };
        },
    };
};
export default renderBrandName;
