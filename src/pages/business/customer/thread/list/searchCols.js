import { getTrailsList } from '@/pages/business/customer/thread/services';
import { getCustomerBusiness, getCustomerList, getTalentList, getUserList } from '@/services/globalSearchApi';
import { COMPANY_TYPE, THREAD_STATUS, THREAD_TYPE } from '@/utils/enum';
import styles from './index.less';

export const searchCols = [
    [
        {
            key: 'trail',
            type: 'associationSearchFilter',
            placeholder: '请输入线索名称',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getTrailsList({
                        trailName: val || '',
                        pageSize: 50,
                        pageNum: 1,
                    });
                },
                fieldNames: { value: 'trailId', label: 'trailName' },
                initDataType: 'onfocus',
            },
        },
        {
            key: 'company',
            type: 'associationSearchFilter',
            placeholder: '请输入公司名称',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getCustomerList({
                        customerName: val || '',
                    });
                },
                fieldNames: { value: 'id', label: 'customerName' },
                initDataType: 'onfocus',
            },
        },
        {
            key: 'trailBrand',
            type: 'associationSearchFilter',
            placeholder: '请输入品牌名称',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getCustomerBusiness({ businessName: val || '', pageSize: 50, pageNum: 1 });
                },
                fieldNames: { value: 'id', label: 'businessName' },
                initDataType: 'onfocus',
            },
        },
    ],
    [
        {
            key: 'trailHeader',
            type: 'associationSearchFilter',
            placeholder: '请输入负责人',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                },
                fieldNames: { value: 'userId', label: 'userChsName' },
                initDataType: 'onfocus',
            },
        },
        {
            key: 'talent',
            type: 'associationSearchFilter',
            placeholder: '请输入目标或推荐艺人/博主',
            className: styles.searchCls,
            componentAttr: {
                request: (val) => {
                    return getTalentList({ talentName: val, pageSize: 50, pageNum: 1 });
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
            className: styles.searchCls,
        },
    ],
];
export const advancedSearchCols = [
    [
        {
            key: 'trailCooperationDate',
            label: '预计合作日期',
            type: 'daterange',
            placeholder: ['预计开始日期', '预计结束日期'],
            className: styles.dateRangeCls,
        },
    ],
    [
        {
            key: 'trailTypeList',
            type: 'checkbox',
            label: '线索类型',
            options: THREAD_TYPE,
        },
    ],
    [
        {
            key: 'trailStatusList',
            type: 'checkbox',
            label: '线索状态',
            options: THREAD_STATUS,
        },
    ],
    [
        {
            key: 'trailCustomerTypeList',
            type: 'checkbox',
            label: '公司类型',
            options: COMPANY_TYPE,
        },
    ],
    [
        {
            key: 'trailCooperationBudget',
            label: '预估签单额',
            placeholder: '请输入',
            type: 'numberRange',
            componentAttr: {
                placeholders: { min: '最小预算金额', max: '最大预算金额' },
            },
        },
    ],
];
export const formatSearchData = (params) => {
    const returnObj = {};
    Object.keys(params).forEach((item) => {
        const obj = params[item];
        if (!obj) {
            return;
        }
        switch (item) {
            case 'trail':
                returnObj.trailName = obj.label;
                returnObj.trailId = obj.value;
                break;
            case 'company':
                returnObj.trailCustomerName = obj.label;
                returnObj.companyId = obj.value;
                break;
            case 'trailBrand':
                returnObj.trailBrandName = obj.label;
                returnObj.trailBrandId = obj.value;
                break;
            case 'trailHeader':
                returnObj.trailHeaderName = obj.label;
                returnObj.trailHeaderId = obj.value;
                break;
            case 'talent':
                returnObj.trailTalentName = obj.label;
                const value = obj.value;
                returnObj.talentId = value && value.split('_')[0];
                break;
            case 'trailCooperationDate':
                if (obj.length) {
                    returnObj.trailCooperationDateStart = obj[0].format('YYYY-MM-DD HH:mm:ss');
                    returnObj.trailCooperationDateEnd = obj[1].format('YYYY-MM-DD HH:mm:ss');
                }
                break;
            case 'trailTypeList':
                returnObj.trailTypeList = obj.map((ls) => {
                    return Number(ls);
                });
                break;
            case 'trailCustomerTypeList':
                returnObj.trailCustomerTypeList = obj.map((ls) => {
                    return Number(ls);
                });
                break;
            case 'trailStatusList':
                returnObj.trailStatusList = obj.map((ls) => {
                    return Number(ls);
                });
                break;
            case 'trailCooperationBudget':
                returnObj.trailCooperationBudgetMin = obj.min ? Number(obj.min) : undefined;
                returnObj.trailCooperationBudgetMax = obj.max ? Number(obj.max) : undefined;
                break;
            default:
                returnObj[item] = obj;
                break;
        }
    });
    return returnObj;
};
export default searchCols;
