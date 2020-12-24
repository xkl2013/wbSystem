/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import { isNumber } from '@/utils/utils';

export const formatSelfCols = (obj) => {
    const { talentList, contractMoneyTotal, trailPlatformOrder } = obj.formData;
    return [
        {
            columns: [
                [
                    {
                        label: '艺人/博主',
                        key: 'talentName',
                        componentAttr: {
                            request: () => {
                                return {
                                    success: true,
                                    data: {
                                        list: talentList,
                                    },
                                };
                            },
                            fieldNames: {
                                value: (val) => {
                                    return `${val.talentId}_${val.talentType}`;
                                },
                                label: 'talentName',
                            },
                            disabled: true,
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.talentId = Number(value.value.split('_')[0]);
                            form.talentName = value.label;
                            form.talentType = Number(value.value.split('_')[1]);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (!value) return value;
                            if (value.talentId !== undefined) {
                                return {
                                    value: `${value.talentId}_${value.talentType}`,
                                    label: value.talentName,
                                    talentType: value.talentType,
                                };
                            }
                            if (value.value !== undefined) {
                                return value;
                            }
                            return {
                                value: `${form.talentId}_${form.talentType}`,
                                label: form.talentName,
                                talentType: form.talentType,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '拆帐比例',
                        key: 'divideAmountRate',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入拆帐比例',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (Number(trailPlatformOrder) === 2 || Number(trailPlatformOrder) === 3) {
                                            callback();
                                            return;
                                        }
                                        if (!isNumber(contractMoneyTotal)) {
                                            callback('请先填写合同总金额');
                                            return;
                                        }
                                        callback();
                                    },
                                    message: '请先填写合同总金额',
                                },
                            ],
                        },
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 100,
                            formatter: (value) => {
                                return `${value}%`;
                            },
                            parser: (value) => {
                                return value.replace('%', '');
                            },
                        },
                    },
                ],
                [
                    {
                        label: '拆帐金额',
                        key: 'divideAmount',
                        placeholder: '请输入',
                        type: 'inputNumber',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入拆帐金额',
                                },
                            ],
                        },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 1000000000000,
                        },
                    },
                ],
                [
                    {
                        label: '分成比例(艺人：公司)',
                        key: 'divideRateTalent',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入分成比例',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        type: 'numberRatio',
                        minAttr: {
                            precision: 0,
                            min: 0,
                            max: 100,
                        },
                        maxAttr: {
                            precision: 0,
                            min: 0,
                            max: 100,
                        },
                        getFormat: (value, form) => {
                            form.divideRateTalent = value.min;
                            form.divideRateCompany = value.max;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.min && value.max) {
                                return value;
                            }
                            return { min: form.divideRateTalent, max: form.divideRateCompany };
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
