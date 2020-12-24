/* eslint-disable */

/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import moment from 'moment';
import _ from 'lodash';
import { CONTRACT_INVOICE_COMPANY_TYPE, CONTRACT_INVOICE_TYPE, CONTRACT_INVOICE_TAX_RATE } from '@/utils/enum';
import { DATE_FORMAT } from '@/utils/constants';

//  检查是否为普票
// function checkDisabled(props) {
//     let type = props && props.state && props.state.formData && props.state.formData.contractInvoiceType;
//     return type == 1 ? false : true;
// }

// 改变发票类型
async function changeProjectingName(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    const tempObj = {};
    tempObj.contractInvoiceTaxRate = undefined;
    tempObj.contractInvoiceTaxMoney = undefined;
    tempObj.contractInvoiceMoneyTotal = undefined;
    // if (values == 1) {
    //     // 专票
    //     tempObj.contractInvoiceTaxRate = undefined;
    //     tempObj.contractInvoiceTaxMoney = undefined;
    //     tempObj.contractInvoiceMoneyTotal = undefined;
    // } else if (values == 0) {
    //     // 普票
    //     tempObj.contractInvoiceMoneyTotal = form.contractInvoiceMoney;
    //     tempObj.contractInvoiceTaxMoney = 0;
    //     tempObj.contractInvoiceTaxRate = undefined;
    // }
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign(
            {},
            formData,
            form,
            {
                contractInvoiceType: values,
            },
            tempObj,
        ),
    );
}

// 动态计算未税金额
function countNum(form) {
    const tempObj = {};
    if (form.contractInvoiceTaxMoney !== undefined) {
        const contractInvoiceMoney = Number(form.contractInvoiceMoney);
        const contractInvoiceTaxMoney = Number(form.contractInvoiceTaxMoney);
        tempObj.contractInvoiceMoneyTotal = Number(contractInvoiceMoney - contractInvoiceTaxMoney);
        tempObj.contractInvoiceTaxMoney = Number(form.contractInvoiceTaxMoney);
    }
    return tempObj;
}

// 改变税额
function changeContractInvoiceTaxMoney(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const tempObj = {};
    const contractInvoiceMoney = Number(form.contractInvoiceMoney);
    const contractInvoiceTaxMoney = Number(values);
    tempObj.contractInvoiceMoneyTotal = Number(contractInvoiceMoney - contractInvoiceTaxMoney);
    tempObj.contractInvoiceTaxMoney = values;
    props.changeSelfState(tempObj);
}

// 改变含税金额
function changeContractInvoiceMoney(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const tempObj = {};
    const contractInvoiceMoney = Number(values);
    const contractInvoiceTaxMoney = Number(form.contractInvoiceTaxMoney);
    tempObj.contractInvoiceMoneyTotal = Number(contractInvoiceMoney - contractInvoiceTaxMoney);
    tempObj.contractInvoiceMoney = values;
    props.changeSelfState(tempObj);
}

export const formatSelfCols = (obj, props) => {
    return [
        {
            columns: [
                [
                    {
                        label: '开票主体类型',
                        key: 'contractInvoiceCompanyType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择开票主体类型',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: CONTRACT_INVOICE_COMPANY_TYPE,
                        getFormat: (value, form) => {
                            const { state: { formData: { id = '' } = {} } = {} } = props || {};
                            form.id = id;
                            return form;
                        },
                        setFormat: (value, form) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '开票主体',
                        key: 'contractInvoiceCompanyId',
                        // disabled: obj.formDataObj.contract.contractSigningType == 3 ? true : false,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    // obj.formDataObj.contract.contractSigningType == 3
                                    //     ? false
                                    //     : true,
                                    message: '请选择开票主体',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: obj && obj.companyList,
                    },
                ],
                [
                    {
                        label: '发票开具时间',
                        key: 'contractInvoiceDate',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择发票开具时间',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'date',
                        getFormat: (value, form) => {
                            form.contractInvoiceDate = moment(value).format(DATE_FORMAT);
                            return form;
                        },
                        setFormat: (value) => {
                            return moment(value);
                        },
                    },
                ],
                [
                    {
                        label: '发票类型',
                        key: 'contractInvoiceType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择发票类型',
                                },
                            ],
                        },
                        defaultValue: 1,
                        componentAttr: {
                            onChange(option) {
                                changeProjectingName(obj, props, option);
                            },
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: CONTRACT_INVOICE_TYPE,
                        getFormat: (value, form) => {
                            return form;
                        },
                        setFormat: (value, form) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '含税金额',
                        key: 'contractInvoiceMoney',
                        placeholder: '请输入',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入含税金额',
                                },
                            ],
                        },
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 2,
                            min: -1000000000000,
                            max: 1000000000000,
                            onChange: changeContractInvoiceMoney.bind(this, obj, props),
                        },
                    },
                ],
                [
                    {
                        label: '税率',
                        key: 'contractInvoiceTaxRate',
                        // disabled: checkDisabled(props),
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    // required: checkDisabled(props) ? false : true,
                                    message: '请选择税率',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: CONTRACT_INVOICE_TAX_RATE,
                        getFormat: (value, form) => {
                            return form;
                        },
                        setFormat: (value, form) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '税额',
                        key: 'contractInvoiceTaxMoney',
                        placeholder: '请输入',
                        // disabled: checkDisabled(props),
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    // required: checkDisabled(props) ? false : true,
                                    message: '请填写税额',
                                },
                            ],
                        },
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 2,
                            min: -1000000000000,
                            max: 1000000000000,
                            onChange: changeContractInvoiceTaxMoney.bind(this, obj, props),
                        },
                    },
                ],
                [
                    {
                        label: '未税金额',
                        disabled: true,
                        key: 'contractInvoiceMoneyTotal',
                        placeholder: '请输入',
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 2,
                            min: -1000000000000,
                            max: 1000000000000,
                        },
                    },
                ],
            ],
        },
    ];
};

export default {
    formatSelfCols,
};
