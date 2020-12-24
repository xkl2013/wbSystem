import { pushCommerce } from '../../services';
/* eslint-disable */
// 此类用于处理特殊审批请求
export const ApprovalRequest = {
    // 商务类合同审核
    ContractCommerce: {
        request: async (item) => {
            const { approvalNoticers } = item;
            const approvalInstanceDataDtos = Array.isArray(item.approvalInstanceDataDtos)
                ? item.approvalInstanceDataDtos
                : [];
            const notifyUserList = approvalNoticers.map((item) => {
                return {
                    notifyUserId: item.userId,
                    notifyUsername: item.userName,
                };
            });
            let attachmentList = [];
            if (
                approvalInstanceDataDtos[4].fieldValue.length > 0 &&
                Array.isArray(approvalInstanceDataDtos[4].fieldValue)
            ) {
                attachmentList = approvalInstanceDataDtos[4].fieldValue.map((item) => {
                    return {
                        name: item.name,
                        domain: item.domain,
                        url: item.value,
                    };
                });
            }

            const talentArr = approvalInstanceDataDtos[1].fieldValue.map((item) => {
                return {
                    talentId: Number(item.value.slice(0, item.value.indexOf('_'))),
                    talentType: Number(item.value.slice(item.value.indexOf('_') + 1)),
                    talentName: item.name,
                };
            });
            const data = {
                clauseProjectId: Number(approvalInstanceDataDtos[0].fieldValue[0].value),
                clauseProjectName: approvalInstanceDataDtos[0].fieldValue[0].name,
                // clauseStarIdString: talentStr,
                clauseStarName: talentArr,
                clauseSigningWay: Number(approvalInstanceDataDtos[2].fieldValue[0].value),
                approvalDesc: approvalInstanceDataDtos[3].fieldValue, // 审核内容描述
                clauseContractType: 1, // 合同类型
                attachmentList,
                notifyUserList,
            };
            return await pushCommerce(data);
        },
    },
    // 非商务类合同审核
    common_ContractCommerce: {
        request: async (item) => {
            const { approvalNoticers } = item;
            const notifyUserList = approvalNoticers.map((item) => {
                return {
                    notifyUserId: item.userId,
                    notifyUsername: item.userName,
                };
            });
            const approvalInstanceDataDtos = Array.isArray(item.approvalInstanceDataDtos)
                ? item.approvalInstanceDataDtos
                : [];

            let data = {
                notifyUserList,
                clauseContractType: 2, // 合同类型
            };
            approvalInstanceDataDtos.forEach((item) => {
                switch (item.fieldName) {
                    case 'clauseProjectName':
                        const projectValue = Array.isArray(item.fieldValue) ? item.fieldValue : [];
                        data = {
                            ...data,
                            clauseProjectId: (projectValue[0] || {}).value,
                            clauseProjectName: (projectValue[0] || {}).name,
                        };
                        break;
                    case 'clauseStarName':
                        const talentValue = Array.isArray(item.fieldValue) ? item.fieldValue : [];
                        const talentArr = talentValue.map((item) => {
                            return {
                                talentId: Number(item.value.slice(0, item.value.indexOf('_'))),
                                talentType: Number(item.value.slice(item.value.indexOf('_') + 1)),
                                talentName: item.name,
                            };
                        });
                        data = {
                            ...data,
                            clauseStarName: talentArr,
                        };
                        break;
                    case 'approvalDesc':
                        data = {
                            ...data,
                            approvalDesc: item.fieldValue,
                        };
                        break;
                    case 'upload':
                        const uploadValue = Array.isArray(item.fieldValue) ? item.fieldValue : [];
                        data = {
                            ...data,
                            attachmentList: uploadValue.map((item) => {
                                return {
                                    name: item.name,
                                    domain: item.domain,
                                    url: item.value,
                                };
                            }),
                        };
                        break;
                    default:
                        break;
                }
            });
            return await pushCommerce(data);
        },
    },
};
