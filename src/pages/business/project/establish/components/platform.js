import { getCustomePlatForm } from '../services';

// 修改下单平台
const changeOrderPlatform = async (obj, value) => {
    const trailOrderPlatformId = value.target.value;
    const temp = {
        trailOrderPlatformId,
    };
    // 平台代理公司-》项目代理公司
    const response = await getCustomePlatForm(trailOrderPlatformId);
    if (response && response.success && response.data) {
        const data = response.data || {};
        // 平台单默认公司类型为代理
        temp.projectingCustomerType = '1';
        temp.projectingCompanyName = data.customerName;
        temp.projectingCompanyId = data.id;
        if (Number(trailOrderPlatformId) === 1) {
            // 抖音星图默认下单方式为星图任务ID
            temp.projectingOrderType = '1';
        } else {
            temp.projectingOrderType = undefined;
        }
        obj.changeSelfForm(temp);
    }
};
const getDisabled = ({ from }) => {
    if (from === 'manage') {
        // 项目编辑时不能修改下单平台
        return true;
    }
    return false;
};
const renderTrailOrderPlatformId = (obj, { from }) => {
    const { trailPlatformOrder, platformData } = obj.formData;
    return (
        Number(trailPlatformOrder) === 1 && {
            label: '下单平台',
            key: 'trailOrderPlatformId',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择下单平台',
                    },
                ],
            },
            placeholder: '请选择',
            type: 'radio',
            options: platformData,
            componentAttr: {
                disabled: getDisabled({ obj, from }),
                onChange: changeOrderPlatform.bind(this, obj),
            },
            getFormat: (value, form) => {
                form.trailOrderPlatformId = Number(value);
                return form;
            },
        }
    );
};
export default renderTrailOrderPlatformId;
