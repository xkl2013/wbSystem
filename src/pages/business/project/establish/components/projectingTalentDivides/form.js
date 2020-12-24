/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import { getTalentList } from '@/services/globalSearchApi';
import { isNumber } from '@/utils/utils';

const getDisabled = ({ from }, props) => {
    if (!props || !props.state) {
        return false;
    }
    if (from === 'manage') {
        const { id, talentId } = props.state.formData;
        return id && talentId;
    }
    return false;
};
export const formatSelfCols = ({ obj, from }, props) => {
    const { projectingBudget } = obj.formData;
    return [
        {
            columns: [
                [
                    {
                        label: '艺人/博主',
                        key: 'talentName',
                        componentAttr: {
                            request: (val) => {
                                return getTalentList({ talentName: val });
                            },
                            fieldNames: {
                                value: (val) => {
                                    return `${val.talentId}_${val.talentType}`;
                                },
                                label: 'talentName',
                            },
                            initDataType: 'onfocus',
                            disabled: getDisabled({ from }, props),
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
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value: `${form.talentId}_${form.talentType}`,
                                label: form.talentName,
                            };
                        },
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择艺人/博主',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        const talentList = obj.formData.projectingTalentDivides || [];
                                        const index = talentList.findIndex((item) => {
                                            return (
                                                Number(item.talentId) === Number(value.talentId)
                                                && Number(item.talentType) === Number(value.talentType)
                                            );
                                        });
                                        if (index > -1) {
                                            callback('该艺人信息已添加');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                    },
                ],
                [
                    {
                        label: '拆账比例',
                        key: 'divideAmountRate',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入拆账比例',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (!isNumber(projectingBudget)) {
                                            callback('请先填写签单额');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 4,
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
                        label: '拆账金额',
                        key: 'divideAmount',
                        placeholder: '请输入',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入拆账金额',
                                },
                            ],
                        },
                        type: 'inputNumber',
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
