/**
 * 新增/编辑form表单cols
 * */
import { getRegions } from '../../services';

export const formatCols = () => {
    return [
        {
            title: '常驻地:',
            icon: 'iconziduan-xiala',
            columns: [
                [
                    {
                        key: 'homeId',
                        type: 'associationSearch',
                        placeholder: '请选择',
                        componentAttr: {
                            request: (val) => {
                                return getRegions({ name: val, levelType: 2 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'id', label: 'name' },
                            allowClear: true,
                            placeholder: '请选择',
                            dropdownStyle: { height: '120px', overflow: 'hidden' },
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择常驻地',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.homeId = value.value;
                            form.home = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value && value.value) {
                                return {
                                    label: value.label,
                                    value: value.value,
                                };
                            }
                            return {
                                label: form.home,
                                value: form.homeId,
                            };
                        },
                    },
                ],
            ],
        },
        {
            title: '档期说明:',
            icon: 'iconziduan-duohangwenben',
            columns: [
                [
                    {
                        key: 'calendarRemark',
                        type: 'textarea',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请填写档期说明',
                                },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (value.length > 500) {
                                            callback(rule.message);
                                        }
                                    },
                                    message: '最多输入500字',
                                },
                            ],
                        },
                        componentAttr: { maxLength: 500 },
                        placeholder: '请填写档期说明',
                    },
                ],
            ],
        },
        {},
    ];
};
export default {
    formatCols,
};
