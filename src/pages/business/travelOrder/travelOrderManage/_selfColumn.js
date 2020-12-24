import React from 'react';
import moment from 'moment';
import styles from './index.less';
import { renderTxt } from '@/utils/hoverPopover';
import AuthButton from '@/components/AuthButton';
import { TRAVEL_ORDER_TYPE, TRAVEL_ORDER_STATUS, TRAVEL_APPROVAL_STATUS, APPLY_FEEBEAR_PERSON } from '@/utils/enum';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { DATE_FORMAT } from '@/utils/constants';

// 获取table列表头
export default function columnsFn(props) {
    const columns = [
        {
            title: '订单号',
            dataIndex: 'orderCode',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text, 14)}</span>;
            },
            fixed: 'left',
            width: 100,
        },
        {
            title: '订单类型',
            dataIndex: 'orderType',
            render: (text) => {
                return getOptionName(TRAVEL_ORDER_TYPE, text);
            },
            fixed: 'left',
            width: 80,
        },
        {
            title: '下单人姓名',
            dataIndex: 'orderUserName',
            fixed: 'left',
            align: 'left',
            width: 100,
        },
        {
            title: '订单日期',
            dataIndex: 'orderDate',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            },
            width: 100,
        },
        {
            title: '订单金额',
            dataIndex: 'orderMoney',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 90,
        },
        {
            title: '保险金额',
            dataIndex: 'orderInsuranceMoney',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 90,
        },
        {
            title: '服务费',
            dataIndex: 'orderServiceMoney',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 70,
        },
        {
            title: '退改手续费',
            dataIndex: 'orderRefundChangeMoney',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '项目名称',
            dataIndex: 'applyProjectName',
            width: 100,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '合同名称',
            dataIndex: 'applyContractName',
            width: 85,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '艺人/博主',
            dataIndex: 'applyTalentName',
            width: 90,
        },
        {
            title: '费用承担主体',
            dataIndex: 'applyFeeBearCompanyName',
            width: 120,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '费用承担方',
            dataIndex: 'applyFeeBearType',
            render: (text) => {
                return getOptionName(APPLY_FEEBEAR_PERSON, text);
            },
            width: 100,
        },
        {
            title: '费用承担部门',
            dataIndex: 'applyFeeBearDeptName',
            width: 120,
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatus',
            render: (text) => {
                return getOptionName(TRAVEL_ORDER_STATUS, text);
            },
            width: 80,
        },
        {
            title: '审核状态',
            dataIndex: 'orderAuditStatus',
            render: (text) => {
                return getOptionName(TRAVEL_APPROVAL_STATUS, text);
            },
            width: 100,
        },
        {
            title: '操作',
            fixed: 'right',
            dataIndex: 'operate',
            width: 0,
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/travelOrder/travelOrderManage/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.checkData(record.orderId);
                                }}
                            >
                                查看
                            </span>
                        </AuthButton>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
