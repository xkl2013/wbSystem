import { getCustomePlatForm } from '../services';
// 修改下单平台
const changeOrderPlatform = async (obj, value) => {
    const trailOrderPlatformId = value.target.value;
    const temp = {
        trailOrderPlatformId,
    };
    // 下单平台查出公司类型
    const response = await getCustomePlatForm(trailOrderPlatformId);
    if (response && response.success && response.data) {
        const { customerTypeId } = response.data || {};
        temp.trailCustomerType = customerTypeId;
        // TODO:根据平台带出公司名称
        // temp.trailCustomerName = undefined;
        // temp.trailCompanyName = undefined;
        // if (Number(customerTypeId) === 0) {
        //     temp.trailCustomerName = customerName;
        // } else if (Number(customerTypeId) === 1) {
        //     temp.trailCompanyName = customerName;
        // }
        obj.changeSelfForm(temp);
    }
};
const renderTrailOrderPlatformId = (obj) => {
    const { trailPlatformOrder, platformData } = obj.formData;
    return (
        Number(trailPlatformOrder) === 1 && {
            label: '下单平台',
            key: 'trailOrderPlatformId',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择',
                    },
                ],
            },
            componentAttr: {
                allowClear: true,
                onChange: changeOrderPlatform.bind(this, obj),
            },
            placeholder: '请选择',
            type: 'radio',
            options: platformData || [],
            getFormat: (value, form) => {
                form.trailOrderPlatformId = Number(value);
                return form;
            },
            setFormat: (value) => {
                return value;
            },
        }
    );
};
export default renderTrailOrderPlatformId;
