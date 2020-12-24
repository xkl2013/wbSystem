import moment from 'moment';
import { getCustomerList, getTalentList, getUserList } from '@/services/globalSearchApi';
import {
    CONTRACT_END_STATUS,
    CONTRACT_FEE_STATUS,
    PROJECT_MONEY_STATUS,
    // CONTRACT_SETTLEMENT_STATUS,
    PROJECT_TYPE,
    PROJECTING_EXECTE_STATE,
    PROJECTING_SIGN_STATE,
    CONTRACT_REIMBURSE_STATUS,
} from '@/utils/enum';
import { DATETIME_FORMAT } from '@/utils/constants';
import { getProjectList } from '../services';
import styles from './index.less';

export const searchCols = [
    [
        {
            key: 'projectName',
            type: 'associationSearchFilter',
            placeholder: '请输入项目名称',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getProjectList({
                        pageNum: 1,
                        pageSize: 100,
                        projectName: val,
                        projectBaseType: 1,
                    });
                },
                fieldNames: { value: 'projectingId', label: 'projectingName' },
                initDataType: 'onfocus',
            },
        },
        {
            key: 'projectCustomerName',
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
            key: 'projectHeaderName',
            type: 'associationSearchFilter',
            placeholder: '请输入负责人',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getUserList({ pageNum: 1, pageSize: 100, userChsName: val });
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
                    return getTalentList({ pageNum: 1, pageSize: 100, talentName: val });
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
        {
            key: 'projectingCode',
            placeholder: '请输入项目编号',
            className: styles.searchCls,
        },
        {},
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
            key: 'projectingLiveTime',
            label: '执行日期',
            type: 'daterange',
            placeholder: ['开始日期', '结束日期'],
            className: styles.dateRangeCls,
        },
    ],
    [
        {
            key: 'projectTypeList',
            type: 'checkbox',
            label: '项目类型',
            options: PROJECT_TYPE,
        },
    ],
    [
        {
            key: 'projectingSignStateList',
            type: 'checkbox',
            label: '签约状态',
            options: PROJECTING_SIGN_STATE,
        },
    ],
    [
        {
            key: 'projectingExecteStateList',
            type: 'checkbox',
            label: '执行状态',
            options: PROJECTING_EXECTE_STATE,
        },
    ],
    [
        {
            key: 'returnStatusList',
            type: 'checkbox',
            label: '回款状态',
            options: PROJECT_MONEY_STATUS,
        },
    ],
    [
        {
            key: 'reimburseStatusList',
            type: 'checkbox',
            label: '报销状态',
            options: CONTRACT_REIMBURSE_STATUS,
        },
    ],
    [
        {
            key: 'expenseConfirmStatusList',
            type: 'checkbox',
            label: '费用确认状态',
            options: CONTRACT_FEE_STATUS,
        },
    ],
    // [
    //     {
    //         key: 'settleStatusList',
    //         type: 'checkbox',
    //         label: '结算状态',
    //         options: CONTRACT_SETTLEMENT_STATUS,
    //     },
    // ],
    [
        {
            key: 'endStatusList',
            type: 'checkbox',
            label: '结案状态',
            options: CONTRACT_END_STATUS,
        },
    ],
    [
        {
            key: 'projectBudgetStart',
            label: '签单额',
            placeholder: '请输入',
            type: 'numberRange',
        },
    ],
];
export const formatSearchData = (searchData) => {
    const data = searchData;
    // 项目名称
    if (data.projectName !== undefined) {
        data.projectName = data.projectName.label;
    }
    // 公司名称
    if (data.projectCustomerName !== undefined) {
        data.projectCustomerName = data.projectCustomerName.label;
    }
    // 负责人名称
    if (data.projectHeaderName !== undefined) {
        data.projectHeaderName = data.projectHeaderName.label;
    }
    // 艺人名称
    if (data.talentsName !== undefined) {
        data.talentsName = data.talentsName.label;
    }
    // 签约时间
    if (data.projectingSigningDate && data.projectingSigningDate.length) {
        data.projectSigningDateStart = moment(data.projectingSigningDate[0]).format(DATETIME_FORMAT);
        data.projectSigningDateEnd = moment(data.projectingSigningDate[1]).format(DATETIME_FORMAT);
        delete data.projectingSigningDate;
    }
    // 执行时间
    if (data.projectingLiveTime && data.projectingLiveTime.length) {
        data.startLiveTime = moment(data.projectingLiveTime[0]).format(DATETIME_FORMAT);
        data.endLiveTime = moment(data.projectingLiveTime[1]).format(DATETIME_FORMAT);
        delete data.projectingLiveTime;
    }
    // 合作预算
    if (data.projectBudgetStart) {
        data.projectBudgetEnd = data.projectBudgetStart.max;
        data.projectBudgetStart = data.projectBudgetStart.min;
    }
    return data;
};
export default searchCols;
