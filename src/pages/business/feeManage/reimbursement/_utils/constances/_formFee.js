/* eslint-disable */
/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 **/

import { FEE_TYPE, REIMBURSE_INVOICE_TYPE, REIMBURSE_TAX_RATE, CONTRACT_OBLIGATION_TYPE } from '@/utils/enum';
import _ from 'lodash';
import {
    getCompanyDetail,
    getContractDetailNoAuth,
    getProjectDetailNoAuth,
    getDepartmentDetail,
    getOutWork,
} from '@/services/globalDetailApi';
import { getCompanyList } from '@/services/globalSearchApi';
import { getProjectContractList, getProjectList } from '@/pages/business/feeManage/apply/services';
import { accAdd, accSub } from '@/utils/calculate';
import { getOptionPath, getLeafOptions } from '@/utils/utils';
import { message } from 'antd';
import { getFeeType } from '@/services/dictionary';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/constants';
import { FEESCENE } from '@/utils/enum';

function changeNoTaxFeeByTax(obj, props, value) {
    const form = props.formView.props.form.getFieldsValue();
    let reimburseNoTaxFee = undefined;
    if (form.reimburseIncludeTaxFee) {
        reimburseNoTaxFee = Number(Number(form.reimburseIncludeTaxFee) - Number(value)).toFixed(2);
    }
    props.formView.props.form.setFieldsValue({
        reimburseNoTaxFee,
    });
}

function changeNoTaxFeeByInclude(obj, props, value) {
    const form = props.formView.props.form.getFieldsValue();
    let reimburseNoTaxFee = undefined;
    if (form.reimburseTax) {
        reimburseNoTaxFee = Number(Number(value) - Number(form.reimburseTax)).toFixed(2);
    }
    props.formView.props.form.setFieldsValue({
        reimburseNoTaxFee,
    });
}

//更换项目
async function changeProjectingName(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            reimburseProjectName: values ? values : undefined,
            reimburseProjectCode: values ? values.projectingCode : undefined,
            reimburseContractName: undefined, //清空合同
            reimburseActorBlogerName: undefined, //清空艺人
            reimburseDuty: undefined, //清空履约义务
        }),
    );
}
//更换外勤记录
function changeOutOffice(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            outOfficeName: values,
        }),
    );
}

//更换费用场景
function changeFeeScene(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            reimburseFeeScene: values,
        }),
    );
}

//更换合同
async function changeContract(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    if (values && values.value) {
        let contractAppointmentList = await getContractDetailFn(values.value);
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                reimburseContractName: values,
                reimburseActorBlogerName: undefined, //清空艺人
                reimburseDuty: undefined, //清空履约义务
                contractAppointmentList,
            }),
        );
    } else {
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                reimburseContractName: values,
                reimburseActorBlogerName: undefined, //清空艺人
                reimburseDuty: undefined, //清空履约义务
                contractAppointmentList: undefined,
            }),
        );
    }
}

//更换艺人
async function changeTalent(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    let contractId =
        (formData.reimburseContractName && formData.reimburseContractName.contractId) || formData.reimburseContractId;
    if (contractId) {
        let contractAppointmentList = await getContractDetailFn(contractId);
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                reimburseActorBlogerName: values,
                reimburseDuty: undefined, //清空履约义务
                contractAppointmentList,
            }),
        );
    } else {
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                reimburseActorBlogerName: values,
                reimburseDuty: undefined, //清空履约义务
                contractAppointmentList: [],
            }),
        );
    }
}

//更换费用类型
async function changeFeeType(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    let talentBudgetsList = await getProjectTalent(props);
    if (!talentBudgetsList || talentBudgetsList.length === 0) {
        message.error('请先选择项目');
        props.formView.props.form.setFieldsValue({ reimburseFeeType: undefined });
        return;
    }
    let type = '';
    switch (String(values)) {
        case '2':
        case '54':
            //妆发及拍摄费
            type = talentBudgetsList[0].makeupCostType;
            break;
        case '3':
            //居间费
            type = talentBudgetsList[0].intermediaryCostType;
            break;
        case '12':
        case '13':
        case '14':
        case '15':
        case '16':
        case '17':
            //差旅费
            type = talentBudgetsList[0].tripCostType;
            break;
        case '30':
            //业务招待费
            type = talentBudgetsList[0].invitationCostType;
            break;
        case '33':
            //制作费
            type = talentBudgetsList[0].makeCostType;
            break;
        default:
            //其他费用
            type = talentBudgetsList[0].otherCostType;
            break;
    }
    let contractId =
        (formData.reimburseContractName && formData.reimburseContractName.contractId) || formData.reimburseContractId;
    if (contractId) {
        let contractAppointmentList = await getContractDetailFn(contractId);
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                reimburseFeeType: values,
                reimburseFeeAggreeTakerId: type, //约定费用承担方默认为项目中艺人预估费用类型
                reimburseFeeTrulyTakerId: type, //费用实际承担方默认为项目中艺人预估费用类型
                reimburseDuty: undefined, //重置履约义务
                contractAppointmentList,
            }),
        );
    } else {
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, formData, form, {
                reimburseFeeType: values,
                reimburseFeeAggreeTakerId: type, //约定费用承担方默认为项目中艺人预估费用类型
                reimburseFeeTrulyTakerId: type, //费用实际承担方默认为项目中艺人预估费用类型
                reimburseDuty: undefined, //重置履约义务
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
            reimburseDuty: values,
        }),
    );
}

async function getContractDetailFn(id) {
    let response = await getContractDetailNoAuth(id);
    if (response && response.success && response.data) {
        let { contractAppointmentList } = response.data;
        return contractAppointmentList || [];
    }
}

//显示履约义务
function showDuty(props) {
    if (!props) {
        return false;
    }
    const { formData } = props.state;
    if (formData.reimburseDuty) {
        return true;
    }
    let talentId =
        (formData.reimburseActorBlogerName &&
            formData.reimburseActorBlogerName.value &&
            formData.reimburseActorBlogerName.value.split('_')[0]) ||
        formData.reimburseActorBlogerId;
    let talentType =
        (formData.reimburseActorBlogerName &&
            formData.reimburseActorBlogerName.value &&
            formData.reimburseActorBlogerName.value.split('_')[1]) ||
        formData.reimburseActorBlogerType;
    if (!talentId) {
        return false;
    }
    let reimburseFeeType =
        formData.reimburseFeeType && (formData.reimburseFeeType == 2 || formData.reimburseFeeType == 54);
    if (!reimburseFeeType) {
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

//更换发票类型
function changeInvoiceType(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            reimburseInvoiceType: values,
            reimburseTaxRate: undefined,
            reimburseNoTaxFee: undefined,
            reimburseTax: undefined,
        }),
    );
}

//检测发票类型
function checkInvoiceType(props) {
    if (!props) {
        return true;
    }
    const form = props.formView && props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    return formData.reimburseInvoiceType == 2 || (form && form.reimburseInvoiceType == 2);
}

//更改申请报销金额
function changeFeeApply(obj, props, values) {
    const { formData } = props.state;
    let reimbursePayApply = values;
    if (obj.formData.reimburseSource == 2) {
        let total = obj.formData.reimburseFeePushDown;
        let flag = total > 0 ? true : false;
        let reimburseFeeApplyNor = 0;
        obj.formData.reimburseNormals.map((item, i) => {
            if (!item.index) {
                if (flag) {
                    total = total - item.reimburseFeeApply;
                    if (total <= 0) {
                        flag = false;
                    }
                    item.reimbursePayApply = total >= 0 ? 0 : -total;
                } else {
                    item.reimbursePayApply = item.reimburseFeeApply;
                }
                reimburseFeeApplyNor = accAdd(reimburseFeeApplyNor, item.reimbursePayApply);
            }
            return item;
        });
        //修改项目费用时，日常明细总计需单独更改
        if (obj.formData.reimburseNormals.length > 0) {
            obj.formData.reimburseNormals[
                obj.formData.reimburseNormals.length - 1
            ].reimbursePayApply = reimburseFeeApplyNor;
        }
        let index = obj.formData.reimburseProjects.findIndex((item) => item.key === formData.key);
        obj.formData.reimburseProjects.map((item, i) => {
            if (!item.index) {
                if (flag) {
                    total = total - (index === i ? values : item.reimburseFeeApply);
                    if (total <= 0) {
                        flag = false;
                    }
                    item.reimbursePayApply = total >= 0 ? 0 : -total;
                    if (index === i) {
                        reimbursePayApply = item.reimbursePayApply;
                    }
                } else {
                    item.reimbursePayApply = item.reimburseFeeApply;
                }
            }
            return item;
        });
        if (index === -1) {
            if (flag) {
                total = total - values;
                if (total <= 0) {
                    flag = false;
                }
                reimbursePayApply = total >= 0 ? 0 : -total;
            } else {
                reimbursePayApply = values;
            }
        }
    }
    props.formView.props.form.setFieldsValue({
        reimburseFeeApply: values,
        reimbursePayApply,
        reimburseIncludeTaxFee: values,
    });
    changeNoTaxFeeByInclude(obj, props, values);
}

//根据项目id获取合同信息
async function getProjectContract(props) {
    if (!props) {
        return [];
    }
    const { formData } = props.state;
    let projectId =
        (formData.reimburseProjectName && formData.reimburseProjectName.value) || formData.reimburseProjectId;
    if (!projectId) {
        return [];
    }
    let response = await getProjectContractList(projectId, { pageNum: 1, pageSize: 50 });
    if (response && response.success && response.data) {
        const { list } = response.data;
        return (list && list.length > 0 && list) || [{ contractName: '无合同', contractId: 0 }];
    }
}

//根据项目id获取艺人信息
async function getProjectTalent(props) {
    if (!props) {
        return [];
    }
    const { formData } = props.state;
    let contractId =
        (formData.reimburseContractName && formData.reimburseContractName.contractId) || formData.reimburseContractId;
    if (contractId) {
        let response = await getContractDetailNoAuth(contractId);
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
            let result = _.uniqBy(contractTalentDivideList, (item) => item.talentId + '_' + item.talentType);
            contractBudgetList = contractBudgetList.filter((item) =>
                result.some((temp) => temp.talentId == item.talentId && temp.talentType == item.talentType),
            );
            return contractBudgetList || [];
        }
    }

    let projectId =
        (formData.reimburseProjectName && formData.reimburseProjectName.value) || formData.reimburseProjectId;
    if (projectId) {
        let response = await getProjectDetailNoAuth(projectId);
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

//根据合同id获取合同履约义务
async function getContractAppointmentList(props) {
    if (!props) {
        return [];
    }
    const { formData } = props.state;
    let contractId =
        (formData.reimburseContractName && formData.reimburseContractName.contractId) || formData.reimburseContractId;
    if (!contractId) {
        return [];
    }
    let response = await getContractDetailNoAuth(contractId);
    if (response && response.success && response.data) {
        let { contractAppointmentList } = response.data;
        let talentId =
            (formData.reimburseActorBlogerName &&
                formData.reimburseActorBlogerName.value &&
                formData.reimburseActorBlogerName.value.split('_')[0]) ||
            formData.reimburseActorBlogerId;
        let talentType =
            (formData.reimburseActorBlogerName &&
                formData.reimburseActorBlogerName.value &&
                formData.reimburseActorBlogerName.value.split('_')[1]) ||
            formData.reimburseActorBlogerType;
        contractAppointmentList = contractAppointmentList.filter((item) => {
            return item.contractAppointmentTalentId == talentId && item.contractAppointmentTalentType == talentType;
        });
        contractAppointmentList = _.uniqBy(contractAppointmentList, 'contractAppointmentPath');
        return contractAppointmentList || [];
    }
}

function changeIncludeTaxFee(obj, props, value) {
    const form = props.formView.props.form.getFieldsValue();
    let reimburseTax = undefined;
    let reimburseNoTaxFee = undefined;
    if (value != undefined && form.reimburseTaxRate) {
        let rate = Number(form.reimburseTaxRate);
        reimburseTax = ((Number(value) * rate) / (1 + rate)).toFixed(2);
        reimburseNoTaxFee = (Number(value) - reimburseTax).toFixed(2);
    }
    props.formView.props.form.setFieldsValue({
        // reimburseTax,
        reimburseNoTaxFee,
    });
}

function changeTaxRate(obj, props, e) {
    const form = props.formView.props.form.getFieldsValue();
    let reimburseTax = undefined;
    let reimburseNoTaxFee = undefined;
    if (e != undefined && form.reimburseIncludeTaxFee) {
        let rate = Number(e);
        reimburseTax = ((Number(form.reimburseIncludeTaxFee) * rate) / (1 + rate)).toFixed(2);
        reimburseNoTaxFee = (Number(form.reimburseIncludeTaxFee) - reimburseTax).toFixed(2);
    }
    props.formView.props.form.setFieldsValue({
        // reimburseTax,
        reimburseNoTaxFee,
    });
}

async function changeInvoiceCompany(obj, props, value) {
    let response = await getCompanyDetail(value.value);
    if (response && response.success && response.data) {
        const { company } = response.data;
        props.changeSelfState({
            reimburseInvoiceCompanyName: value,
            reimburseInvoiceCompanyCode: company.companyCode,
        });
    }
}

async function changeFeeTakerDep(obj, props, value) {
    if (value === undefined) {
        return;
    }
    let response = await getDepartmentDetail(value.value);
    if (response && response.success && response.data) {
        const { departmentCode } = response.data;
        props.changeSelfState({
            reimburseFeeTakerDeptId: value,
            reimburseFeeTakerDeptCode: departmentCode,
        });
    }
}

export const formatSelfCols = (obj, props) => [
    {
        columns: [
            [
                {
                    label: '项目',
                    key: 'reimburseProjectName',
                    checkOption: {
                        rules: [
                            {
                                required: true,
                                message: '请选择项目',
                            },
                        ],
                    },
                    placeholder: '请选择',
                    type: 'associationSearch',
                    componentAttr: {
                        request: (val) =>
                            getProjectList({
                                projectName: val,
                                pageSize: 50,
                                pageNum: 1,
                                projectBaseType: 1, // 立项项目
                                endStatusList: [0, 2], // 未结案
                                projectingStateList: [0, 1], // 项目进展未终止
                            }),
                        fieldNames: { value: 'projectingId', label: 'projectingName' },
                        allowClear: true,
                        onChange: changeProjectingName.bind(this, obj, props),
                        initDataType: 'onfocus',
                    },
                    getFormat: (value, form) => {
                        form.reimburseProjectId = value.value;
                        form.reimburseProjectName = value.label;
                        form.reimburseProjectType = 2;
                        form.reimburseProjectCode = props.state.formData.reimburseProjectCode;
                        return form;
                    },
                    setFormat: (value, form) => {
                        if (value.label || value.value || value.value === 0) {
                            return value;
                        }
                        return { label: form.reimburseProjectName, value: form.reimburseProjectId };
                    },
                },
            ],
            [
                {
                    label: '合同',
                    key: 'reimburseContractName',
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
                            let list = await getProjectContract(props);
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
                        form.reimburseContractId = value.value;
                        form.reimburseContractCode = value.contractCode || props.state.formData.reimburseContractCode;
                        form.reimburseContractName = value.label;
                        return form;
                    },
                    setFormat: (value, form) => {
                        if (value.label || value.value || value.value === 0) {
                            return value;
                        }
                        return {
                            label: form.reimburseContractName,
                            value: form.reimburseContractId,
                        };
                    },
                },
            ],
            [
                {
                    label: '艺人/博主',
                    key: 'reimburseActorBlogerName',
                    checkOption: {
                        rules: [
                            {
                                required: true,
                                message: '请选择艺人/博主',
                            },
                        ],
                    },
                    placeholder: '请选择',
                    componentAttr: {
                        request: async () => {
                            let list = await getProjectTalent(props);
                            return {
                                success: true,
                                data: {
                                    list,
                                },
                            };
                        },
                        fieldNames: {
                            value: (val) => `${val.talentId}_${val.talentType}`,
                            label: 'talentName',
                        },
                        onChange: changeTalent.bind(this, obj, props),
                        initDataType: 'onfocus',
                    },
                    type: 'associationSearch',
                    getFormat: (value, form) => {
                        form.reimburseActorBlogerId = Number(value.value.split('_')[0]);
                        form.reimburseActorBlogerName = value.label;
                        form.reimburseActorBlogerType = Number(value.value.split('_')[1]);
                        return form;
                    },
                    setFormat: (value, form) => {
                        if (value.label || value.value || value.value === 0) {
                            return value;
                        }
                        return {
                            value: `${form.reimburseActorBlogerId}_${form.reimburseActorBlogerType}`,
                            label: form.reimburseActorBlogerName,
                        };
                    },
                },
            ],
            [
                {
                    label: '费用类型',
                    key: 'reimburseFeeType',
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
                        request: (val) => getFeeType({ value: val }),
                        fieldNames: { value: 'index', label: 'value' },
                        onChange: changeFeeType.bind(this, obj, props),
                    },
                    getFormat: (value, form) => {
                        // debugger;
                        if (
                            Number(value.value) !== 26 &&
                            Number(value.value) !== 30 &&
                            Number(value.value) !== 99 &&
                            Number(value.value) !== 108 &&
                            Number(value.value) !== 73
                        ) {
                            form.reimburseFeeActualTime = null;
                        }
                        if (Number(value.value) !== 18) {
                            form.reimburseFeeScene = null;
                            form.outOfficeName = null;
                            form.outOfficeId = null;
                        }
                        form.reimburseFeeType = value.value;
                        form.reimburseFeeTypeName = value.label;
                        return form;
                    },
                    setFormat: (value, form) => {
                        if (value.label || value.value || value.value === 0) {
                            return value;
                        }
                        return {
                            value: value,
                            label: form.reimburseFeeTypeName || undefined,
                        };
                    },
                },
            ],
            [
                (() => {
                    const feeActualTimeStatus = props.state.formData.reimburseFeeType;
                    if (
                        feeActualTimeStatus &&
                        (feeActualTimeStatus === 18 ||
                            feeActualTimeStatus.key === 18 ||
                            feeActualTimeStatus.value === 18)
                    ) {
                        return {
                            label: '费用场景',
                            key: 'reimburseFeeScene',
                            checkOption: {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择费用场景',
                                    },
                                ],
                            },
                            placeholder: '请选择费用场景',
                            type: 'select',
                            options: FEESCENE,
                            componentAttr: {
                                onChange: changeFeeScene.bind(this, obj, props),
                            },
                            getFormat: (value, form) => {
                                if (Number(value) === 1) {
                                    form.outOfficeName = null;
                                    form.outOfficeId = null;
                                }
                                form.reimburseFeeScene = Number(value);
                                return form;
                            },
                            setFormat: (value, form) => {
                                return String(value);
                            },
                        };
                    }
                    return [];
                })(),
            ],
            [
                (() => {
                    const reimburseFeeScene = props.state.formData.reimburseFeeScene;
                    const feeActualTimeStatus = props.state.formData.reimburseFeeType;
                    if (
                        feeActualTimeStatus &&
                        (feeActualTimeStatus === 18 ||
                            feeActualTimeStatus.key === 18 ||
                            feeActualTimeStatus.value === 18) &&
                        Number(reimburseFeeScene) === 2
                    ) {
                        return {
                            label: '外勤记录',
                            key: 'outOfficeName',
                            // checkOption: {
                            //     rules: [
                            //         {
                            //             required: true,
                            //             message: '请选择外勤记录',
                            //         },
                            //     ],
                            // },
                            placeholder: '请选择外勤记录',
                            type: 'associationSearch',
                            options: [],
                            componentAttr: {
                                request: (val) => getOutWork({ value: val }),
                                fieldNames: { value: 'id', label: 'name' },
                                onChange: changeOutOffice.bind(this, obj, props),
                            },
                            getFormat: (value, form) => {
                                form.outOfficeName = value.label;
                                form.outOfficeId = value.value;
                                return form;
                            },
                            setFormat: (value, form) => {
                                if (value.label || value.value || value.value === 0) {
                                    return value;
                                }
                                return {
                                    value: form.outOfficeId,
                                    label: form.outOfficeName,
                                };
                            },
                        };
                    }
                    return [];
                })(),
            ],
            [
                (() => {
                    const feeActualTimeStatus = props.state.formData.reimburseFeeType;
                    if (
                        feeActualTimeStatus &&
                        (feeActualTimeStatus === 26 ||
                            feeActualTimeStatus === 30 ||
                            feeActualTimeStatus === 99 ||
                            feeActualTimeStatus === 108 ||
                            feeActualTimeStatus === 73 ||
                            feeActualTimeStatus.key === 26 ||
                            feeActualTimeStatus.key === 30 ||
                            feeActualTimeStatus.key === 99 ||
                            feeActualTimeStatus.key === 108 ||
                            feeActualTimeStatus.key === 73)
                    ) {
                        return {
                            label: '实际发生日期',
                            key: 'reimburseFeeActualTime',
                            checkOption: {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择实际发生日期',
                                    },
                                ],
                            },
                            placeholder: '请选择实际发生日期',
                            type: 'date',
                            getFormat: (value, form) => {
                                form.reimburseFeeActualTime = moment(value).format(DATE_FORMAT);
                                return form;
                            },
                            setFormat: (value, form) => {
                                return moment(value);
                            },
                        };
                    }
                    return [];
                })(),
            ],
            [
                (() => {
                    if (showDuty(props)) {
                        return {
                            label: '履约义务',
                            key: 'reimburseDuty',
                            checkOption: {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择最末级履约义务',
                                    },
                                ],
                            },
                            placeholder: '请选择',
                            componentAttr: {
                                request: async () => {
                                    let list = await getContractAppointmentList(props);
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
                                form.reimburseDuty = value.value;
                                return form;
                            },
                            setFormat: (value, form) => {
                                if (value.label || value.value || value.value === 0) {
                                    return value;
                                }
                                return {
                                    value: value,
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
                    key: 'reimburseFeeAggreeTakerId',
                    disabled: true,
                    placeholder: '请选择',
                    type: 'select',
                    options: FEE_TYPE,
                    getFormat: (value, form) => {
                        form.reimburseFeeAggreeTakerId = Number(value);
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
                    key: 'reimburseFeeTrulyTakerId',
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
                        form.reimburseFeeTrulyTakerId = Number(value);
                        return form;
                    },
                    setFormat: (value) => {
                        return String(value);
                    },
                    // disabled: obj && obj.formData.reimburseSource == 2,
                },
            ],
            [
                {
                    label: '费用承担部门',
                    key: 'reimburseFeeTakerDeptId',
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
                        // disabled: obj && obj.formData.reimburseSource == 2,
                    },
                    getFormat: (value, form) => {
                        form.reimburseFeeTakerDeptId = value.value;
                        form.reimburseFeeTakerDeptName = value.label;
                        form.reimburseFeeTakerDeptCode = props.state.formData.reimburseFeeTakerDeptCode;
                        return form;
                    },
                    setFormat: (value, form) => {
                        if (value.label || value.value || value.value === 0) {
                            return value;
                        }
                        return {
                            label: form.reimburseFeeTakerDeptName,
                            value: form.reimburseFeeTakerDeptId,
                        };
                    },
                },
            ],
            [
                {
                    label: '申请报销金额',
                    key: 'reimburseFeeApply',
                    checkOption: {
                        rules: [
                            {
                                required: true,
                                message: '请输入申请报销金额',
                            },
                        ],
                    },
                    componentAttr: {
                        precision: 2,
                        min: 0,
                        max: 99999999,
                        // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                        onChange: changeFeeApply.bind(this, obj, props),
                    },
                    placeholder: '请输入',
                    type: 'inputNumber',
                },
            ],
            [
                {
                    label: '申请付款金额',
                    key: 'reimbursePayApply',
                    disabled: true,
                    componentAttr: {
                        precision: 2,
                        // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                    },
                    placeholder: '请输入',
                    type: 'inputNumber',
                },
            ],
            // [
            //   {
            //     label: '发票主体', key: 'reimburseInvoiceCompanyName', checkOption: {
            //       rules: [{
            //         required: true,
            //         message: '请选择发票主体'
            //       }]
            //     },
            //     placeholder: '请选择', type: 'associationSearch',
            //     componentAttr: {
            //       allowClear: true,
            //       request: (val) => {
            //         return getCompanyList({pageNum: 1, pageSize: 50, companyName: val})
            //       },
            //       fieldNames: {value: 'companyId', label: 'companyName'},
            //       onChange: changeInvoiceCompany.bind(this, obj, props)
            //     },
            //     getFormat: (value, form) => {
            //       form.reimburseInvoiceCompanyId = value.value;
            //       form.reimburseInvoiceCompanyName = value.label;
            //       form.reimburseInvoiceCompanyCode = props.state.formData.reimburseInvoiceCompanyCode;
            //       return form;
            //     },
            //     setFormat: (value, form) => {
            //       if (value.label || value.value || value.value === 0) {
            //         return value;
            //       }
            //       return {label: form.reimburseInvoiceCompanyName, value: form.reimburseInvoiceCompanyId};
            //     }
            //   },
            // ],
            [
                {
                    label: '发票类型',
                    key: 'reimburseInvoiceType',
                    checkOption: {
                        initialValue: '1',
                        rules: [
                            {
                                required: true,
                                message: '请选择发票类型',
                            },
                        ],
                    },
                    options: REIMBURSE_INVOICE_TYPE,
                    placeholder: '请选择',
                    type: 'select',
                    getFormat: (value, form) => {
                        form.reimburseInvoiceType = Number(value);
                        return form;
                    },
                    setFormat: (value) => {
                        return String(value);
                    },
                    componentAttr: {
                        onChange: changeInvoiceType.bind(this, obj, props),
                    },
                },
            ],
            [
                {
                    label: '含税金额',
                    key: 'reimburseIncludeTaxFee',
                    checkOption: {
                        rules: [
                            {
                                required: true,
                                message: '请输入含税金额',
                            },
                        ],
                    },
                    componentAttr: {
                        precision: 2,
                        min: 0,
                        max: 99999999,
                        // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                        // onChange: changeIncludeTaxFee.bind(this, obj, props),
                        onChange: changeNoTaxFeeByInclude.bind(this, obj, props),
                    },
                    placeholder: '请输入',
                    type: 'inputNumber',
                },
            ],
            [
                {
                    label: '税率',
                    key: 'reimburseTaxRate',
                    placeholder: '请选择税率',
                    checkOption: {
                        initialValue: '0.06',
                        rules: [
                            {
                                required: !checkInvoiceType(props),
                                message: '请选择税率',
                            },
                        ],
                    },
                    type: 'select',
                    options: REIMBURSE_TAX_RATE,
                    disabled: checkInvoiceType(props),
                    // componentAttr: {
                    //     onChange: changeTaxRate.bind(this, obj, props),
                    // },
                    getFormat: (value, form) => {
                        form.reimburseTaxRate = Number(value);
                        return form;
                    },
                    setFormat: (value) => {
                        return String(value);
                    },
                },
            ],
            [
                {
                    label: '未税金额',
                    key: 'reimburseNoTaxFee',
                    checkOption: {
                        // rules: [{
                        //   required: true,
                        //   message: '请输入未税金额'
                        // }]
                    },
                    disabled: true,
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
                    label: '税额',
                    key: 'reimburseTax',
                    checkOption: {
                        rules: [
                            {
                                required: !checkInvoiceType(props),
                                message: '请输入税额',
                            },
                        ],
                    },
                    disabled: checkInvoiceType(props),
                    componentAttr: {
                        precision: 2,
                        min: 0,
                        max: 99999999,
                        onChange: changeNoTaxFeeByTax.bind(this, obj, props),
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
                    key: 'reimburseFeeRemark',
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

export default {
    formatSelfCols,
};
