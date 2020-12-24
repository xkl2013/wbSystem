import { getUserNameInfo } from '@/services/globalDetailApi';

/*
 *@params formData
 *@return noticers集合
 */
export const formaterNoticersData = async ({ formData }) => {
    const contract = await contractChequesFormater(formData); //   执行人;
    return [...contract];
};

/*
 *@params formData
 *@return 负责人
 */
export const contractChequesFormater = async data => {
    if (typeof data === 'undefined') return [];
    const params = [];
    params.push(data.contractHeaderId);
    if (data.cooperateUserId && data.cooperateUserName) {
        params.push(data.cooperateUserId);
    }
    const res = await getUserNameInfo(params);
    const result = res.data;
    return result.map(item => ({
        id: item.userId,
        name: item.userChsName,
        avatar: item.userIcon,
        type: 'user',
        noticeType: 'approval',
    }));
};
