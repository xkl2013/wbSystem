/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 * */
import _ from 'lodash';
import { CHEQUES_TYPE, SETTLEMENT_TYPE } from '@/utils/enum';
import { getSupplierList, getUserListV2 } from '@/services/globalSearchApi';
import { getSupplierDetail } from '../../../services';
import SelfCom from '../../../components/addSupplier';
/* eslint-disable */
function changeCheques(obj, props, values) {
    const formData = props.formView.props.form.getFieldsValue();
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, {
            reimburseChequesType: values,
            reimburseChequesName: undefined,
            reimburseChequesBankAccountNo: undefined,
            reimburseChequesBankAccountName: undefined,
            reimburseChequesBankAddress: undefined,
            reimburseChequesBankCity: undefined,
        }),
    );
}

function changeUser(obj, props, values) {
    props.formView.props.form.setFieldsValue({
        reimburseChequesBankAccountNo: values.employeeBankCard,
        reimburseChequesBankAccountName: values.userRealName,
        reimburseChequesBankAddress: values.employeeBankAddress,
        reimburseChequesBankCity: values.employeeBankArea,
    });
}
function changeSupplier(obj, props, values) {
    const bankData = values.supplierBankVoList[0];
    props.formView.props.form.setFieldsValue({
        reimburseChequesBankAccountNo: {
            key: bankData.supplierBankNo,
            label: bankData.supplierBankNo,
            value: bankData.supplierBankNo,
        },
        reimburseChequesBankAccountName: values.supplierName,
        reimburseChequesBankAddress: bankData.supplierBankName,
        reimburseChequesBankCity: bankData.supplierBankCity,
    });
}

// function changeSupplier(obj, props, values) {
//     props.formView.props.form.setFieldsValue({
//         reimburseChequesBankAccountNo: undefined,
//         reimburseChequesBankAccountName: values.supplierName,
//         reimburseChequesBankAddress: undefined,
//         reimburseChequesBankCity: undefined,
//     });
// }
function changeBankAccountNo(obj, props, values) {
    props.formView.props.form.setFieldsValue({
        // reimburseChequesBankAccountName: values.supplierBankAcountName,
        reimburseChequesBankAddress: values.supplierBankName,
        reimburseChequesBankCity: values.supplierBankCity,
    });
}

export const formatSelfCols = (obj, props) => {
    return [
        {
            columns: [
                [
                    {
                        label: '收款对象类型',
                        key: 'reimburseChequesType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择收款对象类型',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: CHEQUES_TYPE,
                        componentAttr: {
                            onChange: changeCheques.bind(this, obj, props),
                        },
                        getFormat: (value, form) => {
                            const result = form;
                            result.reimburseChequesType = Number(value);
                            return result;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    (() => {
                        if (props && Number(props.state.formData.reimburseChequesType) === 2) {
                            return {
                                label: '收款对象名称',
                                key: 'reimburseChequesName',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择收款对象',
                                        },
                                    ],
                                },
                                placeholder: '请选择',
                                componentAttr: {
                                    request: (val) => {
                                        return getSupplierList({
                                            supplierName: val || '',
                                        });
                                    },
                                    fieldNames: { value: 'supplierId', label: 'supplierName' },
                                    updateId: Math.random(),
                                    onChange: changeSupplier.bind(this, obj, props),
                                    selfCom: <SelfCom formData={obj.formData} />,
                                },
                                type: 'associationSearch',
                                getFormat: (value, form) => {
                                    const result = form;
                                    result.reimburseChequesName = value.label;
                                    result.reimburseChequesId = Number(value.value);
                                    return result;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        value: form.reimburseChequesId,
                                        label: form.reimburseChequesName,
                                    };
                                },
                            };
                        }
                        if (props && Number(props.state.formData.reimburseChequesType) === 3) {
                            return {
                                label: '收费对象名称',
                                key: 'reimburseChequesName',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择收费对象',
                                        },
                                    ],
                                },
                                placeholder: '请选择',
                                type: 'associationSearch',
                                componentAttr: {
                                    request: (val) => {
                                        return getUserListV2({ userRealName: val, pageSize: 50, pageNum: 1 });
                                    },
                                    fieldNames: { value: 'userId', label: 'userRealName' },
                                    allowClear: false,
                                    updateId: Math.random(),
                                    onChange: changeUser.bind(this, obj, props),
                                },
                                getFormat: (value, form) => {
                                    const result = form;
                                    result.reimburseChequesId = value.value;
                                    result.reimburseChequesName = value.label;
                                    return result;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.reimburseChequesName,
                                        value: form.reimburseChequesId,
                                    };
                                },
                            };
                        }
                        return [];
                    })(),
                ],
                [
                    {
                        label: '结算方式',
                        key: 'reimburseChequesSettlementWay',
                        checkOption: {
                            initialValue: '1',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择结算方式',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: SETTLEMENT_TYPE,
                        getFormat: (value, form) => {
                            const result = form;
                            result.reimburseChequesSettlementWay = Number(value);
                            return result;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    (() => {
                        if (props && Number(props.state.formData.reimburseChequesType) === 2) {
                            return {
                                label: '银行帐号',
                                key: 'reimburseChequesBankAccountNo',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择银行帐号',
                                        },
                                    ],
                                },
                                placeholder: '请选择',
                                type: 'associationSearch',
                                componentAttr: {
                                    request: async (val) => {
                                        const formdata = props.formView.props.form.getFieldValue(
                                            'reimburseChequesName',
                                        );
                                        const res = await getSupplierDetail(formdata.value);
                                        return {
                                            message: 'success',
                                            success: true,
                                            code: '200',
                                            data: (res.success && res.data.supplierBankVoList) || [],
                                        };
                                    },
                                    // request: async () => {

                                    //     const formdata = props.formView.props.form.getFieldValue(
                                    //         'reimburseChequesName',
                                    //     );
                                    //     return {
                                    //         message: 'success',
                                    //         success: true,
                                    //         code: '200',
                                    //         data:
                                    //             formdata && formdata.supplierBankVoList
                                    //                 ? formdata.supplierBankVoList
                                    //                 : [],
                                    //     };
                                    // },
                                    allowClear: false,
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'supplierBankNo', label: 'supplierBankNo' },
                                    onChange: changeBankAccountNo.bind(this, obj, props),
                                },
                                getFormat: (value, form) => {
                                    const result = form;
                                    result.reimburseChequesBankAccountNo = value.label;
                                    return result;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.reimburseChequesBankAccountNo,
                                        value: form.reimburseChequesBankAccountNo,
                                    };
                                },
                            };
                        }
                        if (props && Number(props.state.formData.reimburseChequesType) === 3) {
                            return {
                                label: '银行帐号',
                                key: 'reimburseChequesBankAccountNo',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入银行帐号',
                                        },
                                    ],
                                },
                                placeholder: '请输入',
                                disabled: true,
                            };
                        }
                        return [];
                    })(),
                ],
                [
                    {
                        label: '帐户名称',
                        key: 'reimburseChequesBankAccountName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入帐户名称',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        disabled: false,
                    },
                ],
                [
                    {
                        label: '开户银行',
                        key: 'reimburseChequesBankAddress',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入开户银行',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        disabled: true,
                    },
                ],
                [
                    {
                        label: '开户地',
                        key: 'reimburseChequesBankCity',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入开户地',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                ],
            ],
        },
    ];
};

export default {
    formatSelfCols,
};
