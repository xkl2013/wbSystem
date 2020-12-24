import _ from 'lodash';
import { getUserDetail } from '@/services/globalDetailApi';
import { calcWeight, getProjectDetail } from '@/pages/business/project/contract/services';
import { accMul } from '@/utils/calculate';
import { isNumber } from '@/utils/utils';
// 项目详情转合同表单
export const project2contract = async (projectId, contractCategory) => {
    let temp = {};
    const response = await getProjectDetail(projectId);
    if (response && response.success && response.data) {
        const {
            project: {
                projectingType,
                projectingCustomerId,
                projectingCustomerName,
                projectingCompanyId,
                projectingCompanyName,
                projectingCategory: contractProjectCategory,
                projectingHeaderId: contractHeaderId,
                projectingHeaderName: contractHeaderName,
                projectingHeaderDepartId: contractHeaderDepartmentId,
                projectingHeaderDepartName: contractHeaderDepartmentName,
                projectingName: contractProjectName,
                projectingId: contractProjectId,
                projectingStartDate: contractStartDate,
                projectingEndDate: contractEndDate,
                projectingCooperateProduct: contractCooperateProduct,
                projectingCooperateIndustry: contractCooperateIndustry,
                projectingCooperateBrand: contractCooperateBrand,
                cooperate,
                cooperateRatio,
                cooperateDepartmentId,
                cooperateDepartmentName,
                cooperateUserId,
                cooperateUserName,
                // 长期、cps扩展
                trailPlatformOrder,
                projectingBudget,
                yearFrameType,
            },
            projectTalentDivides: contractTalentDivideList,
            projectedBudgets: contractBudgetList,
            projectAppointments,
            projectReturnList,
        } = response.data;
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
                item.projectTalentDivideId = item.id;
                return item;
            });
        }
        temp = {
            projectingType,
            contractProjectId,
            contractProjectName,
            contractProjectCategory,
            contractHeaderId,
            contractHeaderName,
            contractHeaderDepartmentId,
            contractHeaderDepartmentName,
            contractBudgetList,
            contractStartDate,
            contractEndDate,
            contractCooperateProduct,
            contractCooperateIndustry,
            contractCooperateBrand,
            cooperate,
            cooperateRatio,
            cooperateDepartmentId,
            cooperateDepartmentName,
            cooperateUserId,
            cooperateUserName,
            contractTalentDivideList:
                Number(contractCategory) === 1 ? _.cloneDeep(contractBudgetList) : contractTalentDivideList,
            contractCustomerList: [
                {
                    contractCompanyId: projectingCompanyId || projectingCustomerId,
                    contractCompanyName:
                        (projectingCompanyId && projectingCompanyName)
                        || (projectingCustomerId && projectingCustomerName),
                },
            ],
            trailPlatformOrder,
            yearFrameType,
        };
        // 项目带过来的部门有误，则根据负责人ID重新获取
        if (contractHeaderId) {
            const res = await getUserDetail(contractHeaderId);
            if (res && res.success && res.data) {
                const user = res.data.user || {};
                const department = res.data.department || {};
                temp.contractHeaderName = user.userChsName;
                temp.contractHeaderDepartmentId = department.departmentId;
                temp.contractHeaderDepartmentName = department.departmentName;
            }
        }
        // 所有类型的项目都需要带出履约义务
        if (Array.isArray(projectAppointments)) {
            temp.projectAppointments = projectAppointments;
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
                        contractAppointmentStart: temp.contractStartDate,
                        contractAppointmentEnd: temp.contractEndDate,
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
                temp.contractAppointmentList = contractAppointmentList;
            }
        }
        // 长期、cps
        if (Number(trailPlatformOrder) === 2 || Number(trailPlatformOrder) === 3) {
            // 项目签单额=》合同金额
            temp.contractMoneyTotal = projectingBudget;
            if (Array.isArray(projectReturnList)) {
                const contractReturnList = [];
                projectReturnList.map((one) => {
                    contractReturnList.push({
                        contractReturnPeriod: one.batch,
                        contractReturnMoney: one.projectReturnMoney,
                        contractReturnDate: one.projectReturnDate,
                    });
                });
                temp.contractReturnList = contractReturnList;
            }
        }
    }
    return temp;
};
export default project2contract;
