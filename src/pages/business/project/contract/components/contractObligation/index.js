import { isNumber } from '@/utils/utils';
import { calcWeight } from '@/pages/business/project/contract/services';
import { accDiv, accMul } from '@/utils/calculate';
import { formatSelfCols } from './selfForm';
import { columnsFn } from './selfTable';

// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { trailPlatformOrder } = obj.formData;
    // 平台单和cps必填
    return Number(trailPlatformOrder) === 1 || Number(trailPlatformOrder) === 3;
};
// 对履约义务模块的特殊检测逻辑
const checkInfo = (rule, value, callback) => {
    if (!value || value.length === 0) {
        callback();
        return;
    }
    let result = false;
    let msg = '';
    let index = 0;
    const temp = {};
    for (let i = 0; i < value.length; i += 1) {
        const item = value[i];
        if (item.contractAppointmentPath === '00') {
            break;
        }
        // 当前履约义务的序号
        index = i + 1;
        // 没有填写履约义务字段，不允许提交
        if (!item.contractAppointmentPath) {
            result = true;
            msg = `第${index}条履约义务明细缺少履约义务字段，请重新编辑`;
            break;
        }
        // 履约义务权重不是数字
        if (!isNumber(item.contractAppointmentWeight)) {
            result = true;
            msg = `第${index}条履约义务权重有误，请重新编辑`;
            break;
        }
        // 检测同一艺人/博主的品牌是否唯一
        const key = `${item.contractAppointmentTalentId}_${item.contractAppointmentTalentType}`;
        if (temp[key] !== undefined) {
            if (Number(temp[key]) !== Number(item.contractAppointmentBrand)) {
                result = true;
                msg = `${item.contractAppointmentTalentName}的品牌类型须唯一，请重新编辑`;
                break;
            }
        } else {
            temp[key] = item.contractAppointmentBrand;
        }
    }
    if (result) {
        callback(msg);
        return;
    }
    callback();
};
// 检测拥有艺人分成的艺人是否填写了履约义务
const checkBaseOnDivide = (rule, value, callback, obj) => {
    if (!value || value.length === 0 || !obj || !obj.formData || !obj.formData.contractTalentDivideList) {
        callback();
        return;
    }
    const { contractTalentDivideList } = obj.formData;
    let result = false;
    for (let i = 0; i < contractTalentDivideList.length; i += 1) {
        const item = contractTalentDivideList[i];
        const index = value.findIndex((temp) => {
            return (
                Number(temp.contractAppointmentTalentId) === Number(item.talentId)
                && Number(temp.contractAppointmentTalentType) === Number(item.talentType)
            );
        });
        // 当前艺人有艺人分成而没有填写履约义务
        if (index === -1) {
            result = true;
            break;
        }
    }
    if (result) {
        callback('获得分成的艺人/博主必须要有履约义务');
        return;
    }
    callback();
};
// 单条履约义务提交，同步到父容器state中
const changeParentForm = async (obj, key, value) => {
    const temp = {};
    temp[key] = value;
    if (key === 'contractAppointmentList') {
        // 排序，保证后端处理后返回数据顺序跟用户填写的一致
        temp[key]
            .map((item) => {
                if (!item.no) {
                    item.no = value.length > 1 ? value[value.length - 2].no + 1 : value.length;
                }
                item.contractAppointmentWeight = isNumber(item.contractAppointmentWeight)
                    ? accDiv(item.contractAppointmentWeight, 100).toFixed(4)
                    : item.contractAppointmentWeight;
                return item;
            })
            .sort((a, b) => {
                return a.no - b.no;
            });
        const response = await calcWeight(temp);
        if (response && response.success && response.data) {
            temp[key] = response.data.map((item) => {
                item.contractAppointmentWeight = isNumber(item.contractAppointmentWeight)
                    ? accMul(item.contractAppointmentWeight, 100).toFixed(2)
                    : item.contractAppointmentWeight;
                return item;
            });
        }
        obj.changeSelfForm({
            contractAppointmentList: temp[key],
        });
    }
};

// 渲染履约义务模块，使用自定义组件formTable
const renderContractObligation = (obj) => {
    return {
        title: '履约义务明细',
        fixed: true,
        columns: [
            [
                {
                    key: 'contractAppointmentList',
                    type: 'formTable',
                    labelCol: { span: 0 },
                    wrapperCol: { span: 24 },
                    checkOption: {
                        validateTrigger: 'onSubmit', // 检测时机为表单submit时
                        validateFirst: true, // 第一条检测失败后停止后续检测
                        rules: [
                            {
                                required: getRequired(obj),
                                message: '请填写履约义务明细',
                            },
                            {
                                validator: checkInfo,
                            },
                            {
                                validator: checkBaseOnDivide.bind(obj),
                            },
                        ],
                    },
                    componentAttr: {
                        border: true,
                        tableCols: columnsFn.bind(this, obj),
                        formCols: formatSelfCols.bind(this, obj),
                        formKey: 'contractAppointmentList',
                        addBtnText: '添加',
                        editBtnText: '编辑',
                        changeParentForm: changeParentForm.bind(this, obj),
                    },
                },
            ],
        ],
    };
};
export default renderContractObligation;
