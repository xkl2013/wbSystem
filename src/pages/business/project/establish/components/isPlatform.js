import { PROJECT_PLATFORM_TYPE } from '@/utils/enum';

// TODO：修改商务三级分类
const changePlatformOrder = (obj, value) => {
    // 修改三级分类清空下单平台、下单方式、星图ID
    const temp = {
        trailPlatformOrder: value,
        trailOrderPlatformId: undefined,
        projectingOrderType: undefined,
        projectingOrderNumber: undefined,
        projectingCustomerType: undefined,
    };
    obj.changeSelfForm(temp);
};
const renderTrailPlatformOrder = (obj) => {
    return {
        label: '平台下单',
        key: 'trailPlatformOrder',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择平台下单',
                },
            ],
        },
        placeholder: '请选择',
        type: 'select',
        componentAttr: {
            onChange: changePlatformOrder.bind(this, obj),
        },
        options: PROJECT_PLATFORM_TYPE,
        getFormat: (value, form) => {
            form.trailPlatformOrder = Number(value);
            return form;
        },
        setFormat: (value) => {
            return String(value);
        },
    };
};
export default renderTrailPlatformOrder;
