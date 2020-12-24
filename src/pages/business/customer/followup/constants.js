/**
 * 新增/编辑form表单cols
 * */
import { IS_OR_NOT, SEX_TYPE } from '@/utils/enum';
import { approvalBusinessData } from '@/services/globalSearchApi';
import { mobileReg } from '@/utils/reg';

export const formCols = (obj) => {
    return [
        {
            columns: [
                [
                    {
                        label: '姓名',
                        key: 'contactName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '姓名不能为空',
                                },
                            ],
                        },
                        placeholder: '姓名（必填）',
                    },
                ],
                [
                    {
                        label: '性别',
                        key: 'sex',
                        checkOption: {
                            defaultValue: '1',
                        },
                        placeholder: '请选择',
                        type: 'radio',
                        options: SEX_TYPE,
                        getFormat: (value, form) => {
                            form.sex = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '手机号码',
                        key: 'mobilePhone',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    pattern: mobileReg,
                                    message: '请输入正确的手机号码',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        const ref = obj.formView.current;
                                        if (ref && ref.props && ref.props.form) {
                                            const weixinNumber = ref.props.form.getFieldValue('weixinNumber');
                                            if (!value && !weixinNumber) {
                                                callback('手机号微信号至少填一项');
                                                return;
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        componentAttr: {
                            allowClear: true,
                        },
                        placeholder: '(手机号微信号至少填一项)',
                    },
                ],
                [
                    {
                        label: '微信号',
                        key: 'weixinNumber',
                        componentAttr: {
                            placeholder: '微信号(手机号微信号至少填一项)',
                        },
                    },
                ],
                [
                    {
                        label: '其他联系方式',
                        key: 'otherNumber',
                        componentAttr: {
                            placeholder: '请输入其他联系方式',
                        },
                    },
                ],
                [
                    {
                        label: '公司名称',
                        key: 'customerName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择公司名称',
                                },
                            ],
                        },
                        type: 'associationSearch',
                        componentAttr: {
                            allowClear: true,
                            request: (val) => {
                                return approvalBusinessData({
                                    fieldValueName: 'customer',
                                    name: val,
                                });
                            },
                            fieldNames: { value: 'fieldValueValue', label: 'fieldValueName' },
                            placeholder: '公司名称（必填）',
                            initDataType: 'onfocus',
                        },
                        getFormat: (value, form) => {
                            form.customerId = value.value;
                            form.customerName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return { label: form.customerName, value: form.customerId };
                        },
                    },
                ],
                [
                    {
                        label: '所属职位',
                        key: 'position',
                        componentAttr: {
                            placeholder: '所属职位',
                        },
                    },
                ],
                [
                    {
                        label: '关键决策人',
                        key: 'decisioner',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择关键决策人',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'radio',
                        options: IS_OR_NOT,
                        getFormat: (value, form) => {
                            form.decisioner = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
            ],
        },
    ];
};
