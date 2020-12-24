import { PROJECT_ORDER_TYPE } from '@/utils/enum';

const changeType = (obj, value) => {
    // 修改下单方式后清空星图ID
    obj.changeSelfForm({
        projectingOrderType: value,
        projectingOrderNumber: undefined,
    });
};
const renderProjectingOrderType = (obj) => {
    const { trailPlatformOrder, trailOrderPlatformId } = obj.formData;
    return (
        Number(trailPlatformOrder) === 1
        && Number(trailOrderPlatformId) === 1 && {
            label: '下单方式',
            key: 'projectingOrderType',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择下单方式',
                    },
                ],
            },
            placeholder: '请选择',
            type: 'select',
            options: PROJECT_ORDER_TYPE,
            componentAttr: {
                onChange: changeType.bind(this, obj),
            },
            getFormat: (value, form) => {
                form.projectingOrderType = Number(value);
                return form;
            },
            setFormat: (value) => {
                return String(value);
            },
        }
    );
};
export default renderProjectingOrderType;
