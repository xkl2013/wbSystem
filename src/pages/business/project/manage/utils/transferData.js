import _ from 'lodash';
import { isNumber } from '@/utils/utils';
import { accDiv, accMul } from '@/utils/calculate';

// 详情转化为form表单
export const detail2form = async (detail) => {
    const {
        project,
        projectUsers,
        projectedBudgets,
        projectTalentDivides,
        projectAppointments,
        trail,
        contentCustomerFollowUp,
        projectAuthorizationInfoList,
        projectReturnList,
        customerFollowUp,
    } = detail;
    // 修改时比例还原为百分比
    projectTalentDivides.map((item) => {
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
    projectAppointments.map((item) => {
        item.projectAppointmentProgress = isNumber(item.projectAppointmentProgress)
            ? accMul(item.projectAppointmentProgress, 100).toFixed(0)
            : item.projectAppointmentProgress;
        item.projectAppointmentWeight = isNumber(item.projectAppointmentWeight)
            ? accMul(item.projectAppointmentWeight, 100).toFixed(2)
            : item.projectAppointmentWeight;
        item.divideAmountRate = isNumber(item.divideAmountRate)
            ? accMul(item.divideAmountRate, 100).toFixed(2)
            : item.divideAmountRate;
        item.divideRateTalent = isNumber(item.divideRateTalent)
            ? accMul(item.divideRateTalent, 100).toFixed(0)
            : item.divideRateTalent;
        item.divideRateCompany = isNumber(item.divideRateCompany)
            ? accMul(item.divideRateCompany, 100).toFixed(0)
            : item.divideRateCompany;
        return item;
    });
    const projectingAppointmentDTOList = _.cloneDeep(projectAppointments);
    projectingAppointmentDTOList.map((item) => {
        Object.keys(item).map((key) => {
            if (/^project\w+$/.test(key)) {
                const tempKey = key.replace(/^(project)(\w+)$/, ($0, $1, $2) => {
                    return `projecting${$2}`;
                });
                item[tempKey] = item[key];
            }
        });
        return item;
    });
    let users = [];
    const userList = [];
    if (Array.isArray(projectUsers)) {
        projectUsers.map((item) => {
            if (Number(item.projectingParticipantType) === 6) {
                // 参与人
                users.push(item);
            } else if (Number(item.projectingParticipantType) === 10) {
                // 执行人
                userList.push(item);
            }
        });
    }
    // 已存储的参与人旧数据可能存在重复情况，此处去重处理
    users = _.uniqBy(users, 'projectingParticipantId');
    project.projectingTypeComb = true;
    project.projectingBusinessTypeName = projectingAppointmentDTOList && projectingAppointmentDTOList.length > 0;
    const { yearFrameType } = project;
    if (yearFrameType) {
        project.showYearFrame = true;
    }
    const formData = {
        ...project,
        projectingUsers: users,
        projectingUserList: userList,
        projectingTalentDivides: projectTalentDivides,
        projectingAppointmentDTOList,
        projectBudgets: projectedBudgets,
        projectAppointments,
        trail,
        contentCustomerFollowUp,
        projectAuthorizationInfoList,
        projectReturnList,
        customerFollowUp,
    };
    // 项目详情中获取最新的线索名称(直接修改数据源方便后面多处使用)
    if (Number(formData.projectingTrailType) === 2) {
        // 内容客户的取值
        if (formData.contentCustomerFollowUp) {
            const { projectName } = formData.contentCustomerFollowUp;
            formData.projectingTrailName = projectName && projectName[0] && projectName[0].text;
        }
    } else if (Number(formData.projectingTrailType) === 3) {
        if (formData.customerFollowUp) {
            // 内容客户的取值
            const { customerNameInput } = formData.customerFollowUp;
            formData.projectingTrailName = customerNameInput && customerNameInput[0] && customerNameInput[0].text;
        }
    } else if (formData.trail) {
        // 线索的取值
        formData.projectingTrailName = formData.trail.trailName;
    }
    return formData;
};
// 表单转化为提交数据
export const form4submit = (form) => {
    const temp = _.cloneDeep(form);
    if (temp.projectingTalentDivides) {
        // 提交时比例都用小数
        temp.projectingTalentDivides.map((item) => {
            item.divideAmountRate = isNumber(item.divideAmountRate)
                ? accDiv(item.divideAmountRate, 100).toFixed(6)
                : item.divideAmountRate;
            item.divideRateTalent = isNumber(item.divideRateTalent)
                ? accDiv(item.divideRateTalent, 100).toFixed(2)
                : item.divideRateTalent;
            item.divideRateCompany = isNumber(item.divideRateCompany)
                ? accDiv(item.divideRateCompany, 100).toFixed(2)
                : item.divideRateCompany;
            return item;
        });
    }
    if (temp.projectingAppointmentDTOList) {
        temp.projectingAppointmentDTOList.map((item) => {
            item.projectingAppointmentProgress = isNumber(item.projectingAppointmentProgress)
                ? accDiv(item.projectingAppointmentProgress, 100).toFixed(2)
                : item.projectingAppointmentProgress;
            item.projectingAppointmentWeight = isNumber(item.projectingAppointmentWeight)
                ? accDiv(item.projectingAppointmentWeight, 100).toFixed(4)
                : item.projectingAppointmentWeight;
            item.divideAmountRate = isNumber(item.divideAmountRate)
                ? accDiv(item.divideAmountRate, 100).toFixed(4)
                : item.divideAmountRate;
            item.divideRateTalent = isNumber(item.divideRateTalent)
                ? accDiv(item.divideRateTalent, 100).toFixed(2)
                : item.divideRateTalent;
            item.divideRateCompany = isNumber(item.divideRateCompany)
                ? accDiv(item.divideRateCompany, 100).toFixed(2)
                : item.divideRateCompany;
            Object.keys(item).map((key) => {
                if (/^projecting\w+$/.test(key)) {
                    const tempKey = key.replace(/^(projecting)(\w+)$/, ($0, $1, $2) => {
                        return `project${$2}`;
                    });
                    item[tempKey] = item[key];
                }
            });
            return item;
        });
    }
    // form提交的数据
    const newData = {
        projectedBudgets: temp.projectBudgets,
        projectTalentDivides: temp.projectingTalentDivides,
        projectAppointments: temp.projectingAppointmentDTOList,
    };
    // 有参与人
    if (Array.isArray(temp.projectingUsers)) {
        newData.projectUsers = temp.projectingUsers;
    }
    // 有执行人
    if (Array.isArray(temp.projectingUserList)) {
        newData.projectUsers = newData.projectUsers || [];
        newData.projectUsers = newData.projectUsers.concat(temp.projectingUserList);
    }
    // 删除需单独提出的数据
    delete temp.projectBudgets;
    delete temp.projectingUsers;
    delete temp.projectingUserList;
    delete temp.projectingTalentDivides;
    delete temp.projectingAppointmentDTOList;
    // 删除临时数据
    delete temp.projectType;
    delete temp.platformData;
    delete temp.cooperationIndustry;
    delete temp.cooperationProduct;
    delete temp.cooperationBrand;
    delete temp.trail;
    delete temp.contentCustomerFollowUp;
    delete temp.projectingTypeComb;
    delete temp.projectAppointments;
    delete temp.customerFollowUp;
    delete temp.showYearFrame;
    // 除去多余数据后剩下的用project包装
    newData.project = temp;
    return newData;
};
// 表单转化为提交数据
export const form4submitAdd = (form) => {
    const temp = _.cloneDeep(form);
    temp.projectType = temp.projectingType;
    temp.projectName = temp.projectingName;
    temp.remark = temp.projectingDescription;
    delete temp.projectingTypeComb;
    delete temp.trailPlatformOrder;
    delete temp.projectingType;
    delete temp.projectingName;
    delete temp.projectingDescription;
    return temp;
};
export default {
    detail2form,
    form4submit,
    form4submitAdd,
};
