import { getCustomerList } from '@/services/globalSearchApi';

const renderTrailSigningCompanyName = () => {
    return {
        label: '签约公司',
        key: 'trailSigningCompanyId',
        placeholder: '请输入签约公司',
        componentAttr: {
            request: (val) => {
                // 签约公司选择直客
                return getCustomerList({
                    customerTypeIdList: [0, 2],
                    customerName: val || '',
                });
            },
            allowClear: true,
            fieldNames: { value: 'id', label: 'customerName' },
            initDataType: 'onfocus',
        },
        type: 'associationSearch',
        getFormat: (value, form) => {
            form.trailSigningCompanyName = value.label;
            form.trailSigningCompanyId = Number(value.value);
            return form;
        },
        setFormat: (value, form) => {
            if (value.label || value.value || value.value === 0) {
                return value;
            }
            return { label: form.trailSigningCompanyName, value: form.trailSigningCompanyId };
        },
    };
};
export default renderTrailSigningCompanyName;
