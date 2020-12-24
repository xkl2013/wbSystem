import moment from 'moment';
import { getCustomePlatForm } from '../../services';
import { getUserDetail } from '@/services/globalDetailApi';
// 选择线索时动态生成项目名称（线索名称+艺人名称+时间）
const createProjectingName = (trailName, talentList) => {
    const projectingName = trailName || '';
    const time = moment().format('YYMM');
    let talentName = '';
    if (Array.isArray(talentList)) {
        if (talentList.length === 1) {
            talentName = talentList[0].trailTalentName;
        } else if (talentList.length > 1) {
            talentName = '打包';
        }
    }
    return `${projectingName.trim()}*${talentName}*${time}`;
};
// 选择线索触发联动
export const trail2projecting = async (trail) => {
    const temp = {};
    const trailDetailData = trail;
    temp.projectingTrailId = trailDetailData.trailId;
    temp.projectingTrailName = trailDetailData.trailName;
    temp.projectingName = createProjectingName(trailDetailData.trailName, trailDetailData.trailTalentList);
    temp.cooperate = '0';
    // 线索级别-》项目级别
    if (trailDetailData.trailLevel) {
        temp.projectingLevel = trailDetailData.trailLevel;
    }
    // 线索公司类型-》项目公司类型
    if (trailDetailData.trailCustomerType !== undefined) {
        temp.projectingCustomerType = trailDetailData.trailCustomerType;
    }
    // 线索直客品牌-》项目直客品牌
    if (trailDetailData.trailBrandName) {
        temp.brandName = trailDetailData.trailBrandName;
        temp.brandId = trailDetailData.trailBrandId;
    }
    // 线索影剧类型-》项目影剧类型
    if (trailDetailData.trailFilmType) {
        temp.projectingMovieType = trailDetailData.trailFilmType;
    }
    // 线索剧本评分-》项目剧本评分
    if (trailDetailData.trailFilmScore) {
        temp.projectingScriptScore = String(trailDetailData.trailFilmScore);
    }
    // 线索合作预算-》项目合作预算
    if (trailDetailData.trailCooperationBudget !== undefined) {
        temp.projectingBudget = trailDetailData.trailCooperationBudget;
    }
    // 线索合作类型-》项目合作类型
    if (trailDetailData.trailCooperationType1 !== undefined) {
        temp.projectctBusinessFirstTypeId = trailDetailData.trailCooperationType1;
    }
    if (trailDetailData.trailCooperationType2 !== undefined) {
        temp.projectctBusinessSecondTypeId = trailDetailData.trailCooperationType2;
    }
    // 线索合作产品-》项目合作产品
    if (trailDetailData.trailCooperateProduct !== undefined) {
        temp.projectingCooperateProduct = trailDetailData.trailCooperateProduct;
    }
    // 线索合作行业-》项目合作行业
    if (trailDetailData.trailCooperateIndustry !== undefined) {
        temp.projectingCooperateIndustry = trailDetailData.trailCooperateIndustry;
    }
    // 线索艺人-》项目艺人
    if (trailDetailData.trailTalentList) {
        const talentList = trailDetailData.trailTalentList.map((talent) => {
            return {
                talentId: talent.trailTalentId,
                talentName: talent.trailTalentName,
                talentType: talent.trailTalentType,
                projectingAppointmentTalentId: talent.trailTalentId,
                projectingAppointmentTalentName: talent.trailTalentName,
                projectingAppointmentTalentType: talent.trailTalentType,
            };
        });
        temp.projectBudgets = talentList;
        // 普通单和平台单需初始化艺人分成
        if (Number(trailDetailData.trailPlatformOrder) === 0 || Number(trailDetailData.trailPlatformOrder) === 1) {
            temp.projectingTalentDivides = talentList;
        }
        // 非普通单需初始化履约义务
        if (Number(trailDetailData.trailPlatformOrder) !== 0) {
            temp.projectingAppointmentDTOList = talentList;
        }
    }
    // 线索推荐人-》项目推荐人
    if (trailDetailData.trailRecommenderId) {
        temp.projectingRecommenderId = trailDetailData.trailRecommenderId;
        temp.projectingRecommender = trailDetailData.trailRecommender;
    }
    // 线索参与人-》项目参与人
    if (trailDetailData.trailUserList) {
        // 经理人+制作人
        temp.projectingUsers = trailDetailData.trailUserList.filter((user) => {
            if (Number(user.trailParticipantType) === 1 || Number(user.trailParticipantType) === 3) {
                user.projectingParticipantId = user.trailParticipantId;
                user.projectingParticipantName = user.trailParticipantName;
                user.projectingParticipantType = 6;
                return true;
            }
        });
        // 执行人
        temp.projectingUserList = trailDetailData.trailUserList.filter((user) => {
            if (Number(user.trailParticipantType) === 10) {
                user.projectingParticipantId = user.trailParticipantId;
                user.projectingParticipantName = user.trailParticipantName;
                user.projectingParticipantType = 10;
                return true;
            }
        });
    }
    // 平台下单
    if (trailDetailData.trailPlatformOrder !== undefined) {
        temp.trailPlatformOrder = trailDetailData.trailPlatformOrder;
    } else {
        temp.trailPlatformOrder = undefined;
    }
    // 下单平台
    if (trailDetailData.trailOrderPlatformId) {
        temp.trailOrderPlatformId = trailDetailData.trailOrderPlatformId;
        if (Number(temp.trailOrderPlatformId) === 1) {
            temp.projectingOrderType = '1';
        }
        // 平台代理公司-》项目代理公司
        const response = await getCustomePlatForm(trailDetailData.trailOrderPlatformId);
        if (response && response.success) {
            const data = response.data || {};
            temp.projectingCompanyName = data.customerName;
            temp.projectingCompanyId = data.id;
        }
    } else {
        temp.trailOrderPlatformId = undefined;
    }
    // 线索负责人-》项目负责人
    if (trailDetailData.trailHeaderId) {
        const response = await getUserDetail(trailDetailData.trailHeaderId);
        if (response && response.success && response.data) {
            const user = response.data.user || {};
            const department = response.data.department || {};
            temp.projectingHeaderId = trailDetailData.trailHeaderId;
            temp.projectingHeaderName = user.userChsName;
            temp.projectingHeaderDepartId = department.departmentId;
            temp.projectingHeaderDepartName = department.departmentName;
        }
    }
    return temp;
};
export default trail2projecting;
