/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
/* eslint-disable no-use-before-define */
import moment from 'moment';
import _ from 'lodash';
import { CONTRACT_OBLIGATION_TYPE, CONTRACT_BRAND_TYPE, CONTRACT_PROGRESS_TYPE } from '@/utils/enum';
import { DATETIME_FORMAT } from '@/utils/constants';
import { getLeafOptions, getOptionPath, isNumber } from '@/utils/utils';

// 改变艺人，清空表单
function changeTalent(obj, props, values) {
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign(
            {},
            {
                contractAppointmentTalentId: values,
            },
        ),
    );
}

// 改变履约义务类型，清空品牌
function changeObligation(obj, props, values) {
    const formData = props.formView.props.form.getFieldsValue();
    const form = props.state.formData;
    let contractAppointmentProgressType = 0;
    if (!values || values.length === 0) {
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, form, formData, {
                contractAppointmentPath: undefined,
                contractAppointmentBrand: undefined,
                contractAppointmentProgressType: undefined,
            }),
        );
        return;
    }
    if (values[values.length - 1].value === '010101' || values[values.length - 1].value === '010102') {
        contractAppointmentProgressType = 0;
    } else {
        contractAppointmentProgressType = 1;
    }
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, form, formData, {
            contractAppointmentPath: values,
            contractAppointmentBrand: undefined,
            contractAppointmentProgressType,
        }),
    );
}
// 获取当前表单中的艺人
const getTalent = (props) => {
    if (!props || !props.state) {
        return {};
    }
    const { contractAppointmentTalentId, contractAppointmentTalentType } = props.state.formData;
    if (!contractAppointmentTalentId) {
        return {};
    }
    if (typeof contractAppointmentTalentId === 'object') {
        const { value } = contractAppointmentTalentId;
        const arr = value.split('_');
        return {
            talentId: arr[0],
            talentType: arr[1],
        };
    }
    return {
        talentId: contractAppointmentTalentId,
        talentType: contractAppointmentTalentType,
    };
};
// 是否是代言类/广告推广
const checkDY = (props) => {
    if (!props || !props.state) {
        return false;
    }
    const { formData } = props.state;
    const { contractAppointmentPath } = formData || {};
    if (!contractAppointmentPath) {
        return false;
    }
    let checkCode = '';
    if (Array.isArray(contractAppointmentPath)) {
        const [first] = contractAppointmentPath;
        checkCode = first;
        if (typeof first === 'object') {
            checkCode = first.value;
        }
    } else if (typeof contractAppointmentPath === 'string') {
        checkCode = contractAppointmentPath.substr(0, 2);
    }
    return checkCode === '01' || checkCode === '02';
};
// 显示品牌
function showBrand(props) {
    if (!props) {
        return false;
    }
    const talent = getTalent(props);
    // 是否是艺人
    const isActor = talent.talentId && Number(talent.talentType) === 0;
    // 是否是代言类/广告推广
    const isDaiyan = checkDY(props);
    return isActor && isDaiyan;
}

// 显示权重
function showWeight(props) {
    if (!props) {
        return false;
    }
    const { formData } = props.state;
    return formData.contractAppointmentWeight;
}
// 检测并获取受限的履约义务
const checkLimit = (formData, props) => {
    if (!props || !props.state) {
        return false;
    }
    const talent = getTalent(props);
    const { talentId, talentType } = talent;
    const { projectAppointments, contractAppointmentList } = formData;
    const { projectAppointmentId, no } = props.state.formData;
    // 合同关联的项目履约中，该艺人已填写的履约义务（过滤掉空数据即没有履约义务字段的）
    const talentProjectObligationList = (projectAppointments
            && projectAppointments.filter((item) => {
                return (
                    Number(item.projectAppointmentTalentId) === Number(talentId)
                    && Number(item.projectAppointmentTalentType) === Number(talentType)
                    && item.projectAppointmentPath
                );
            }))
        || [];
    // 合同的项目履约中，该艺人已填写的履约义务
    const talentContractObligationList = (contractAppointmentList
            && contractAppointmentList.filter((item) => {
                return (
                    Number(item.contractAppointmentTalentId) === Number(talentId)
                    && Number(item.contractAppointmentTalentType) === Number(talentType)
                    && item.contractAppointmentPath
                );
            }))
        || [];
    let flag = false;
    if (talentProjectObligationList.length > 0) {
        // 项目履约中该艺人拥有多于1条履约，则本次编辑履约受限
        if (talentProjectObligationList.length > 1) {
            flag = true;
        }
        // 项目履约中该艺人履约只有一条时
        if (talentProjectObligationList.length === 1) {
            // 合同履约中该艺人没有履约义务，表示本次编辑为新增，则本次编辑履约受限
            if (talentContractObligationList.length === 0) {
                flag = true;
            }
            // 合同履约中该艺人履约只有一条时
            if (talentContractObligationList.length === 1) {
                // 项目和合同中的履约为同一条时
                if (
                    talentProjectObligationList[0].projectAppointmentId
                    === talentContractObligationList[0].projectAppointmentId
                ) {
                    // 项目中履约的ID与本次编辑的履约ID不同，表示正在新增履约（本次编辑没有ID），则本次编辑履约受限
                    if (talentProjectObligationList[0].projectAppointmentId !== projectAppointmentId) {
                        flag = true;
                    }
                    // else为正在编辑项目中已有的唯一一条履约，可以更换履约，本次编辑不受限
                } else {
                    // 项目和合同中的履约不是同一条时，表示该艺人已有两条履约，则本次编辑履约受限
                    flag = true;
                }
            }
        }
    }
    if (talentContractObligationList.length > 0) {
        // 合同履约中该艺人拥有多于1条履约，则本次编辑履约受限
        if (talentContractObligationList.length > 1) {
            flag = true;
        }
        // 合同履约中该艺人履约只有一条时
        if (talentContractObligationList.length === 1) {
            // 项目履约中该艺人没有履约义务，表示该条履约为合同中新增的
            if (talentProjectObligationList.length === 0) {
                // 合同中履约的ID与本次编辑的履约ID不同，表示正在新增履约（本次编辑没有ID），则本次编辑履约受限
                if (talentContractObligationList[0].no !== no) {
                    flag = true;
                }
                // else为正在编辑合同中已有的唯一一条履约，可以更换履约，本次编辑不受限
            }
        }
    }
    if (flag) {
        return talentProjectObligationList[0] || talentContractObligationList[0];
    }
    return flag;
};
// 动态修改履约义务类型枚举
function getObligationList(formData, props) {
    if (!props) {
        return [];
    }
    const options = _.cloneDeep(CONTRACT_OBLIGATION_TYPE);
    // 当前表单数据
    const talent = getTalent(props);
    const { talentId, talentType } = talent;
    if (!talentId) {
        return [];
    }
    const limitObligation = checkLimit(formData, props);
    if (limitObligation) {
        const appointmentPath = limitObligation.contractAppointmentPath || limitObligation.projectAppointmentPath;
        if (appointmentPath) {
            const obligationType1 = appointmentPath.substr(0, 2);
            options.map((item) => {
                if (item.value !== obligationType1) {
                    item.disabled = true;
                }
            });
        }
    }
    options[1].children.map((item) => {
        if (Number(talentType) !== 1 && item.value === '0204') {
            item.disabled = true;
        }
    });
    return options;
}
const getDisabled = (projectAppointments, props) => {
    if (!props) {
        return false;
    }
    const { projectAppointmentId } = props.state.formData;
    // 项目中履约有执行进度、上线日期实际不允许编辑
    if (projectAppointmentId) {
        const originData = getDataFromList(projectAppointments, props);
        return Number(originData.projectAppointmentProgress) > 0 || originData.projectLiveTime;
    }
};
// 获取该条数据的原始值（projecting开头的字段为编辑值，对应的project开头的为详情原始值，在获取数据后transferData中处理）
const getDataFromList = (projectingAppointmentDTOList = [], props, params) => {
    // 无原列表
    if (!projectingAppointmentDTOList || projectingAppointmentDTOList.length === 0) {
        return;
    }
    // 当前formView未加载
    if (!props || !props.state) {
        return;
    }
    const form = props.state.formData;
    // 默认对比条件为id
    if (!params) {
        params = 'projectAppointmentId';
    }
    return projectingAppointmentDTOList.find((item) => {
        if (typeof params === 'string') {
            return String(item[params]) === String(form[params]);
        }
        if (Array.isArray(params)) {
            for (let i = 0; i < params.length; i += 1) {
                if (typeof params[i] !== 'string') {
                    return false;
                }
                if (String(item[params[i]]) !== String(form[params[i]])) {
                    return false;
                }
            }
            return true;
        }
    });
};
export const formatSelfCols = (obj, props) => {
    const formData = (obj && obj.formData) || {};
    const { projectAppointments } = formData;
    return [
        {
            columns: [
                [
                    {
                        label: '艺人/博主',
                        key: 'contractAppointmentTalentId',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '目标艺人或博主不能为空',
                                },
                            ],
                        },
                        componentAttr: {
                            request: () => {
                                return {
                                    success: true,
                                    data: {
                                        list: formData.contractBudgetList,
                                    },
                                };
                            },
                            fieldNames: {
                                value: (val) => {
                                    return `${val.talentId}_${val.talentType}`;
                                },
                                label: 'talentName',
                            },
                            onChange: changeTalent.bind(this, obj, props),
                            disabled: getDisabled(projectAppointments, props),
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.contractAppointmentTalentId = Number(value.value.split('_')[0]);
                            form.contractAppointmentTalentName = value.label;
                            form.contractAppointmentTalentType = Number(value.value.split('_')[1]);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (!value) return value;
                            if (value.value && value.label) {
                                return value;
                            }
                            return {
                                value: `${form.contractAppointmentTalentId}_${form.contractAppointmentTalentType}`,
                                label: form.contractAppointmentTalentName,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '履约义务',
                        key: 'contractAppointmentPath',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择最末级履约义务',
                                },
                            ],
                        },
                        type: 'cascader',
                        componentAttr: {
                            options: getObligationList(formData, props),
                            changeOnSelect: false,
                            placeholder: '请选择',
                            onChange: changeObligation.bind(this, obj, props),
                            disabled: getDisabled(projectAppointments, props),
                        },
                        getFormat: (value, form) => {
                            if (typeof value[value.length - 1] === 'string') {
                                // form回填未修改的数据
                                form.contractAppointmentPath = value[value.length - 1];
                                form.contractAppointmentName = getOptionPath(
                                    getLeafOptions(CONTRACT_OBLIGATION_TYPE),
                                    value[value.length - 1],
                                );
                            } else {
                                // 用户选择的数据
                                form.contractAppointmentPath = value[value.length - 1].value;
                                form.contractAppointmentName = value[value.length - 1].path;
                            }
                            return form;
                        },
                        setFormat: (value) => {
                            if (Array.isArray(value)) {
                                return value;
                            }
                            // form回填
                            const arr = value.match(/\d{2}/g);
                            return [arr[0], arr[0] + arr[1], value];
                        },
                    },
                ],
                [
                    {
                        label: '品牌',
                        key: 'contractAppointmentBrand',
                        placeholder: '请选择',
                        type: 'select',
                        options: CONTRACT_BRAND_TYPE,
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: showBrand(props),
                                    message: '请选择品牌',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value) {
                                            const talent = getTalent(props);
                                            const { talentId } = talent;
                                            if (talentId) {
                                                const limitObligation = checkLimit(formData, props);
                                                if (limitObligation) {
                                                    const brand = limitObligation.projectAppointmentBrand
                                                        || limitObligation.contractAppointmentBrand;
                                                    if (isNumber(brand) && String(brand) !== value) {
                                                        callback('同一艺人/博主的品牌类型须唯一');
                                                        return;
                                                    }
                                                }
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        disabled: !showBrand(props) || getDisabled(projectAppointments, props),
                        getFormat: (value, form) => {
                            form.contractAppointmentBrand = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '履约义务详情说明',
                        key: 'contractAppointmentDescription',
                        placeholder: '请输入',
                        componentAttr: {
                            maxLength: 40,
                            disabled: getDisabled(projectAppointments, props),
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入履约义务详情说明',
                                },
                            ],
                        },
                    },
                ],
                [
                    {
                        label: '起止日期',
                        key: 'contractAppointmentStart',
                        placeholder: ['起始日期', '终止日期'],
                        type: 'daterange',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择起止日期',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value.length !== 2) {
                                            callback('请选择完整的起止日期');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.contractAppointmentStart = value[0] && moment(value[0]).format(DATETIME_FORMAT);
                            form.contractAppointmentEnd = value[1] && moment(value[1]).format(DATETIME_FORMAT);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (Array.isArray(value)) {
                                return value;
                            }
                            if (form.contractAppointmentStart && form.contractAppointmentEnd) {
                                return [moment(form.contractAppointmentStart), moment(form.contractAppointmentEnd)];
                            }
                            return [moment(value)];
                        },
                    },
                ],
                [
                    {
                        label: '上线日期(预计)',
                        key: 'liveTimePlan',
                        type: 'date',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择上线日期(预计)',
                                },
                            ],
                        },
                        componentAttr: {
                            // disabled: getDisabled(props),
                        },
                        getFormat: (value, form) => {
                            form.liveTimePlan = moment(value).format(DATETIME_FORMAT);
                            return form;
                        },
                        setFormat: (value) => {
                            return moment(value);
                        },
                    },
                ],
                // [
                //     {
                //         label: '上线日期(实际)',
                //         key: 'liveTime',
                //         type: 'date',
                //         getFormat: (value, form) => {
                //             form.liveTime = value && moment(value).format(DATETIME_FORMAT);
                //             return form;
                //         },
                //         setFormat: (value) => {
                //             return moment(value);
                //         },
                //     },
                // ],
                [
                    (() => {
                        if (showWeight(props)) {
                            return {
                                label: '权重',
                                key: 'contractAppointmentWeight',
                                placeholder: '请输入',
                                type: 'inputNumber',
                                disabled: true,
                                componentAttr: {
                                    precision: 0,
                                    min: 0,
                                    max: 100,
                                    formatter: (value) => {
                                        return `${value}%`;
                                    },
                                    parser: (value) => {
                                        return value.replace('%', '');
                                    },
                                },
                            };
                        }
                        return {};
                    })(),
                ],
                [
                    {
                        label: '执行进度变更方式',
                        key: 'contractAppointmentProgressType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择执行进度变更方式',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: CONTRACT_PROGRESS_TYPE,
                        getFormat: (value, form) => {
                            form.contractAppointmentProgressType = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
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
