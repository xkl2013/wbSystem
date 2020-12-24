import { PROJECT_AGENT_ORDER } from '@/utils/enum';

const changePlatformOrder = (obj, value) => {
    // 修改是否代下单需清空代下单项目
    const temp = {
        isAgentOrder: value,
        commonOrderId: undefined,
        commonOrderName: undefined,
    };
    obj.changeSelfForm(temp);
};
const renderProjectingIsAgentOrder = (obj, { from }) => {
    return {
        label: '下单类型',
        key: 'isAgentOrder',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择下单类型',
                },
            ],
        },
        placeholder: '请选择',
        type: 'select',
        componentAttr: {
            onChange: changePlatformOrder.bind(this, obj),
            disabled: from === 'manage',
        },
        options: PROJECT_AGENT_ORDER,
        getFormat: (value, form) => {
            form.isAgentOrder = Number(value);
            return form;
        },
        setFormat: (value) => {
            return String(value);
        },
    };
};
export default renderProjectingIsAgentOrder;
