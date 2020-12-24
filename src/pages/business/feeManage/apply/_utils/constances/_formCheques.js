/* eslint-disable */

/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 * */
/**
 * 新增/编辑公司银行帐号form
 * */
import _ from 'lodash';
import { CHEQUES_TYPE, SETTLEMENT_TYPE } from '@/utils/enum';
// import { getSupplierList, getUserList as getUserListV2 } from '@/services/globalSearchApi';
import { getSupplierList, getUserListV2 } from '@/services/globalSearchApi';
import { getSupplierDetail } from '../../../services';
import SelfCom from '../../../components/addSupplier';

function changeCheques(obj, props, values) {
    const formData = props.formView.props.form.getFieldsValue();
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, {
            applicationChequesType: values,
            applicationChequesName: undefined,
            applicationChequesBankAccountNo: undefined,
            applicationChequesBankAccountName: undefined,
            applicationChequesBankAddress: undefined,
            applicationChequesBankCity: undefined,
        }),
    );
}

function changeUser(obj, props, values) {
    props.formView.props.form.setFieldsValue({
        applicationChequesBankAccountNo: values.employeeBankCard,
        applicationChequesBankAccountName: values.userRealName,
        applicationChequesBankAddress: values.employeeBankAddress,
        applicationChequesBankCity: values.employeeBankArea,
    });
}

function changeSupplier(obj, props, values) {
    const bankData = values.supplierBankVoList[0];
    props.formView.props.form.setFieldsValue({
        applicationChequesBankAccountNo: {
            key: bankData.supplierBankNo,
            label: bankData.supplierBankNo,
            value: bankData.supplierBankNo,
        },
        applicationChequesBankAccountName: values.supplierName,
        applicationChequesBankAddress: bankData.supplierBankName,
        applicationChequesBankCity: bankData.supplierBankCity,
    });
}
// function changeSupplier(obj, props, values) {
//     props.formView.props.form.setFieldsValue({
//         applicationChequesBankAccountNo: undefined,
//         applicationChequesBankAccountName: values.supplierName,
//         applicationChequesBankAddress: undefined,
//         applicationChequesBankCity: undefined,
//     });
// }
function changeBankAccountNo(obj, props, values) {
    props.formView.props.form.setFieldsValue({
        // applicationChequesBankAccountName: values.supplierBankAcountName,
        applicationChequesBankAddress: values.supplierBankName,
        applicationChequesBankCity: values.supplierBankCity,
    });
}

export const formatSelfCols = (obj, props) => {
    return [
        {
            columns: [
                [
                    {
                        label: '收款对象类型',
                        key: 'applicationChequesType',
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
                            form.applicationChequesType = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    (() => {
                        if (props && props.state.formData.applicationChequesType == 2) {
                            return {
                                label: '收款对象名称',
                                key: 'applicationChequesName',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择收费对象',
                                        },
                                    ],
                                },
                                placeholder: '请选择',
                                componentAttr: {
                                    request: (val) => {
                                        return getSupplierList({
                                            supplierName: val || '',
                                            pageSize: 50,
                                            pageNum: 1,
                                        });
                                    },
                                    fieldNames: { value: 'supplierId', label: 'supplierName' },
                                    updateId: Math.random(),
                                    onChange: changeSupplier.bind(this, obj, props),
                                    selfCom: <SelfCom formData={obj.formData} />,
                                },
                                type: 'associationSearch',
                                getFormat: (value, form) => {
                                    form.applicationChequesName = value.label;
                                    form.applicationChequesId = Number(value.value);
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        value: form.applicationChequesId,
                                        label: form.applicationChequesName,
                                    };
                                },
                            };
                        }
                        if (props && props.state.formData.applicationChequesType == 3) {
                            return {
                                label: '收款对象名称',
                                key: 'applicationChequesName',
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
                                    allowClear: true,
                                    updateId: Math.random(),
                                    onChange: changeUser.bind(this, obj, props),
                                },
                                getFormat: (value, form) => {
                                    form.applicationChequesId = value.value;
                                    form.applicationChequesName = value.label;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.applicationChequesName,
                                        value: form.applicationChequesId,
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
                        key: 'applicationChequesSettlementWay',
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
                            form.applicationChequesSettlementWay = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    (() => {
                        if (props && Number(props.state.formData.applicationChequesType) === 2) {
                            return {
                                label: '银行帐号',
                                key: 'applicationChequesBankAccountNo',
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
                                    request: async () => {
                                        const formdata = props.formView.props.form.getFieldValue(
                                            'applicationChequesName',
                                        );
                                        const res = await getSupplierDetail(formdata.value);
                                        return {
                                            message: 'success',
                                            success: true,
                                            code: '200',
                                            data: (res.success && res.data.supplierBankVoList) || [],
                                        };
                                    },
                                    allowClear: false,
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'supplierBankNo', label: 'supplierBankNo' },
                                    onChange: changeBankAccountNo.bind(this, obj, props),
                                },
                                getFormat: (value, form) => {
                                    const result = form;
                                    result.applicationChequesBankAccountNo = value.label;
                                    return result;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.applicationChequesBankAccountNo,
                                        value: form.applicationChequesBankAccountNo,
                                    };
                                },
                            };
                        }
                        if (props && Number(props.state.formData.applicationChequesType) === 3) {
                            return {
                                label: '银行帐号',
                                key: 'applicationChequesBankAccountNo',
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
                // [
                //     {
                //         label: '银行帐号',
                //         key: 'applicationChequesBankAccountNo',
                //         checkOption: {
                //             rules: [
                //                 {
                //                     required: true,
                //                     whitespace: true,
                //                     message: '请输入银行帐号',
                //                 },
                //             ],
                //         },
                //         placeholder: '请输入',
                //         disabled: true,
                //     },
                // ],
                [
                    {
                        label: '帐户名称',
                        key: 'applicationChequesBankAccountName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
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
                        key: 'applicationChequesBankAddress',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
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
                        key: 'applicationChequesBankCity',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
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
