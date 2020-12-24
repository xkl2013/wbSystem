/* eslint-disable */
/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 * */
import _ from 'lodash';
import { message } from 'antd';
import moment from 'moment';
import { CONTRACT_OBLIGATION_TYPE, FEE_TYPE } from '@/utils/enum';
import { getProjectContractList, getProjectList } from '../../services';
import { getContractDetailNoAuth, getProjectDetailNoAuth, getDepartmentDetail } from '@/services/globalDetailApi';
import { getLeafOptions, getOptionPath } from '@/utils/utils';

import { getFeeType } from '@/services/dictionary';
import { DATE_FORMAT } from '@/utils/constants';

function changeProjectingName(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            applicationProjectName: values || undefined,
            applicationProjectCode: values ? values.projectingCode : undefined,
            applicationContractName: undefined, // 重置合同
            applicationActorBlogerName: undefined, // 重置艺人
            applicationDuty: undefined, // 重置履约义务
        }),
    );
}

async function changeContract(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    // 根据合同查艺人列表/艺人预估费用/艺人履约义务
    if (values && values.value) {
        const contractAppointmentList = await getContractDetailFn(values.value);
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                applicationContractName: values,
                applicationActorBlogerName: undefined, // 重置艺人
                applicationDuty: undefined, // 重置履约义务
                contractAppointmentList,
            }),
        );
    } else {
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                applicationContractName: values,
                applicationActorBlogerName: undefined, // 重置艺人
                applicationDuty: undefined, // 重置履约义务
                contractAppointmentList: [],
            }),
        );
    }
}

async function changeTalent(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    const contractId =
        (formData.applicationContractName && formData.applicationContractName.contractId) ||
        formData.applicationContractId;
    if (contractId) {
        const contractAppointmentList = await getContractDetailFn(contractId);
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                applicationActorBlogerName: values,
                applicationDuty: undefined, // 重置履约义务
                contractAppointmentList,
            }),
        );
    } else {
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                applicationActorBlogerName: values,
                applicationDuty: undefined, // 重置履约义务
                contractAppointmentList: [],
            }),
        );
    }
}

async function changeFeeType(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    const contractTalentBudgets = await getProjectTalent(props);
    if (!contractTalentBudgets || contractTalentBudgets.length === 0) {
        message.error('请先选择项目');
        props.formView.props.form.setFieldsValue({ applicationFeeType: undefined });
        return;
    }
    let type = '';
    switch (String(values)) {
        case '2':
        case '54':
            // 妆发及拍摄费
            type = contractTalentBudgets[0].makeupCostType;
            break;
        case '3':
            // 居间费
            type = contractTalentBudgets[0].intermediaryCostType;
            break;
        case '12':
        case '13':
        case '14':
        case '15':
        case '16':
        case '17':
            // 差旅费
            type = contractTalentBudgets[0].tripCostType;
            break;
        case '30':
            // 业务招待费
            type = contractTalentBudgets[0].invitationCostType;
            break;
        case '33':
            // 制作费
            type = contractTalentBudgets[0].makeCostType;
            break;
        default:
            // 其他费用
            type = contractTalentBudgets[0].otherCostType;
            break;
    }
    const contractId =
        (formData.applicationContractName && formData.applicationContractName.contractId) ||
        formData.applicationContractId;
    if (contractId) {
        const contractAppointmentList = await getContractDetailFn(contractId);
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                applicationFeeType: values,
                applicationFeeAggreeTakerId: type, // 约定费用承担方默认为项目中艺人预估费用类型
                applicationFeeTrulyTakerId: type, // 费用实际承担方默认为项目中艺人预估费用类型
                applicationDuty: undefined, // 重置履约义务
                contractAppointmentList,
            }),
        );
    } else {
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                applicationFeeType: values,
                applicationFeeAggreeTakerId: type, // 约定费用承担方默认为项目中艺人预估费用类型
                applicationFeeTrulyTakerId: type, // 费用实际承担方默认为项目中艺人预估费用类型
                applicationDuty: undefined, // 重置履约义务
                contractAppointmentList: [],
            }),
        );
    }
}

function changeDuty(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            applicationDuty: values,
        }),
    );
}

async function getContractDetailFn(id) {
    const response = await getContractDetailNoAuth(id);
    if (response && response.success && response.data) {
        const { contractAppointmentList } = response.data;
        return contractAppointmentList || [];
    }
}

// 显示履约义务
function showDuty(props) {
    if (!props) {
        return false;
    }
    const { formData } = props.state;
    if (formData.applicationDuty) {
        return true;
    }
    const talentId =
        (formData.applicationActorBlogerName &&
            formData.applicationActorBlogerName.value &&
            formData.applicationActorBlogerName.value.split('_')[0]) ||
        formData.applicationActorBlogerId;
    const talentType =
        (formData.applicationActorBlogerName &&
            formData.applicationActorBlogerName.value &&
            formData.applicationActorBlogerName.value.split('_')[1]) ||
        formData.applicationActorBlogerType;
    if (!talentId) {
        return false;
    }
    const applicationFeeType =
        formData.applicationFeeType && (formData.applicationFeeType == 2 || formData.applicationFeeType == 54);
    if (!applicationFeeType) {
        return false;
    }
    let contractAppointmentList = formData.contractAppointmentList || [];
    contractAppointmentList = contractAppointmentList.filter((item) => {
        return item.contractAppointmentTalentId == talentId && item.contractAppointmentTalentType == talentType;
    });
    contractAppointmentList = _.uniqBy(contractAppointmentList, 'contractAppointmentPath');
    // 有合同且费用类型为妆发费
    return contractAppointmentList.length > 0;
}

// 根据项目id获取合同信息
async function getProjectContract(props) {
    if (!props) {
        return [];
    }
    const { formData } = props.state;
    const projectId =
        (formData.applicationProjectName && formData.applicationProjectName.value) || formData.applicationProjectId;
    if (!projectId) {
        return [];
    }
    const response = await getProjectContractList(projectId, { pageNum: 1, pageSize: 50 });
    if (response && response.success && response.data) {
        const { list } = response.data;
        return (list && list.length > 0 && list) || [{ contractName: '无合同', contractId: 0 }];
    }
}

// 根据项目id获取艺人信息
async function getProjectTalent(props) {
    if (!props) {
        return [];
    }
    const { formData } = props.state;
    const contractId =
        (formData.applicationContractName && formData.applicationContractName.contractId) ||
        formData.applicationContractId;
    if (contractId) {
        const response = await getContractDetailNoAuth(contractId);
        if (response && response.success && response.data) {
            let {
                contractTalentDivideList,
                contractBudgetList,
                contractAppointmentList,
                contract: { contractType },
            } = response.data;
            if (Number(contractType) === 4) {
                return contractAppointmentList.map((p) => {
                    return {
                        talentId: p.contractAppointmentTalentId,
                        talentName: p.contractAppointmentTalentName,
                        talentType: p.contractAppointmentTalentType,
                    };
                });
            }
            const result = _.uniqBy(contractTalentDivideList, (item) => {
                return `${item.talentId}_${item.talentType}`;
            });
            contractBudgetList = contractBudgetList.filter((item) => {
                return result.some((temp) => {
                    return temp.talentId == item.talentId && temp.talentType == item.talentType;
                });
            });
            return contractBudgetList || [];
        }
    }

    const projectId =
        (formData.applicationProjectName && formData.applicationProjectName.value) || formData.applicationProjectId;
    if (projectId) {
        const response = await getProjectDetailNoAuth(projectId);
        if (response && response.success && response.data) {
            const {
                projectedBudgets,
                projectAppointments,
                project: { projectingType },
            } = response.data;
            if (Number(projectingType) === 4) {
                return projectAppointments.map((p) => {
                    return {
                        talentId: p.projectAppointmentTalentId,
                        talentName: p.projectAppointmentTalentName,
                        talentType: p.projectAppointmentTalentType,
                    };
                });
            }
            return projectedBudgets || [];
        }
    }
    return [];
}

// 根据合同id获取合同履约义务
async function getContractAppointmentList(props) {
    if (!props) {
        return [];
    }
    const { formData } = props.state;
    const contractId =
        (formData.applicationContractName && formData.applicationContractName.contractId) ||
        formData.applicationContractId;
    if (!contractId) {
        return [];
    }
    const response = await getContractDetailNoAuth(contractId);
    if (response && response.success && response.data) {
        let { contractAppointmentList } = response.data;
        const talentId =
            (formData.applicationActorBlogerName &&
                formData.applicationActorBlogerName.value &&
                formData.applicationActorBlogerName.value.split('_')[0]) ||
            formData.applicationActorBlogerId;
        const talentType =
            (formData.applicationActorBlogerName &&
                formData.applicationActorBlogerName.value &&
                formData.applicationActorBlogerName.value.split('_')[1]) ||
            formData.applicationActorBlogerType;
        contractAppointmentList = contractAppointmentList.filter((item) => {
            return item.contractAppointmentTalentId == talentId && item.contractAppointmentTalentType == talentType;
        });
        contractAppointmentList = _.uniqBy(contractAppointmentList, 'contractAppointmentPath');
        return contractAppointmentList || [];
    }
}

async function changeFeeTakerDep(obj, props, value) {
    if (value === undefined) {
        return;
    }
    const response = await getDepartmentDetail(value.value);
    if (response && response.success && response.data) {
        const { departmentCode } = response.data;
        props.changeSelfState({
            applicationFeeTakerDeptId: value,
            applicationFeeTakerMainCode: departmentCode,
        });
    }
}

export const formatSelfCols = (obj, props) => {
    return [
        {
            columns: [
                [
                    {
                        label: '项目',
                        key: 'applicationProjectName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择项目名称',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return getProjectList({
                                    projectName: val,
                                    pageSize: 50,
                                    pageNum: 1,
                                    projectBaseType: 1,
                                    endStatusList: [0, 2],
                                    projectingStateList: [0, 1], // 项目进展未终止
                                });
                            },
                            fieldNames: { value: 'projectingId', label: 'projectingName' },
                            allowClear: true,
                            onChange: changeProjectingName.bind(this, obj, props),
                            initDataType: 'onfocus',
                        },
                        getFormat: (value, form) => {
                            form.applicationProjectId = value.value;
                            form.applicationProjectName = value.label;
                            form.applicationProjectType = 2;
                            form.applicationProjectCode = props.state.formData.applicationProjectCode;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.applicationProjectName,
                                value: form.applicationProjectId,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '合同',
                        key: 'applicationContractName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择合同',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            request: async () => {
                                const list = await getProjectContract(props);
                                return {
                                    success: true,
                                    data: {
                                        list,
                                    },
                                };
                            },
                            fieldNames: { value: 'contractId', label: 'contractName' },
                            allowClear: true,
                            onChange: changeContract.bind(this, obj, props),
                            initDataType: 'onfocus',
                        },
                        getFormat: (value, form) => {
                            form.applicationContractId = value.value;
                            form.applicationContractCode =
                                value.contractCode || props.state.formData.applicationContractCode;
                            form.applicationContractName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.applicationContractName,
                                value: form.applicationContractId,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '艺人/博主',
                        key: 'applicationActorBlogerName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择类型',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        componentAttr: {
                            request: async () => {
                                const list = await getProjectTalent(props);
                                return {
                                    success: true,
                                    data: {
                                        list,
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
                            initDataType: 'onfocus',
                        },
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.applicationActorBlogerId = Number(value.value.split('_')[0]);
                            form.applicationActorBlogerName = value.label;
                            form.applicationActorBlogerType = Number(value.value.split('_')[1]);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value: `${form.applicationActorBlogerId}_${form.applicationActorBlogerType}`,
                                label: form.applicationActorBlogerName,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '费用类型',
                        key: 'applicationFeeType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择费用类型',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return getFeeType({ value: val });
                            },
                            fieldNames: { value: 'index', label: 'value' },
                            onChange: changeFeeType.bind(this, obj, props),
                        },
                        getFormat: (value, form) => {
                            form.applicationFeeType = value.value;
                            form.applicationFeeTypeName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value,
                                label: form.applicationFeeTypeName || undefined,
                            };
                        },
                    },
                ],
                [
                    (() => {
                        if (showDuty(props)) {
                            return {
                                label: '履约义务',
                                key: 'applicationDuty',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择履约义务',
                                        },
                                    ],
                                },
                                placeholder: '请选择',
                                componentAttr: {
                                    request: async () => {
                                        const list = await getContractAppointmentList(props);
                                        return {
                                            success: true,
                                            data: {
                                                list,
                                            },
                                        };
                                    },
                                    fieldNames: {
                                        value: 'contractAppointmentPath',
                                        label: 'contractAppointmentName',
                                    },
                                    initDataType: 'onfocus',
                                    onChange: changeDuty.bind(this, obj, props),
                                },
                                type: 'associationSearch',
                                getFormat: (value, form) => {
                                    form.applicationDuty = value.value;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        value,
                                        label: getOptionPath(getLeafOptions(CONTRACT_OBLIGATION_TYPE), value),
                                    };
                                },
                            };
                        }
                        return [];
                    })(),
                ],
                [
                    {
                        label: '约定费用承担方',
                        key: 'applicationFeeAggreeTakerId',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择约定费用承担方',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: FEE_TYPE,
                        // disabled: true,
                        getFormat: (value, form) => {
                            form.applicationFeeAggreeTakerId = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '费用实际承担方',
                        key: 'applicationFeeTrulyTakerId',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择费用实际承担方',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: FEE_TYPE,
                        getFormat: (value, form) => {
                            form.applicationFeeTrulyTakerId = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '费用承担部门',
                        key: 'applicationFeeTakerDeptId',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择费用承担部门',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'orgtree',
                        componentAttr: {
                            onChange: changeFeeTakerDep.bind(this, obj, props),
                            disabled: obj && obj.formData.reimburseSource == 2,
                        },
                        getFormat: (value, form) => {
                            form.applicationFeeTakerDeptId = value.value;
                            form.applicationFeeTakerDeptName = value.label;
                            form.applicationFeeTakerMainCode = props.state.formData.applicationFeeTakerMainCode;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.applicationFeeTakerDeptName,
                                value: form.applicationFeeTakerDeptId,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '申请金额',
                        key: 'applicationFeeApply',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入申请金额',
                                },
                            ],
                        },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 99999999,
                            // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                        },
                        placeholder: '请输入',
                        type: 'inputNumber',
                    },
                ],
                [
                    {
                        label: '备注',
                        key: 'applicationFeeRemark',
                        checkOption: {
                            rules: [
                                // {
                                //     required: true,
                                //     message: '请输入备注',
                                // },
                                {
                                    max: 140,
                                    message: '至多输入140个字',
                                },
                            ],
                        },
                        type: 'textarea',
                        componentAttr: {
                            placeholder: '请输入',
                            rows: 3,
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
