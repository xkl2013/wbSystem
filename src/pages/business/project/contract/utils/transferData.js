import _ from 'lodash';
import { isNumber } from '@/utils/utils';
import { accDiv, accMul } from '@/utils/calculate';
import Notice from '@/pages/business/components/noticers';
import { calcWeight } from '@/pages/business/project/contract/services';
import { getProjectDetailNoAuth } from '@/services/globalDetailApi';

// 主合同详情转化为子合同form表单
export const primaryDetail2childForm = async (detail, authorizedId) => {
    const {
        contract: {
            contractId,
            contractType,
            contractProjectId,
            contractProjectName,
            contractProjectCategory,
            contractHeaderId,
            contractHeaderName,
            contractHeaderDepartmentId,
            contractHeaderDepartmentName,
            contractMoneyCompanyId,
            contractMoneyCompanyName,
            contractMoneyStudioId,
            contractMoneyStudioName,
            contractSigningType,
            cooperate,
            cooperateRatio,
            cooperateDepartmentId,
            cooperateDepartmentName,
            cooperateUserId,
            cooperateUserName,
            contractCooperateProduct,
            contractCooperateIndustry,
            contractCooperateBrand,
            contractMoneyTotal,
            trailPlatformOrder,
        },
        contractCustomerList,
        contractCompanyList,
        contractStudioList,
        contractBudgetList,
    } = detail;
    const formData = {
        contractPid: contractId,
        contractType,
        contractCategory: '1',
        contractProjectId,
        contractProjectName,
        contractProjectCategory,
        contractSigningType,
        contractMoneyCompanyId,
        contractMoneyCompanyName,
        contractMoneyStudioId,
        contractMoneyStudioName,
        contractCustomerList,
        contractCompanyList,
        contractStudioList,
        contractHeaderId,
        contractHeaderName,
        contractHeaderDepartmentId,
        contractHeaderDepartmentName,
        cooperate,
        cooperateRatio,
        cooperateDepartmentId,
        cooperateDepartmentName,
        cooperateUserId,
        cooperateUserName,
        contractCooperateProduct,
        contractCooperateIndustry,
        contractCooperateBrand,
        // 项目授权公司创建子合同需带出合同金额
        contractMoneyTotal: authorizedId ? contractMoneyTotal : undefined,
        // 长期、cps
        trailPlatformOrder,
        contractBudgetList,
        contractTalentDivideList: contractBudgetList,
    };
    const res = await getProjectDetailNoAuth(contractProjectId);
    if (res && res.success && res.data) {
        const {
            projectAppointments,
            project: { yearFrameType },
        } = res.data;
        formData.projectAppointments = projectAppointments;
        formData.yearFrameType = yearFrameType;
        // 查询出主合同的项目中可以用于子合同的履约义务
        if (Array.isArray(projectAppointments)) {
            const contractAppointmentList = [];
            projectAppointments.map((one, index) => {
                if (!one.inUse && !one.contractId) {
                    contractAppointmentList.push({
                        contractAppointmentTalentId: one.projectAppointmentTalentId,
                        contractAppointmentTalentName: one.projectAppointmentTalentName,
                        contractAppointmentTalentType: one.projectAppointmentTalentType,
                        contractAppointmentPath: one.projectAppointmentPath,
                        contractAppointmentName: one.projectAppointmentName,
                        contractAppointmentBrand: one.projectAppointmentBrand,
                        contractAppointmentDescription: one.projectAppointmentDescription,
                        contractAppointmentProgressType: one.projectAppointmentProgressType,
                        contractAppointmentProgress: one.projectAppointmentProgress,
                        contractAppointmentWeight: one.projectAppointmentWeight,
                        liveTimePlan: one.projectLiveTimePlan,
                        liveTime: one.projectLiveTime,
                        projectAppointmentId: one.projectAppointmentId,
                        appointmentExecuteMoney: one.appointmentExecuteMoney,
                        appointmentExecuteMoneyTotal: one.appointmentExecuteMoneyTotal,
                        no: index + 1,
                    });
                }
            });
            const weightResponse = await calcWeight({ contractAppointmentList });
            if (weightResponse && weightResponse.success && weightResponse.data) {
                weightResponse.data.map((one, i) => {
                    // eslint-disable-next-line max-len
                    contractAppointmentList[i].contractAppointmentWeight = isNumber(one.contractAppointmentWeight)
                        ? accMul(one.contractAppointmentWeight, 100).toFixed(2)
                        : one.contractAppointmentWeight;
                });
                formData.contractAppointmentList = contractAppointmentList;
            }
            // 过滤出履约义务中艺人对应的分成和预算
            // formData.contractBudgetList = formData.contractBudgetList.filter((budget) => {
            //     const index = formData.contractAppointmentList.findIndex((appoint) => {
            //         return (
            //             Number(budget.talentId) === Number(appoint.contractAppointmentTalentId)
            //             && Number(budget.talentType) === Number(appoint.contractAppointmentTalentType)
            //         );
            //     });
            //     return index > -1;
            // });
            // formData.contractTalentDivideList = formData.contractBudgetList;
        }
    }
    return formData;
};
export const detail2detail = async (detail) => {
    const {
        contract: { contractProjectId },
    } = detail;
    const res = await getProjectDetailNoAuth(contractProjectId);
    if (res && res.success && res.data) {
        const {
            project: { yearFrameType, projectingType },
        } = res.data;
        detail.yearFrameType = yearFrameType;
        detail.contractProjectType = projectingType;
    }
    return detail;
};
// 详情转化为form表单
export const detail2form = async (detail) => {
    const {
        contract = {},
        contractTalentDivideList,
        contractAppointmentList,
        contractBudgetList,
        contractAttachmentList,
        contractCompanyList,
        contractCustomerList,
        contractStudioList,
        contractNoticeList,
        contractReturnList,
        contractTalentList,
    } = detail;
    // 修改时比例还原为百分比
    if (Array.isArray(contractTalentDivideList)) {
        contractTalentDivideList.map((item) => {
            item.divideAmountRate = isNumber(item.divideAmountRate)
                ? accMul(item.divideAmountRate, 100).toFixed(4)
                : item.divideAmountRate;
            item.divideRateTalent = isNumber(item.divideRateTalent)
                ? accMul(item.divideRateTalent, 100).toFixed(0)
                : item.divideRateTalent;
            item.divideRateCompany = isNumber(item.divideRateCompany)
                ? accMul(item.divideRateCompany, 100).toFixed(0)
                : item.divideRateCompany;
            return item;
        });
    }
    const formData = {
        ...contract,
        contractTalentDivideList,
        contractAppointmentList,
        contractBudgetList,
        contractAttachmentList,
        contractCompanyList,
        contractCustomerList,
        contractStudioList,
        contractNoticeList,
        contractReturnList,
        contractTalentList,
    };
    const { contractProjectId } = contract;
    if (contractProjectId) {
        const res = await getProjectDetailNoAuth(contractProjectId);
        if (res && res.success && res.data) {
            const {
                projectAppointments,
                project: { yearFrameType },
            } = res.data;
            formData.projectAppointments = projectAppointments;
            formData.yearFrameType = yearFrameType;
            // 查询出主合同的项目中可以用于子合同的履约义务
            if (Array.isArray(projectAppointments)) {
                const contractAppointmentList = [];
                projectAppointments.map((one, index) => {
                    if (!one.inUse && !one.contractId) {
                        contractAppointmentList.push({
                            contractAppointmentTalentId: one.projectAppointmentTalentId,
                            contractAppointmentTalentName: one.projectAppointmentTalentName,
                            contractAppointmentTalentType: one.projectAppointmentTalentType,
                            contractAppointmentPath: one.projectAppointmentPath,
                            contractAppointmentName: one.projectAppointmentName,
                            contractAppointmentBrand: one.projectAppointmentBrand,
                            contractAppointmentDescription: one.projectAppointmentDescription,
                            contractAppointmentProgressType: one.projectAppointmentProgressType,
                            contractAppointmentProgress: one.projectAppointmentProgress,
                            contractAppointmentWeight: one.projectAppointmentWeight,
                            liveTimePlan: one.projectLiveTimePlan,
                            liveTime: one.projectLiveTime,
                            projectAppointmentId: one.projectAppointmentId,
                            appointmentExecuteMoney: one.appointmentExecuteMoney,
                            appointmentExecuteMoneyTotal: one.appointmentExecuteMoneyTotal,
                            no: index + 1,
                            contractAppointmentStart: one.projectAppointmentStart,
                            contractAppointmentEnd: one.projectAppointmentEnd,
                        });
                    }
                });
                const weightResponse = await calcWeight({ contractAppointmentList });
                if (weightResponse && weightResponse.success && weightResponse.data) {
                    weightResponse.data.map((one, i) => {
                        contractAppointmentList[i].contractAppointmentWeight = isNumber(one.contractAppointmentWeight)
                            ? accMul(one.contractAppointmentWeight, 100).toFixed(2)
                            : one.contractAppointmentWeight;
                    });
                    formData.contractAppointmentList = contractAppointmentList;
                }
                // 过滤出履约义务中艺人对应的分成和预算
                // formData.contractBudgetList = formData.contractBudgetList.filter((budget) => {
                //     const index = formData.contractAppointmentList.findIndex((appoint) => {
                //         return (
                //             Number(budget.talentId) === Number(appoint.contractAppointmentTalentId)
                //             && Number(budget.talentType) === Number(appoint.contractAppointmentTalentType)
                //         );
                //     });
                //     return index > -1;
                // });
                // formData.contractTalentDivideList = formData.contractBudgetList;
            }
        }
    }
    return formData;
};
// 表单转化为提交数据
export const form4submit = (form) => {
    const temp = _.cloneDeep(form);
    // 艺人博主分成
    if (Array.isArray(temp.contractTalentDivideList)) {
        temp.contractTalentDivideList.map((item) => {
            // 拆帐比例
            item.divideAmountRate = isNumber(item.divideAmountRate)
                ? accDiv(item.divideAmountRate, 100).toFixed(6)
                : item.divideAmountRate;
            // 艺人分成比例
            item.divideRateTalent = isNumber(item.divideRateTalent)
                ? accDiv(item.divideRateTalent, 100).toFixed(2)
                : item.divideRateTalent;
            // 公司分成比例
            item.divideRateCompany = isNumber(item.divideRateCompany)
                ? accDiv(item.divideRateCompany, 100).toFixed(2)
                : item.divideRateCompany;
            return item;
        });
    }
    // 履约义务
    if (Array.isArray(temp.contractAppointmentList)) {
        temp.contractAppointmentList.map((item) => {
            // 权重
            item.contractAppointmentWeight = isNumber(item.contractAppointmentWeight)
                ? accDiv(item.contractAppointmentWeight, 100).toFixed(4)
                : item.contractAppointmentWeight;
            return item;
        });
    }
    // 回款计划
    if (Array.isArray(temp.contractReturnList)) {
        temp.contractReturnList.map((item) => {
            // 回款比例
            item.contractReturnRate = isNumber(item.contractReturnRate)
                ? accDiv(item.contractReturnRate, 100).toFixed(2)
                : item.contractReturnRate;
            return item;
        });
    }

    const newData = {
        contractAppointmentList: temp.contractAppointmentList,
        contractReturnList: temp.contractReturnList,
        contractTalentDivideList: temp.contractTalentDivideList,
        contractBudgetList: temp.contractBudgetList,
        contractAttachmentList: temp.contractAttachmentList,
        contractCompanyList: temp.contractCompanyList,
        contractCustomerList: temp.contractCustomerList,
        contractStudioList: temp.contractStudioList,
        contractNoticeList: Notice.getNoticeData() || [],
    };
    // 删除需单独提出的数据
    delete temp.contractAppointmentList;
    delete temp.contractReturnList;
    delete temp.contractTalentDivideList;
    delete temp.contractBudgetList;
    delete temp.contractAttachmentList;
    delete temp.contractCompanyList;
    delete temp.contractCustomerList;
    delete temp.contractStudioList;
    delete temp.contract;
    // 删除临时数据
    delete temp.projectType;
    delete temp.platformData;
    delete temp.cooperationIndustry;
    delete temp.cooperationProduct;
    delete temp.cooperationBrand;
    delete temp.projectAppointments;
    // 除去多余数据后剩下的用contract包装
    newData.contract = temp;
    return newData;
};
export default {
    detail2form,
    form4submit,
};
