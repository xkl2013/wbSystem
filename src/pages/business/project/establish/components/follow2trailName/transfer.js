import moment from 'moment';
import _ from 'lodash';
import { getUserDetail } from '@/services/globalDetailApi';
import { getYearFrame } from '../../services';
// 选择线索时动态生成项目名称（线索名称+艺人名称+时间）
const createProjectingName = (trailName, talentList) => {
    const projectingName = trailName || '';
    const time = moment().format('YYMM');
    let talentName = '';
    if (Array.isArray(talentList)) {
        if (talentList.length === 1) {
            talentName = talentList[0].text;
        } else if (talentList.length > 1) {
            talentName = '打包';
        }
    }
    return `${projectingName.trim()}*${talentName}*${time}`;
};
// 选择线索触发联动
export const follow2projecting = async (customer) => {
    const temp = {};
    const {
        customerNameInput, // 项目名称
        customerName, // 客户名称
        customerType, // 客户类型
        talentName, // 涉及艺人
        customerCategory, // 合作行业
        cooperationBrand, // 合作品牌
        customerBudget, // 客户预算
        followUpUserName, // 跟进人
        participantUsers, // 参与人
        trailPlatformOrder, // 项目类型
        projectingType,
    } = customer;
    if (customerNameInput && customerNameInput[0]) {
        temp.projectingTrailName = customerNameInput[0].text;
    }
    temp.projectingName = createProjectingName(temp.projectingTrailName, talentName);
    temp.cooperate = '0';
    // 客户名称-》公司名称
    if (customerName && customerName[0]) {
        const { text, value } = customerName[0];
        if (value) {
            // 客户类型
            if (customerType && customerType[0]) {
                temp.realCustomerType = customerType[0].value;
                temp.projectingCustomerType = customerType[0].value;
                if (Number(trailPlatformOrder) === 1) {
                    temp.projectingCustomerName = text;
                    temp.projectingCustomerId = value;
                } else {
                    //
                    // eslint-disable-next-line no-lonely-if
                    if (Number(temp.projectingCustomerType) === 1) {
                        temp.projectingCompanyId = value;
                        temp.projectingCompanyName = text;
                    } else if (Number(temp.projectingCustomerType) === 0) {
                        temp.projectingCustomerName = text;
                        temp.projectingCustomerId = value;
                    }
                }
                if (Number(temp.projectingCustomerType) === 2) {
                    delete temp.projectingCustomerType;
                }
                if (projectingType) {
                    const res = await getYearFrame({
                        customerId: Number(value),
                        customerType: Number(temp.realCustomerType),
                    });
                    if (res && res.success && res.data && res.data.length > 0) {
                        temp.showYearFrame = true;
                        temp.yearFrameCustomerId = Number(value);
                        temp.yearFrameCustomerType = Number(temp.realCustomerType);
                    }
                }
            }
        }
    }
    // 签单额
    if (customerBudget && customerBudget[0]) {
        temp.projectingBudget = customerBudget[0].value * 10000;
    }
    // 合作行业
    if (customerCategory && customerCategory[0]) {
        temp.projectingCooperateIndustry = customerCategory[0].value;
    }
    // 合作品牌
    if (cooperationBrand && cooperationBrand[0]) {
        temp.projectingCooperateBrand = cooperationBrand[0].value;
    }
    // 负责人
    if (followUpUserName && followUpUserName[0]) {
        const { text, value } = followUpUserName[0];
        if (value) {
            const userResponse = await getUserDetail(value);
            if (userResponse && userResponse.success && userResponse.data) {
                const department = userResponse.data.department || {};
                temp.projectingHeaderName = text;
                temp.projectingHeaderId = value;
                temp.projectingHeaderDepartId = department.departmentId;
                temp.projectingHeaderDepartName = department.departmentName;
            }
        }
    }
    // 涉及艺人
    if (talentName && talentName[0]) {
        const talentList = talentName.map((talent) => {
            const { text, value } = talent;
            const valueArr = value.split('_');
            return {
                talentId: valueArr[0],
                talentName: text,
                talentType: valueArr[1],
            };
        });
        // 初始化艺人预算
        temp.projectBudgets = _.cloneDeep(talentList);
        // 普通单和平台单需初始化艺人分成
        if (Number(trailPlatformOrder) === 0 || Number(trailPlatformOrder) === 1) {
            temp.projectingTalentDivides = _.cloneDeep(talentList);
        }
        temp.projectingAppointmentDTOList = _.cloneDeep(talentList).map((item) => {
            Object.keys(item).map((key) => {
                if (/^talent\w+$/.test(key)) {
                    const tempKey = key.replace(/^(talent)(\w+)$/, ($0, $1, $2) => {
                        return `projectingAppointmentTalent${$2}`;
                    });
                    item[tempKey] = item[key];
                    delete item[key];
                }
            });
            return item;
        });
    }
    // 参与人
    if (participantUsers && participantUsers[0]) {
        // 经理人+制作人
        // 后端给的参与人可能重复，做去重处理
        const uniqUsers = _.uniqBy(participantUsers, 'value');
        temp.projectingUsers = uniqUsers.map((user) => {
            const { text, value } = user;
            return {
                projectingParticipantId: value,
                projectingParticipantName: text,
                projectingParticipantType: 6,
            };
        });
    }
    return temp;
};
export default follow2projecting;
