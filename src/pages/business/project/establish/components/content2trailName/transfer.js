import moment from 'moment';
import _ from 'lodash';
import { getUserDetail } from '@/services/globalDetailApi';
import { getYearFrame } from '@/pages/business/project/establish/services';
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
// 选择内容客户项目触发联动
export const content2projecting = async (content) => {
    const temp = {};
    const {
        customerName,
        upLineDate,
        playStation,
        startDate,
        followUpUserName,
        talentName,
        material,
        playScore,
        director,
        scenarist,
        leadingRoleSigned,
        leadingRoleInvite,
        agroupIdea,
        shotAddress,
        participantUsers,
        customerType,
        projectName,
        projectingType,
    } = content;
    if (projectName && projectName[0]) {
        temp.projectingTrailName = projectName[0].text;
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
                if (Number(temp.projectingCustomerType) === 1) {
                    temp.projectingCompanyId = value;
                    temp.projectingCompanyName = text;
                } else if (Number(temp.projectingCustomerType) === 0) {
                    temp.projectingCustomerName = text;
                    temp.projectingCustomerId = value;
                } else if (Number(temp.projectingCustomerType) === 2) {
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
    if (Number(projectingType) === 2) {
        // 综艺私有
        // 开机日期
        if (startDate && startDate[0]) {
            const { text } = startDate[0];
            temp.projectingVarietyRecordDate = text;
        }
    }
    if (Number(projectingType) === 3) {
        // 影视私有
        // 剧本评分
        if (playScore && playScore[0]) {
            const { text } = playScore[0];
            temp.projectingScriptScore = text;
        }
        // 题材
        if (material && material[0]) {
            const { text } = material[0];
            temp.projectingMovieSubject = text;
        }
        // 导演
        if (director && director[0]) {
            const { text } = director[0];
            temp.projectingMovieDirector = text;
        }
        // 编剧
        if (scenarist && scenarist[0]) {
            const { text } = scenarist[0];
            temp.projectingMovieScriptwriter = text;
        }
        // 主演已签
        if (leadingRoleSigned && leadingRoleSigned[0]) {
            const { text } = leadingRoleSigned[0];
            temp.projectingMovieStar = text;
        }
        // 主演拟签
        if (leadingRoleInvite && leadingRoleInvite[0]) {
            const { text } = leadingRoleInvite[0];
            temp.projectingMovieInvitation = text;
        }
        // A组意见
        if (agroupIdea && agroupIdea[0]) {
            const { text } = agroupIdea[0];
            temp.projectingMovieAscore = text;
        }
        // 拍摄地点
        if (shotAddress && shotAddress[0]) {
            const { text } = shotAddress[0];
            temp.projectingMovieShootingAddress = text;
        }
    }
    // 上线日期
    if (upLineDate && upLineDate[0]) {
        const { text } = upLineDate[0];
        temp.projectingOnlineDate = text;
    }
    // 播出平台
    if (playStation && playStation[0]) {
        const { text } = playStation[0];
        temp.projectingBroadcastPlatform = text;
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
        temp.projectingTalentDivides = _.cloneDeep(talentList);
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
export default content2projecting;
