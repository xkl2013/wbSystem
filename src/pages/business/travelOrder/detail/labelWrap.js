import moment from 'moment';
import {
    TRAVEL_ORDER_TYPE,
    TRAVEL_ORDER_STATUS,
    PROJECT_TYPE,
    TRAVEL_APPROVAL_STATUS,
    APPLY_FEEBEAR_TYPE,
} from '@/utils/enum';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { DATE_FORMAT, DATETIME_FORMAT } from '@/utils/constants';

export const LabelWrap1 = [
    [
        { key: 'orderCode', label: '订单号' },
        {
            key: 'orderDate',
            label: '订单日期',
            render: (d) => {
                return d.orderDate && moment(d.orderDate).format(DATE_FORMAT);
            },
        },
        {
            key: 'orderType',
            label: '订单类型',
            render: (d) => {
                return getOptionName(TRAVEL_ORDER_TYPE, d.orderType);
            },
        },
        {
            key: 'orderInsuranceMoney',
            label: '保险金额',
            render: (d) => {
                return d.orderInsuranceMoney && thousandSeparatorFixed(d.orderInsuranceMoney);
            },
        },
    ],
    [
        {
            key: 'orderMoney',
            label: '订单金额',
            render: (d) => {
                return d.orderMoney && thousandSeparatorFixed(d.orderMoney);
            },
        },
        {
            key: 'orderRefundChangeMoney',
            label: '退改手续费',
            render: (d) => {
                return d.orderRefundChangeMoney && thousandSeparatorFixed(d.orderRefundChangeMoney);
            },
        },
        {
            key: 'orderServiceMoney',
            label: '服务费',
            render: (d) => {
                return d.orderServiceMoney && thousandSeparatorFixed(d.orderServiceMoney);
            },
        },
        { key: 'orderUserName', label: '下单人姓名' },
    ],
    [
        {
            key: 'orderStatus',
            label: '订单状态',
            render: (d) => {
                return getOptionName(TRAVEL_ORDER_STATUS, d.orderStatus);
            },
        },
        { key: 'orderChangeReason', label: '改签原因' },
        { key: 'orderRefundReason', label: '退订原因' },
    ],
];
export const LabelWrap2 = [
    [
        {
            key: 'orderAuditStatus',
            label: '审核状态',
            render: (d) => {
                return getOptionName(TRAVEL_APPROVAL_STATUS, d.orderAuditStatus);
            },
        },
        {
            key: 'orderAuditTime',
            label: '审核时间',
            render: (d) => {
                return d.orderAuditTime && moment(d.orderAuditTime).format(DATETIME_FORMAT);
            },
        },
        { key: 'orderAuditUserName', label: '审核人' },
        {},
    ],
];

export const applicationDetail = [
    [
        { key: 'applyCode', label: '出差申请编号' },
        {
            key: 'applyUserName',
            label: '申请人',
        },
        {
            key: 'applyDeptName',
            label: '申请人所属部门',
        },
        { key: 'applyCompanyName', label: '申请人所属公司' },
    ],
    [
        {
            key: 'applyDate',
            label: '申请日期',
            render: (record) => {
                return record.applyDate && moment(record.applyDate).format(DATE_FORMAT);
            },
        },
        { key: 'applyUserPosition', label: '申请人岗位' },
        { key: 'applyUserPositionLevel', label: '申请人职级' },
        { key: 'applyUserMobile', label: '申请人移动电话' },
    ],
    [
        {
            key: 'applyProjectType',
            label: '项目类别',
            render: (d) => {
                return getOptionName(PROJECT_TYPE, d.applyProjectType);
            },
        },
        { key: 'applyProjectName', label: '项目' },
        { key: 'applyContractName', label: '合同' },
        { key: 'applyTalentName', label: '艺人/博主' },
    ],
    [
        {
            key: 'applyFeeBearType',
            label: '费用承担方',
            render: (d) => {
                return getOptionName(APPLY_FEEBEAR_TYPE, d.applyFeeBearType);
            },
        },
        { key: 'applyFeeBearDeptName', label: '费用承担部门' },
        { key: 'applyFeeBearCompanyName', label: '费用承担主体' },
        {},
    ],
];
