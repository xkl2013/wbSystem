import { getUserNameInfo } from '@/services/globalDetailApi';

/*
 *@params formData
 *@return noticers集合
 */
export const formaterNoticersData = async ({ formData }) => {
    const applicationCheques = (await applicationChequesFormater(formData)) || []; //   执行人;
    return [...applicationCheques];
};

/*
 *@params formData
 *@return 收款对象
 */
export const applicationChequesFormater = async data => {
    if (
        typeof data === 'undefined' ||
        !data.applicationCheques ||
        !Array.isArray(data.applicationCheques)
    )
        return [];
    const applicationCheques = data.applicationCheques;
    const params = applicationCheques.map(item => item.applicationChequesId);
    const res = await getUserNameInfo(params);
    const result = res.data;
    return result.map(item => ({
        id: item.userId,
        name: item.userChsName,
        avatar: item.userIcon,
        type: 'user',
        key: 'applicationCheques',
        keyName: '收款对象',
    }));
};
