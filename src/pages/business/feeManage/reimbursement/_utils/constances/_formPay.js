/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 **/
/**
 * 新增/编辑公司银行帐号form
 * */
import _ from "lodash";
import {getCompanyDetail} from "@/services/globalDetailApi";
import {getCompanyList} from '@/services/globalSearchApi';


async function changeCompany(obj, props, values) {
    const formData = props.formView.props.form.getFieldsValue();
    let response = await getCompanyDetail(values.value);
    if (response.success) {
        const {companyBankList} = response.data;
        let bank = companyBankList && companyBankList.find(item => item.companyBankIsReimbursement == 1);
        props.changeCols(formatSelfCols.bind(this, obj), _.assign({}, formData, {
            reimbursePayCompanyId: values.value,
            reimbursePayCompanyName: values.label,
            reimbursePayCompanyCode: values.companyCode,
            reimbursePayBankAddress: bank && bank.companyBankName,
            reimbursePayBankAcountNo: bank && bank.companyBankNo,
        }));
    }
}

export const formatSelfCols = (obj, props) => {
    return [
        {
            columns: [
                [
                    {
                        label: '公司主体', key: 'reimbursePayCompanyName',
                        checkOption: {
                            rules: [{
                                required: true,
                                message: '请选择收款对象类型'
                            }]
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            allowClear: true,
                            request: (val) => {
                                return getCompanyList({pageNum: 1, pageSize: 50, companyName: val})
                            },
                            fieldNames: {value: 'companyId', label: 'companyName'},
                            onChange: changeCompany.bind(this, obj, props)
                        },
                        getFormat: (value, form) => {
                            form.reimbursePayCompanyId = value.value;
                            form.reimbursePayCompanyCode = props.state.formData.reimbursePayCompanyCode;
                            form.reimbursePayCompanyName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {label: form.reimbursePayCompanyName, value: form.reimbursePayCompanyId};
                        }
                    },
                ],
                [
                    {
                        label: '开户行', key: 'reimbursePayBankAddress', checkOption: {
                            rules: [{
                                required: true,
                                message: '请输入开户行'
                            }]
                        }, placeholder: '请输入', disabled: true
                    }
                ],
                [
                    {
                        label: '银行帐号', key: 'reimbursePayBankAcountNo', checkOption: {
                            rules: [{
                                required: true,
                                message: '请输入银行帐号'
                            }]
                        }, placeholder: '请输入', disabled: true
                    }
                ],
            ]
        }
    ]
}

export default {
    formatSelfCols
};
