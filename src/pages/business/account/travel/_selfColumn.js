import AuthButton from '@/components/AuthButton';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import {
    BX_FEE_TYPE,
    TRAVEL_PROCEEDING,
    ORDER_INVOICE_TYPE,
    EXPENSES_BUSINESS_STATE,
    TRAVEL_ORDER_STATUS,
    TRAVEL_ORDER_TYPE,
    PROJECT_TYPE,
    TRANSMIT_NC_STATUS,
} from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';

// 获取table列表头
export function columnsFn(props) {
    const columns = [
        {
            title: '业务类型',
            dataIndex: 'travelBusinessType',
            render: (text, data) => {
                return '差旅';
            },
            width: 100,
        },
        {
            title: '费用类型',
            dataIndex: 'travelFeeType',
            render: (text, data) => {
                return getOptionName(BX_FEE_TYPE, text);
            },
            width: 100,
        },
        {
            title: '事项',
            dataIndex: 'travelThings',
            render: (text, data) => {
                return getOptionName(TRAVEL_PROCEEDING, text);
            },
            width: 100,
        },
        {
            title: '订单号',
            dataIndex: 'travelOrderNo',
            width: 100,
        },
        {
            title: '订单类型',
            dataIndex: 'travelOrderType',
            render: (text, data) => {
                return getOptionName(TRAVEL_ORDER_TYPE, text);
            },
            width: 100,
        },
        {
            title: '订单日期',
            dataIndex: 'travelOrderDate',
            render: text => {
                return text === null ? '' : String(text).slice(0, 10);
            },
            width: 100,
        },
        {
            title: '审批通过日期',
            dataIndex: 'travelAuditFinishTime',
            render: text => {
                return text === null ? '' : String(text).slice(0, 10);
            },
            width: 110,
        },
        {
            title: '付款完成日期',
            dataIndex: 'travelPayConfirmTime',
            render: text => {
                return text === null ? '' : String(text).slice(0, 10);
            },
            width: 100,
        },
        {
            title: '订单金额',
            dataIndex: 'travelOrderMoney',
            render: text => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '保险金额',
            dataIndex: 'travelInsuranceMoney',
            render: text => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '发票类型',
            dataIndex: 'travelInvoiceType',
            render: (text, data) => {
                return getOptionName(ORDER_INVOICE_TYPE, text);
            },
            width: 100,
        },
        {
            title: '税额',
            dataIndex: 'travelTaxMoney',
            render: text => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '未税金额',
            dataIndex: 'travelNoTaxMoney',
            render: text => {
                return thousandSeparatorFixed(text);
            },
            width: 150,
        },
        {
            title: '服务费',
            dataIndex: 'travelServiceMoney',
            render: text => {
                return thousandSeparatorFixed(text);
            },
            width: 100,
        },
        {
            title: '退改手续费',
            dataIndex: 'travelRefundChangeMoney',
            render: text => {
                return thousandSeparatorFixed(text);
            },
            width: 110,
        },
        {
            title: '下单人姓名',
            dataIndex: 'travelOrderUserName',
            width: 100,
        },
        {
            title: '订单状态',
            dataIndex: 'travelOrderStatus',
            render: text => {
                return getOptionName(TRAVEL_ORDER_STATUS, text);
            },
            width: 110,
        },
        {
            title: '出差申请编号',
            dataIndex: 'travelApplyCode',
            width: 100,
        },
        {
            title: '申请人',
            dataIndex: 'travelApplyUserName',
            width: 100,
        },
        {
            title: '项目类型',
            dataIndex: 'travelProjectType',
            render: text => {
                return getOptionName(PROJECT_TYPE, text);
            },
            width: 100,
        },
        {
            title: '艺人/博主',
            dataIndex: 'travelTalentName',
            width: 100,
        },
        {
            title: '费用承担部门',
            dataIndex: 'travelFeeBearDeptName',
            width: 100,
        },
        {
            title: '费用承担主体',
            dataIndex: 'travelFeeBearCompanyName',
            width: 110,
        },
        {
            title: '供应商',
            dataIndex: 'travelReceiveFromName',
            width: 110,
        },
        {
            title: '付款账号',
            dataIndex: 'travelPayAccount',
            width: 110,
        },
        {
            title: '事由',
            dataIndex: 'travelReason',
            render: text => {
                return renderTxt(text, 20);
            },
            width: 100,
        },
        {
            title: '操作人',
            dataIndex: 'travelOperatorName',
            width: 100,
        },
        {
            title: '传送NC时间',
            dataIndex: 'travelNcTime',
            width: 100,
        },
        {
            title: '传送NC状态',
            dataIndex: 'travelNcStatus',
            render: text => {
                return getOptionName(TRANSMIT_NC_STATUS, text);
            },
            width: 100,
        },
        {
            title: '备注',
            dataIndex: 'travelNcMark',
            width: 100,
            render: text => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '操作',
            dataIndex: '',
            width: 70,
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/feeManage/reimbursement/detail">
                            <span
                                style={{ color: '#ccc', cursor: 'no-drop' }}
                                // style={{ color: '#88B5FF', cursor: 'pointer' }}
                                title="暂不提供此功能"
                                // onClick={() => props.checkData(record.applicationId)}
                            >
                                {' '}
                                编辑
                            </span>
                        </AuthButton>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
