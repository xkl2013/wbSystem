import { columnsFn } from './selfTable';
import { formatSelfCols } from './selfForm';
import { accAdd } from '@/utils/calculate';

// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder, contractSigningType } = obj.formData;
    // 非长期、cps必填
    if (Number(trailPlatformOrder) !== 2 && Number(trailPlatformOrder) !== 3) {
        // 签约方式中有公司时必填
        if (Number(contractSigningType) !== 3) {
            return true;
        }
    }
    // 默认非必填
    return false;
};
const renderContractReturn = (obj) => {
    const { contractSigningType, contractMoneyCompany } = obj.formData;
    return {
        title: '回款计划',
        fixed: true,
        columns: [
            [
                {
                    key: 'contractReturnList',
                    type: 'formTable',
                    labelCol: { span: 0 },
                    wrapperCol: { span: 24 },
                    checkOption: {
                        validateTrigger: 'onSubmit',
                        validateFirst: true,
                        rules: [
                            {
                                required: getRequired(obj),
                                message: '回款计划不允许为空！',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (!value || value.length === 0) {
                                        callback();
                                        return;
                                    }
                                    if (Number(contractSigningType) === 1 || Number(contractSigningType) === 2) {
                                        // 公司金额
                                        const companyMoney = Number(contractMoneyCompany);
                                        let total = 0;
                                        value.map((item) => {
                                            total = accAdd(total, Number(item.contractReturnMoney));
                                        });
                                        if (total !== companyMoney) {
                                            callback('预计回款金额之和不等于公司金额');
                                            return;
                                        }
                                    }
                                    callback();
                                },
                            },
                        ],
                    },
                    componentAttr: {
                        border: true,
                        tableCols: columnsFn.bind(this, { formData: obj.formData }),
                        formCols: formatSelfCols.bind(this, obj),
                        formKey: 'contractReturnList',
                        addBtnText: '添加',
                        editBtnText: '编辑',
                        changeParentForm: obj.changeParentForm,
                    },
                },
            ],
        ],
    };
};
export default renderContractReturn;
