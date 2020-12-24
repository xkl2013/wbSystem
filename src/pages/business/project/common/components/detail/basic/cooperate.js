import { getOptionName } from '@/utils/utils';
import { IS_OR_NOT, PROJECT_ESTABLISH_RATIO } from '@/utils/enum';

const getCooperateCols = (formData) => {
    let columns = [
        {
            key: 'cooperate',
            label: '业务双记',
            render: (detail) => {
                return getOptionName(IS_OR_NOT, detail.cooperate);
            },
        },
        {
            key: 'cooperateRatio',
            label: '业绩比例',
            render: (detail) => {
                return getOptionName(PROJECT_ESTABLISH_RATIO, detail.cooperateRatio);
            },
        },
        {
            key: 'cooperateUserName',
            label: '合作人',
        },
        {
            key: 'cooperateDepartmentName',
            label: '所属部门',
        },
    ];
    if (Number(formData.cooperate) !== 1) {
        columns = [
            {
                key: 'cooperate',
                label: '业务双记',
                render: () => {
                    return '否';
                },
            },
            {},
            {},
            {},
        ];
    }
    return [columns];
};
export default getCooperateCols;
