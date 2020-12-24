import { IS_OR_NOT } from '@/utils/enum';

const changePlatformOrder = (obj, value) => {
    // 修改平台下单清空下单平台
    const temp = {
        trailPlatformOrder: value,
        trailOrderPlatformId: undefined,
        trailOrderPlatformName: undefined,
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
        componentAttr: {
            allowClear: true,
            onChange: changePlatformOrder.bind(this, obj),
        },
        placeholder: '请选择',
        type: 'select',
        options: IS_OR_NOT,
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
