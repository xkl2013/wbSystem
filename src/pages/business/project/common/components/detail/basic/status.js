import { getOptionName } from '@/utils/utils';
import {
    PROJECT_ESTABLISH_TYPE_SHOW,
    PROJECTING_EXECTE_STATE,
    PROJECTING_SIGN_STATE,
    PROJECTING_STATE,
} from '@/utils/enum';

const getStatusCols = (formData, from) => {
    if (from === 'manage') {
        return [
            [
                {
                    key: 'projectingState',
                    label: '项目进展',
                    render: (detail) => {
                        return getOptionName(PROJECTING_STATE, detail.projectingState);
                    },
                },
                {
                    key: 'projectingSignState',
                    label: '签约状态',
                    render: (detail) => {
                        return getOptionName(PROJECTING_SIGN_STATE, detail.projectingSignState);
                    },
                },
                {
                    key: 'projectingExecteState',
                    label: '执行状态',
                    render: (detail) => {
                        return getOptionName(PROJECTING_EXECTE_STATE, detail.projectingExecteState);
                    },
                },
                {},
            ],
        ];
    }
    return [
        [
            {
                key: 'projectingApprovalState',
                label: '立项状态',
                render: (detail) => {
                    return getOptionName(PROJECT_ESTABLISH_TYPE_SHOW, detail.projectingApprovalState);
                },
            },
            {},
            {},
            {},
        ],
    ];
};
export default getStatusCols;
