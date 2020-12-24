/* eslint-disable */
import { getNormalAgentProject, getNormalAgentProjecting } from '@/pages/business/project/establish/services';

const renderProjectingCommonOrder = (obj, { from }) => {
    const { isAgentOrder } = obj.formData;
    // 接单类型，需显示代下单项目
    return (
        Number(isAgentOrder) === 1 && {
            label: '代下单项目',
            key: 'commonOrderId',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择代下单项目',
                    },
                ],
            },
            placeholder: '请选择',
            componentAttr: {
                request: (val) => {
                    // if (from === 'establish') {
                    //     return getNormalAgentProjecting({ pageNum: 1, pageSize: 50, name: val });
                    // }
                    return getNormalAgentProject({ pageNum: 1, pageSize: 50, name: val });
                },
                fieldNames: { value: 'projectingId', label: 'projectingName' },
                allowClear: true,
                initDataType: 'onfocus',
            },
            type: 'associationSearch',
            getFormat: (value, form) => {
                form.commonOrderId = value.value;
                form.commonOrderName = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return {
                    value: form.commonOrderId,
                    label: form.commonOrderName,
                };
            },
        }
    );
};
export default renderProjectingCommonOrder;
