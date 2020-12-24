import { getOptionName } from '@/utils/utils';
import { GUEST_TYPE, PROGRAMME_TYPE } from '@/utils/enum';

const getVarietyCols = [
    [
        {
            key: 'projectingProgrammeType',
            label: '节目类型',
            render: (detail) => {
                return getOptionName(PROGRAMME_TYPE, detail.projectingProgrammeType);
            },
        },
        {
            key: 'projectingGuestType',
            label: '嘉宾类型',
            render: (detail) => {
                return getOptionName(GUEST_TYPE, detail.projectingGuestType);
            },
        },
        { key: 'projectingGuestOther', label: '其他嘉宾' },
        {},
    ],
];
export default getVarietyCols;
