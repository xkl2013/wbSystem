import { TAX_TYPE, SUPPLIER_TYPE } from '@/utils/enum';
import { pureNumberReg } from '@/utils/reg';
import { columnsFn } from './_tableForm';
import formCols from './_formCols';

const formatCols = (obj) => {
    return [
        {
            title: '企业基本信息',
            columns: [
                [
                    {
                        label: '供应商名称:',
                        key: 'supplierName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入供应商名称',
                                },
                                {
                                    max: 50,
                                    message: '至多输入50个字',
                                },
                            ],
                        },
                        placeholder: '请输入供应商名称',
                    },
                ],
                [
                    {
                        label: '供应商类型:',
                        key: 'supplierType',
                        placeholder: '请选择供应商类型',
                        type: 'select',
                        options: SUPPLIER_TYPE,
                        getFormat: (value, form) => {
                            form.supplierType = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '佣金比例:',
                        key: 'supplierBrokerage',
                        placeholder: '',
                        type: 'inputNumber',
                        checkOption: {
                            rules: [
                                {
                                    pattern: pureNumberReg,
                                    message: '请填写整数',
                                },
                            ],
                        },
                        componentAttr: {
                            formatter: (val) => {
                                return `${val}%`;
                            },
                            parser: (val) => {
                                return val.replace('%', '');
                            },
                        },
                    },
                ],
                [
                    {
                        label: '税率:',
                        key: 'supplierVatRate',
                        placeholder: '请选择税率',
                        type: 'inputNumber',
                        checkOption: {
                            rules: [
                                {
                                    pattern: pureNumberReg,
                                    message: '请填写整数',
                                },
                            ],
                        },
                        componentAttr: {
                            formatter: (val) => {
                                return `${val}%`;
                            },
                            parser: (val) => {
                                return val.replace('%', '');
                            },
                        },
                    },
                ],
                [
                    {
                        label: '税务资质:',
                        key: 'supplierTaxType',
                        placeholder: '请选择税务资质',
                        type: 'select',
                        options: TAX_TYPE,
                        getFormat: (value, form) => {
                            form.supplierTaxType = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
            ],
        },
        {
            title: '银行信息',
            fixed: true,
            columns: [
                [
                    {
                        key: 'supplierBankVoList',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            border: true,
                            tableCols: columnsFn,
                            formCols,
                            initForm: () => {
                                const { form, formData } = obj;
                                const newName = (form && form.getFieldValue('supplierName')) || formData.supplierName;
                                return { supplierBankAcountName: newName };
                            },
                            formKey: 'supplierBankId',
                            addBtnText: '添加银行信息',
                            // editBtnText: '编辑',
                            changeParentForm: obj.changeParentForm,
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '银行信息填写不完整',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (!value || value.length === 0) {
                                            callback();
                                            return;
                                        }
                                        // let result = false;
                                        // for (let i = 0; i < value.length; i += 1) {
                                        //     const item = value[i];
                                        //     if (!item.supplierBankCity) {
                                        //         result = true;
                                        //         break;
                                        //     }
                                        // }
                                        // if (result) {
                                        //     callback('银行信息填写不完整');
                                        //     return;
                                        // }
                                        callback();
                                    },
                                },
                            ],
                        },
                    },
                ],
            ],
        },
    ];
};

export default formatCols;
