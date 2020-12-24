/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 * */
/**
 * 新增/编辑公司银行帐号form
 * */

import { numReg } from '@/utils/reg';

export const formatSelfCols = () => {
    return [
        {
            columns: [
                [
                    {
                        label: '帐户名',
                        key: 'companyName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入帐户名',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        disabled: true,
                    },
                ],
                [
                    {
                        label: '开户行',
                        key: 'companyBankName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入开户行',
                                },
                                {
                                    max: 30,
                                    message: '至多输入30个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                ],
                [
                    {
                        label: '卡号',
                        key: 'companyBankNo',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    pattern: numReg,
                                    message: '请输入数字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                ],
                // {
                //   label: '报销专户', key: 'companyBankIsReimbursement', checkOption: {
                //     rules: [{
                //       required: true,
                //       message: '请选择是否是报销专户'
                //     }]
                // eslint-disable-next-line max-len
                //   }, placeholder: '请选择', type: 'select', options: TAX_TYPE, initialValue: '0', getFormat: (value, form) => {
                //     form.companyTaxType = Number(value);
                //     return form;
                //   }, setFormat: (value) => {
                //     return String(value);
                //   }
                // },
                [
                    {
                        label: '备注',
                        key: 'companyBankRemark',
                        checkOption: {
                            rules: [
                                {
                                    max: 140,
                                    message: '至多输入140个字',
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
