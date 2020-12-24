/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 **/

import { DATE_FORMAT } from '@/utils/constants';
import moment from 'moment';
import _ from 'lodash';
import { getCompanies } from '@/pages/business/project/contract/detail/services';

// 改变回款金额
async function changeContractReturnMoney(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    let total = Number(obj.formDataObj.contract.contractMoneyTotal);
    let money = Number(form.contractReturnMoney);
    let tempObj = {
        contractReturnRate: (money / total) * 100,
    };
    props.changeCols(formatSelfCols.bind(this, obj), _.assign({}, formData, form, tempObj));
}

const getCompaniesBank = async (id, targetOption) => {
    // 获取公司银行卡号
    let resultData = await getCompanies(id);
    if (resultData && resultData.success) {
        let companyBankList = (resultData.data && resultData.data.companyBankList) || [];
        let newList = companyBankList.map(item => ({
            ...item,
            label: item.companyBankNo,
            value: item.companyBankNo,
        }));
        targetOption.loading = false;
        targetOption.children = newList;
        return targetOption;
    }
};

// 级联选择收款帐号
async function loadDataFun(obj, props, selectedOptions) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let companyList = await getCompaniesBank(targetOption.value, targetOption);
    let option = [];
    obj.companyList.map(item => {
        if (item.value === companyList.value) {
            option.push(companyList);
        } else {
            option.push(item);
        }
    });
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, { companyList: option }),
    );
}

export const formatSelfCols = (obj, props) => {
    return [
        {
            columns: [
                [
                    {
                        label: '实际回款期数',
                        key: 'contractReturnPeriod',
                        placeholder: '请输入',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入回款期数',
                                },
                            ],
                        },
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 0,
                            min: 1,
                            max: 100,
                        },
                    },
                ],
                [
                    {
                        label: '实际回款比例',
                        key: 'contractReturnRate',
                        checkOption: {
                            validateFirst: true,
                        },
                        disabled: true,
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            formatter: value => `${value}%`,
                            parser: value => value.replace('%', ''),
                        },
                    },
                ],
                [
                    {
                        label: '实际回款金额',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入实际回款金额',
                                },
                            ],
                        },
                        key: 'contractReturnMoney',
                        placeholder: '请输入实际回款金额',
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: Number(obj.formDataObj.contract.contractMoneyTotal),
                            onBlur(option) {
                                changeContractReturnMoney(obj, props, option);
                            },
                            // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                        },
                    },
                ],
                [
                    {
                        label: '实际回款时间',
                        key: 'contractReturnDate',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择实际回款时间',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'date',
                        getFormat: (value, form) => {
                            form.contractReturnDate = moment(value).format(DATE_FORMAT);
                            let { state: { formData: { id = '' } = {} } = {} } = props || {};
                            form.id = id;
                            return form;
                        },
                        setFormat: value => {
                            return moment(value);
                        },
                    },
                ],
                [
                    {
                        label: '收款帐号',
                        key: 'companyBankNo',
                        disabled: obj.formDataObj.contract.contractSigningType == 3 ? true : false,
                        checkOption: {
                            rules: [
                                {
                                    required:
                                        obj.formDataObj.contract.contractSigningType == 3
                                            ? false
                                            : true,
                                    message: '请选择收款帐号',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'cascader',
                        componentAttr: {
                            disabled:
                                obj.formDataObj.contract.contractSigningType == 3 ? true : false,
                            options:
                                (props && props.formData && props.formData.companyList) ||
                                obj.companyList,
                            loadData: loadDataFun.bind(this, obj, props),
                            placeholder: '请选择',
                            mode: 'leaf',
                            displayRender: label => label[1],
                        },
                        getFormat: (value, form) => {
                            if (value && value.length > 0) {
                                if (typeof value[0] == 'number') {
                                    form.companyId = value[0];
                                    form.companyBankNo = value[1];
                                } else {
                                    form.companyId = value[0].value;
                                    form.companyBankNo = value[1].value;
                                }
                            } else {
                                form.companyId = '';
                                form.companyBankNo = null;
                            }
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (Array.isArray(value)) {
                                return value;
                            }
                            //form回填
                            return [form.companyId, form.companyBankNo];
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
