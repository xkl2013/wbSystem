import moment from 'moment';
import styles from './index.less';
import { getProjectList } from '../services';
import { getCustomerList, getTalentList, getUserList } from '@/services/globalSearchApi';
import { PROJECT_ESTABLISH_TYPE, PROJECT_TYPE } from '@/utils/enum';
import { str2intArr } from '@/utils/utils';
import { DATETIME_FORMAT } from '@/utils/constants';

export const searchCols = [
    [
        {
            key: 'projectingName',
            type: 'associationSearchFilter',
            placeholder: '请输入项目名称',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getProjectList({ pageNum: 1, pageSize: 50, projectingName: val });
                },
                fieldNames: { value: 'projectingId', label: 'projectingName' },
                initDataType: 'onfocus',
            },
        },
        {
            key: 'projectingCustomerName',
            type: 'associationSearchFilter',
            placeholder: '请输入公司名称',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getCustomerList({ customerName: val });
                },
                fieldNames: { value: 'id', label: 'customerName' },
                initDataType: 'onfocus',
            },
        },
        {
            key: 'projectingHeaderName',
            type: 'associationSearchFilter',
            placeholder: '请输入负责人',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getUserList({ userChsName: val });
                },
                fieldNames: { value: 'userId', label: 'userChsName' },
                initDataType: 'onfocus',
            },
        },
    ],
    [
        {
            key: 'talentsName',
            type: 'associationSearchFilter',
            placeholder: '请输入目标艺人或博主',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getTalentList({ talentName: val });
                },
                fieldNames: {
                    value: (val) => {
                        return `${val.talentId}_${val.talentType}`;
                    },
                    label: 'talentName',
                },
                initDataType: 'onfocus',
            },
        },
    ],
];
export const advancedSearchCols = [
    [
        {
            key: 'projectingSigningDate',
            label: '签约日期',
            type: 'daterange',
            placeholder: ['签约开始日期', '签约结束日期'],
            className: styles.dateRangeCls,
        },
    ],
    [
        {
            key: 'projectingApprovalStates',
            type: 'checkbox',
            label: '立项状态',
            options: PROJECT_ESTABLISH_TYPE,
        },
    ],
    [
        {
            key: 'projectingTypes',
            type: 'checkbox',
            label: '项目类型',
            options: PROJECT_TYPE,
        },
    ],
    [
        {
            key: 'projectingBudgetStart',
            label: '签单额',
            placeholder: '请输入',
            type: 'numberRange',
        },
    ],
];
export const formatSearchData = (searchData) => {
    const data = searchData;
    // 项目名称
    if (data.projectingName !== undefined) {
        data.projectingName = data.projectingName.label;
    }
    // 公司名称
    if (data.projectingCustomerName !== undefined) {
        data.projectingCustomerName = data.projectingCustomerName.label;
    }
    // 负责人名称
    if (data.projectingHeaderName !== undefined) {
        data.projectingHeaderName = data.projectingHeaderName.label;
    }
    // 艺人名称
    if (data.talentsName !== undefined) {
        data.talentsName = data.talentsName.label;
    }
    // 立项状态
    if (data.projectingApprovalStates !== undefined && data.projectingApprovalStates.length > 0) {
        data.projectingApprovalStates = str2intArr(data.projectingApprovalStates).join(',');
    }
    // 项目类型
    if (data.projectingTypes !== undefined && data.projectingTypes.length > 0) {
        data.projectingTypes = str2intArr(data.projectingTypes).join(',');
    }
    // 签约时间
    if (data.projectingSigningDate && data.projectingSigningDate.length) {
        data.projectingSigningDateStart = moment(data.projectingSigningDate[0]).format(DATETIME_FORMAT);
        data.projectingSigningDateEnd = moment(data.projectingSigningDate[1]).format(DATETIME_FORMAT);
        delete data.projectingSigningDate;
    }
    // 签单额
    if (data.projectingBudgetStart) {
        data.projectingBudgetEnd = data.projectingBudgetStart.max;
        data.projectingBudgetStart = data.projectingBudgetStart.min;
    }
    return data;
};
export default searchCols;
