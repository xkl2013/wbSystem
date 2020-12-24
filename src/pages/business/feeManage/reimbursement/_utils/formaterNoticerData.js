import { getUserNameInfo } from '@/services/globalDetailApi';
/*
 *@params formData
 *@return noticers集合
 */
export const formaterNoticersData = async ({ formData }) => {
    const reimburseCheques = (await reimburseChequesFormater(formData)) || []; //   执行人;
    return [...reimburseCheques];
};

/*
 *@params formData
 *@return 收款对象
 */
export const reimburseChequesFormater = async data => {
    if (
        typeof data === 'undefined' ||
        !data.reimburseCheques ||
        !Array.isArray(data.reimburseCheques)
    )
        return [];
    const reimburseCheques = data.reimburseCheques;
    const params = reimburseCheques.map(item => item.reimburseChequesId);
    const res = await getUserNameInfo(params);
    const result = res.data;
    return result.map(item => ({
        id: item.userId,
        name: item.userChsName,
        avatar: item.userIcon,
        type: 'user',
        key: 'reimburseCheques',
        keyName: '收款对象',
        noticeType: 'approval',
    }));
};
