import { accAdd } from '@/utils/calculate';
import { columnsFn } from './table';
import { formatSelfCols } from './form';

const renderContractTalentDivides = (obj) => {
    const { contractMoneyTotal, trailPlatformOrder } = obj.formData;
    // 长期和cps不显示艺人博主分成
    return {
        title: '艺人博主分成',
        fixed: true,
        columns: [
            [
                {
                    key: 'contractTalentDivideList',
                    type: 'formTable',
                    labelCol: { span: 0 },
                    wrapperCol: { span: 24 },
                    checkOption: {
                        validateTrigger: 'onSubmit',
                        validateFirst: true,
                        rules: [
                            {
                                required: true,
                                message: '艺人博主分成信息填写不完整',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    const error = (value || []).find((el) => {
                                        return (
                                            accAdd(Number(el.divideRateCompany), Number(el.divideRateTalent)) !== 100
                                        );
                                    });
                                    if (error) {
                                        callback('艺人博主分成信息填写不完整');
                                        return;
                                    }
                                    callback();
                                },
                            },
                            {
                                validator: (rule, value, callback) => {
                                    let total = 0;
                                    value.map((item) => {
                                        total = accAdd(total, Number(item.divideAmountRate));
                                    });
                                    if (total !== 100) {
                                        callback('艺人博主拆帐比例之和应为100%');
                                        return;
                                    }
                                    callback();
                                },
                            },
                            {
                                validator: (rule, value, callback) => {
                                    let total = 0;
                                    value.map((item) => {
                                        total = accAdd(total, Number(item.divideAmount));
                                    });
                                    if (Number(trailPlatformOrder) === 2 || Number(trailPlatformOrder) === 3) {
                                        // 长期、cps如果没有填合同总金额，不校验
                                        if (!contractMoneyTotal) {
                                            callback();
                                            return;
                                        }
                                    }
                                    if (total !== Number(contractMoneyTotal)) {
                                        callback('艺人博主拆帐金额之和应为合同总金额');
                                        return;
                                    }
                                    callback();
                                },
                            },
                        ],
                    },
                    componentAttr: {
                        border: true,
                        disabled: true,
                        tableCols: columnsFn.bind(this, { formData: obj.formData }),
                        formCols: formatSelfCols.bind(this, obj),
                        formKey: 'contractTalentDivideList',
                        addBtnText: '添加',
                        editBtnText: '编辑',
                        changeParentForm: obj.changeParentForm,
                    },
                },
            ],
        ],
    };
};
export default renderContractTalentDivides;
