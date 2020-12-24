import { numberReg } from '@/utils/reg';
import { dictionariesList } from '../service';

const formatCols = (props) => {
    return [
        {
            columns: [
                [
                    {
                        label: '供应商户名',
                        key: 'supplierBankAcountName',
                        disabled: true,
                    },
                ],
                [
                    {
                        label: '银行账号',
                        key: 'supplierBankNo',

                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    pattern: numberReg,
                                    message: '请填写整数',
                                },
                                {
                                    max: 50,
                                    message: '至多输入50个字',
                                },
                            ],
                        },
                    },
                ],
                [
                    {
                        label: '银行名称',
                        key: 'selfBankName',
                        type: 'associationSearch',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择银行名称',
                                },
                            ],
                        },
                        componentAttr: {
                            request: (val) => {
                                return dictionariesList({ parentId: 4, pageNum: 1, pageSize: 100, value: val });
                            },
                            allowClear: false,
                            initDataType: 'onfocus',
                            fieldNames: { value: 'id', label: 'value' },
                            onChange: () => {
                                props.formView.props.form.setFieldsValue({
                                    supplierBankName: undefined,
                                });
                            },
                        },
                        getFormat: (value, formObj) => {
                            const form = { ...formObj };
                            form.selfBankId = value.value;
                            form.selfBankName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label && value.value) {
                                return value;
                            }
                            return {
                                label: form.selfBankName,
                                value: form.selfBankId,
                            };
                        },
                        placeholder: '请选择',
                    },
                ],
                [
                    {
                        label: '开户行',
                        key: 'supplierBankName',
                        type: 'associationSearch',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择开户行',
                                },
                            ],
                        },
                        componentAttr: {
                            request: (val) => {
                                const formdata = props.formView.props.form.getFieldValue('selfBankName');
                                return dictionariesList({ parentId: formdata ? formdata.id : -1, value: val });
                            },
                            initDataType: 'onfocus',
                            allowClear: true,
                            fieldNames: { value: 'code', label: 'value' },
                            onChange: (val) => {
                                props.formView.props.form.setFieldsValue({
                                    supplierBankCode: val && val.code,
                                    supplierBankName: val,
                                });
                            },
                            // selfCom: <span className={s.tipCls}>如果没有找到“开户行”，请联系财务人员添加。</span>,
                        },
                        getFormat: (value, formObj) => {
                            const form = { ...formObj };
                            form.selfBankNo = value.value;
                            form.supplierBankName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label && value.value) {
                                return value;
                            }
                            return {
                                label: form.supplierBankName,
                                value: form.selfBankNo,
                            };
                        },
                        placeholder: '如果没找到“开户行”，请联系财务人员添加。',
                    },
                ],
                [
                    {
                        label: '开户行编码',
                        key: 'supplierBankCode',
                        placeholder: '开户行编码',
                        disabled: true,
                    },
                ],
                [
                    {
                        label: '开户地',
                        key: 'supplierBankCity',
                        checkOption: {
                            rules: [
                                // {
                                //     required: true,
                                //     whitespace: true,
                                //     message: '请输入开户地',
                                // },
                                {
                                    max: 100,
                                    message: '至多输入100个字',
                                },
                            ],
                        },
                        placeholder: '',
                    },
                ],
            ],
        },
    ];
};

export default formatCols;
