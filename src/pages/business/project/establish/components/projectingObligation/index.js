import _ from 'lodash';
import moment from 'moment';
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
    if (Number(trailPlatformOrder) === 1 || Number(trailPlatformOrder) === 3) {
        return true;
    }
    // 默认非必填
    return false;
};
// 获取不可编辑状态
const getDisabled = (obj) => {
    // 没有数据时，默认可编辑
    if (!obj || !obj.formData) {
        return false;
    }
    const { projectingAppointmentDTOList } = obj.formData;
    // 项目中履约义务已经被合同使用，则不能再增加
    const index = projectingAppointmentDTOList
        && projectingAppointmentDTOList.findIndex((item) => {
            return item.contractId;
        });
    return index > -1;
};
// 修改艺人时动态生成项目名称
const createProjectingName = (trailName, talentList) => {
    const projectingName = trailName || '';
    const time = moment().format('YYMM');
    let talentName = '';
    if (Array.isArray(talentList)) {
        if (talentList.length === 1) {
            talentName = talentList[0].talentName;
        } else if (talentList.length > 1) {
            talentName = '打包';
        }
    }
    return `${projectingName.trim()}*${talentName}*${time}`;
};
// 修改父表单数据
const changeParentForm = async ({ obj, from }, key, value) => {
    const { projectBudgets = [], trailPlatformOrder, projectingTrailName, projectingAppointmentDTOList } = obj.formData;
    const newBudgets = [];
    const temp = {};
    temp[key] = value;
    if (key === 'projectingAppointmentDTOList') {
        let canCalcWeight = false;
        // 项目中新增加的履约
        const contractAppointmentList = [];
        // 合同中已经计算过权重的履约
        let projectingAppointmentList = [];
        if (projectingAppointmentDTOList.length !== value.length) {
            canCalcWeight = true;
        } else {
            for (let i = 0; i < value.length; i += 1) {
                if (
                    projectingAppointmentDTOList[i].projectingAppointmentPath !== value[i].projectingAppointmentPath
                    || Number(projectingAppointmentDTOList[i].projectingAppointmentTalentId)
                        !== Number(value[i].projectingAppointmentTalentId)
                    || Number(projectingAppointmentDTOList[i].projectingAppointmentTalentType)
                        !== Number(value[i].projectingAppointmentTalentType)
                ) {
                    canCalcWeight = true;
                    break;
                }
            }
        }
        temp[key].map((item, i) => {
            // 排序
            item.no = i + 1;
            if (!item.contractId) {
                const contractAppointmentItem = _.cloneDeep(item);
                Object.keys(contractAppointmentItem).map((key) => {
                    if (/^projectingAppointment\w+$/.test(key)) {
                        const tempKey = key.replace(/^(projectingAppointment)(\w+)$/, ($0, $1, $2) => {
                            return `contractAppointment${$2}`;
                        });
                        contractAppointmentItem[tempKey] = contractAppointmentItem[key];
                    }
                });
                if (from === 'manage') {
                    // eslint-disable-next-line max-len
                    contractAppointmentItem.contractAppointmentProgress = contractAppointmentItem.projectAppointmentProgress;
                }
                contractAppointmentItem.contractAppointmentWeight = isNumber(
                    contractAppointmentItem.contractAppointmentWeight,
                )
                    ? accDiv(contractAppointmentItem.contractAppointmentWeight, 100).toFixed(4)
                    : contractAppointmentItem.contractAppointmentWeight;
                contractAppointmentList.push(contractAppointmentItem);
            } else {
                projectingAppointmentList.push(item);
            }
        });
        if (canCalcWeight) {
            // 新增加的履约需重新计算权重
            const weightResponse = await calcWeight({ contractAppointmentList });
            if (weightResponse && weightResponse.success && weightResponse.data) {
                weightResponse.data.map((one, i) => {
                    contractAppointmentList[i].projectingAppointmentWeight = isNumber(one.contractAppointmentWeight)
                        ? accMul(one.contractAppointmentWeight, 100).toFixed(2)
                        : one.contractAppointmentWeight;
                });
            }
        }
        projectingAppointmentList = projectingAppointmentList.concat(contractAppointmentList);
        const data = {
            projectingAppointmentDTOList: projectingAppointmentList,
            projectingBusinessTypeName: projectingAppointmentList.length > 0,
            projectBudgets,
        };
        // 长期项目和cps项目特殊处理，联动艺人预算
        if (Number(trailPlatformOrder) === 2 || Number(trailPlatformOrder) === 3) {
            const unique = _.uniqWith(value, (a, b) => {
                return (
                    Number(a.projectingAppointmentTalentId) === Number(b.projectingAppointmentTalentId)
                    && Number(a.projectingAppointmentTalentType) === Number(b.projectingAppointmentTalentType)
                );
            });
            unique.map((item) => {
                const budget = projectBudgets.find((b) => {
                    return (
                        Number(item.projectingAppointmentTalentId) === Number(b.talentId)
                        && Number(item.projectingAppointmentTalentType) === Number(b.talentType)
                    );
                });
                if (budget) {
                    newBudgets.push(budget);
                } else {
                    newBudgets.push({
                        talentId: item.projectingAppointmentTalentId,
                        talentType: item.projectingAppointmentTalentType,
                        talentName: item.projectingAppointmentTalentName,
                    });
                }
            });
            data.projectBudgets = newBudgets;
        }
        if (from === 'establish') {
            data.projectingName = createProjectingName(projectingTrailName, data.projectBudgets);
        }
        obj.changeSelfForm(data);
    }
};
const renderProjectingObligation = (obj, { from }) => {
    const { trailPlatformOrder } = obj.formData;
    // 除普通单外显示履约义务
    return {
        title: '履约义务明细',
        fixed: true,
        columns: [
            [
                {
                    key: 'projectingAppointmentDTOList',
                    type: 'formTable',
                    labelCol: { span: 0 },
                    wrapperCol: { span: 24 },
                    checkOption: {
                        validateTrigger: 'onSubmit',
                        validateFirst: true,
                        rules: [
                            {
                                required: getRequired(obj),
                                message: '履约义务明细信息填写不完整',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (!value || value.length === 0) {
                                        callback();
                                        return;
                                    }
                                    let result = false;
                                    for (let i = 0; i < value.length; i += 1) {
                                        const item = value[i];
                                        if (!item.projectingAppointmentPath) {
                                            result = true;
                                            break;
                                        }
                                    }
                                    if (result) {
                                        callback('履约义务明细信息填写不完整');
                                        return;
                                    }
                                    callback();
                                },
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (!value || value.length === 0) {
                                        callback();
                                        return;
                                    }
                                    let result = false;
                                    for (let i = 0; i < value.length; i += 1) {
                                        const item = value[i];
                                        if (
                                            Number(item.projectingAppointmentTalentType) === 0
                                            && !isNumber(item.projectingAppointmentBrand)
                                            && item.projectingAppointmentPath
                                        ) {
                                            const checkCode = item.projectingAppointmentPath.substr(0, 2);
                                            if (checkCode === '01' || checkCode === '02') {
                                                result = true;
                                            }
                                        }
                                    }
                                    if (result) {
                                        callback('艺人代言/广告类履约义务必须选择品牌');
                                        return;
                                    }
                                    callback();
                                },
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (!value || value.length === 0) {
                                        callback();
                                        return;
                                    }
                                    let result = false;
                                    if (obj && obj.formData.projectingTalentDivides) {
                                        for (let i = 0; i < obj.formData.projectingTalentDivides.length; i += 1) {
                                            const item = obj.formData.projectingTalentDivides[i];
                                            const index = value.findIndex((temp) => {
                                                return (
                                                    Number(temp.projectingAppointmentTalentId)
                                                        === Number(item.talentId)
                                                    && Number(temp.projectingAppointmentTalentType)
                                                        === Number(item.talentType)
                                                );
                                            });
                                            if (index === -1) {
                                                result = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (result) {
                                        callback('获得分成的艺人/博主必须要有履约义务');
                                        return;
                                    }
                                    callback();
                                },
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (!value || value.length === 0) {
                                        callback();
                                        return;
                                    }
                                    let flag = false;
                                    const result = {};
                                    for (let i = 0; i < value.length; i += 1) {
                                        const item = value[i];
                                        // eslint-disable-next-line max-len
                                        const key = `${item.projectingAppointmentTalentId}_${item.projectingAppointmentTalentType}`;
                                        // eslint-disable-next-line max-len
                                        if (result[key] !== undefined && isNumber(item.projectingAppointmentBrand)) {
                                            if (result[key] !== item.projectingAppointmentBrand) {
                                                flag = true;
                                                break;
                                            }
                                        } else {
                                            result[key] = item.projectingAppointmentBrand;
                                        }
                                    }
                                    if (flag) {
                                        callback('同一艺人/博主的品牌类型须唯一');
                                        return;
                                    }
                                    callback();
                                },
                            },
                        ],
                    },
                    componentAttr: {
                        border: true,
                        initForm: (record) => {
                            // if (Number(trailPlatformOrder) === 1) {
                            //     // 平台项目默认推广平台为下单平台
                            //     record.projectingPopularizePlatform = trailOrderPlatformId;
                            // }
                            if (Number(trailPlatformOrder) === 2) {
                                // 长期项目默认执行进度类型为手动输入
                                record.projectingAppointmentProgressType = '1';
                            }
                            // if (!record.projectingPopularizePlatform) {
                            //     record.projectingPopularizePlatform = undefined;
                            // }
                            if (record.projectingLiveTime) {
                                if (record.projectingExecuteUrl) {
                                    record.hasOnlineUrl = '1';
                                } else {
                                    record.hasOnlineUrl = '0';
                                }
                            } else {
                                record.hasOnlineUrl = undefined;
                            }
                            return record;
                        },
                        tableCols: columnsFn.bind(this, { formData: obj.formData, from }),
                        formCols: formatSelfCols.bind(this, { obj, from }),
                        formKey: 'projectingAppointmentDTOList',
                        addBtnText: '添加',
                        editBtnText: '编辑',
                        changeParentForm: changeParentForm.bind(this, { obj, from }),
                        hiddenKey: ['projectingExecuteUrl'],
                        disabled: getDisabled(obj, from),
                    },
                },
            ],
        ],
    };
};
export default renderProjectingObligation;
