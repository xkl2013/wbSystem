import React from 'react';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { FEE_TYPE, SETTLEMENT_TYPE, PUSHACCOUNTSTATUS } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import Information from '@/components/informationModel';
// 结算详情 - 基本信息
export const labelWrap11 = () => {
    const columns = [
        {
            key: 'createTime',
            label: '申请日期',
            render: (text) => {
                return text.createTime ? text.createTime.slice(0, 10) : null;
            },
        },
        {
            key: 'applyUserName',
            label: '申请人',
        },
        {
            key: 'applyUserDeptName',
            label: '申请人所在部门',
        },
        {
            key: 'projectCode',
            label: '项目编号',
        },
        {
            key: 'projectName',
            label: '项目名称',
            render: (d) => {
                const data = [
                    {
                        ...d.projectName,
                        id: d.projectId,
                        name: d.projectName,
                        path: '/foreEnd/business/project/manage/detail',
                    },
                ];
                return <Information data={data} hoverPopover={true} />;
            },
        },
        {
            key: 'contractCode',
            label: '合同编号',
        },
        {
            key: 'contractName',
            label: '合同名称',
            render: (d) => {
                const data = [
                    {
                        ...d.contractName,
                        id: d.contractId,
                        name: d.contractName,
                        path: '/foreEnd/business/project/contract/detail',
                    },
                ];
                if (d === '无合同') {
                    return d;
                }
                return <Information data={data} hoverPopover={true} />;
            },
        },
        {
            key: 'talentName',
            label: '艺人/博主',
            render: (d) => {
                const data = [
                    {
                        ...d.talentName,
                        id: d.talentId,
                        name: d.talentName,
                        path:
                            d.talentType === 0
                                ? '/foreEnd/business/talentManage/talent/actor/detail'
                                : '/foreEnd/business/talentManage/talent/blogger/detail',
                    },
                ];
                return <Information data={data} hoverPopover={true} />;
            },
        },
        {
            key: 'oughtSettleAmountEstimate',
            label: '应结算金额（预估）',
            render: (text) => {
                return `${thousandSeparatorFixed(text.oughtSettleAmountEstimate)}元`;
            },
        },
        {
            key: 'oughtSettleAmountAdjustment',
            label: '应结算金额（调整）',
            render: (text) => {
                return `${thousandSeparatorFixed(text.oughtSettleAmountAdjustment)}元`;
            },
        },
        {
            key: 'oughtSettleAmountTruly',
            label: '应结算金额（实际）',
            render: (text) => {
                return `${thousandSeparatorFixed(text.oughtSettleAmountTruly)}元`;
            },
        },
        {
            key: 'brokerageEstimate',
            label: '佣金（预估）',
            render: (text) => {
                return `${thousandSeparatorFixed(text.brokerageEstimate)}元`;
            },
        },
        {
            key: 'brokerageAdjustment',
            label: '佣金（调整）',
            render: (text) => {
                return `${thousandSeparatorFixed(text.brokerageAdjustment)}元`;
            },
        },
        {
            key: 'brokerage',
            label: '佣金',
            render: (text) => {
                return `${thousandSeparatorFixed(text.brokerage)}元`;
            },
        },
        {
            key: 'dividedIntoHandAmount',
            label: '分成到手金额',
            render: (text) => {
                return `${thousandSeparatorFixed(text.dividedIntoHandAmount)}元`;
            },
        },
        {
            key: 'chequesSettlementWay',
            label: '结算方式',
            render: (text) => {
                return getOptionName(SETTLEMENT_TYPE, text.chequesSettlementWay);
            },
        },
        {
            key: 'talentDivideProportion',
            label: '艺人/博主分成比',
            render: (text) => {
                return `${Number(text.talentDivideProportion) * 100}%`;
            },
        },
        {
            key: 'payRuleDetailDtos',
            label: '付款规则',
            render: (text) => {
                if (Array.isArray(text.payRuleDetailDtos)) {
                    if (text.payRuleDetailDtos.length === 1) {
                        return '单一供应商付款';
                    }
                    if (text.payRuleDetailDtos.length > 1) {
                        return '多供应商付款';
                    }
                    return null;
                }
                return null;
            },
        },
        {
            key: 'adjustmentReason',
            label: '调整原因',
            render: (text) => {
                return (
                    <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {renderTxt(String(text.adjustmentReason))}
                    </span>
                );
            },
        },
    ];
    let temp = [];
    const newArr = [];
    columns.map((item) => {
        if (item.isHide) {
            return;
        }
        if (temp.length === 4) {
            newArr.push(temp);
            temp = [];
        }
        temp.push(item);
    });
    if (temp.length > 0) {
        newArr.push(temp);
    }
    return newArr;
};

// 结算详情 - 费用明细
export const labelWrap12 = () => {
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            width: 80,
            render: (...argu) => {
                return argu[2] + 1;
            },
        },
        {
            title: '费用类型',
            dataIndex: 'feeTypeName',
            align: 'center',
        },
        {
            title: '费用实际承担方',
            dataIndex: 'reimburseFeeTrulyTaker',
            align: 'center',
            render: (text) => {
                return getOptionName(FEE_TYPE, text);
            },
        },
        {
            title: '金额',
            dataIndex: 'feeAmount',
            align: 'center',
            render: (text) => {
                return `${thousandSeparatorFixed(text)}元`;
            },
        },
        {
            title: '费用发生日期',
            dataIndex: 'feeProduceTime',
            align: 'center',
            render: (text) => {
                return text ? text.slice(0, 10) : null;
            },
        },
        // {
        //     title: '操作',
        //     align: 'center',
        //     dataIndex: 'operate',
        //     render: (text, record) => {
        //         return (
        //             <div>
        //                 <button
        //                     type="button"
        //                     style={{
        //                         color: '#88B5FF',
        //                         cursor: 'pointer',
        //                         outline: 'none',
        //                         margin: 0,
        //                         padding: 0,
        //                         backgroundColor: 'transparent',
        //                         border: 'none',
        //                     }}
        //                     onClick={() => {
        //                         return props.takerShow(record.reimburseFeeTrulyTaker);
        //                     }}
        //                 >
        //                     {text}
        //                     编辑
        //                 </button>
        //             </div>
        //         );
        //     },
        // },
    ];
    return columns;
};

// 结算详情 - 付款规则明细
export const labelWrap13 = (props) => {
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            width: 80,
            render: (...argu) => {
                return argu[2] + 1;
            },
        },
        {
            title: '付款金额',
            dataIndex: 'payAcount',
            align: 'center',
            render: (text) => {
                return `${thousandSeparatorFixed(text)}`;
            },
        },
        {
            title: '供应商名称',
            dataIndex: 'supplierAccountName',
            align: 'center',
        },
        {
            title: '银行账号',
            dataIndex: 'bankAcountNo',
            align: 'center',
        },
        {
            title: '开户银行',
            dataIndex: 'bankAddress',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <button
                            type="button"
                            style={{
                                color: '#04B4AD',
                                cursor: 'pointer',
                                outline: 'none',
                                margin: 0,
                                padding: 0,
                                backgroundColor: 'transparent',
                                border: 'none',
                            }}
                            onClick={() => {
                                return props.supplierShow(record);
                            }}
                        >
                            {text}
                            编辑
                        </button>
                    </div>
                );
            },
        },
    ];
    return columns;
};

// 成本差异调整 - 成本差异调整
export function columnsFn(formData) {
    const labelWrap21 = [
        {
            title: '艺人/博主',
            dataIndex: 'talentName',
            align: 'center',
            render: (d, record) => {
                const data = [
                    {
                        ...d,
                        id: record.talentId,
                        name: record.talentName,
                        path:
                            record.talentType === 0
                                ? '/foreEnd/business/talentManage/talent/actor/detail'
                                : '/foreEnd/business/talentManage/talent/blogger/detail',
                    },
                ];
                return <Information data={data} hoverPopover={true} />;
            },
        },
        {
            title: '累计确认成本金额',
            dataIndex: 'totalConfirmCostAmount',
            render: (text) => {
                return `${thousandSeparatorFixed(text)}元`;
            },
            align: 'center',
        },
        {
            title: '累计结算金额（含税）',
            dataIndex: 'totalSettlementAmountIncludeTax',
            align: 'center',
            render: (text) => {
                return `${thousandSeparatorFixed(text)}元`;
            },
        },
        {
            title: '累计结算金额(未税)',
            dataIndex: 'totalSettlementAmountNotTax',
            align: 'center',
            render: (text) => {
                return `${thousandSeparatorFixed(text)}元`;
            },
        },
        {
            title: '累计结算金额(税额)',
            dataIndex: 'totalSettlementAmountTax',
            align: 'center',
            render: (text) => {
                return `${thousandSeparatorFixed(text)}元`;
            },
        },
        {
            title: '成本调整金额(参考)',
            dataIndex: 'costAdjustmentAmountReference',
            align: 'center',
            render: (text) => {
                return `${thousandSeparatorFixed(text)}元`;
            },
        },
        {
            title: '成本调整金额(调整)',
            dataIndex: 'costAdjustmentAmountAdjust',
            align: 'center',
            render: (text) => {
                return `${thousandSeparatorFixed(text)}元`;
            },
        },
        {
            title: '成本调整金额',
            dataIndex: 'costAdjustmentAmount',
            align: 'center',
            render: (text) => {
                return `${thousandSeparatorFixed(text)}元`;
            },
        },
        {
            title: '传送台帐状态',
            dataIndex: 'transferLedgerStatus',
            align: 'center',
            render: (text) => {
                return getOptionName(PUSHACCOUNTSTATUS, text);
            },
        },
        {
            title: '传送台帐时间',
            dataIndex: 'transferLedgerTime',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <button
                            type="button"
                            style={
                                record.transferLedgerStatus === 0
                                    ? {
                                        color: '#04B4AD',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        margin: '0 5px',
                                        padding: 0,
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                    }
                                    : {
                                        color: '#ccc',
                                        cursor: 'no-drop',
                                        outline: 'none',
                                        margin: '0 5px',
                                        padding: 0,
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                    }
                            }
                            onClick={() => {
                                return record.transferLedgerStatus === 0 ? formData.differentChangeOpen(record) : null;
                            }}
                        >
                            {text}
                            成本差异调整
                        </button>
                        <button
                            type="button"
                            style={
                                record.transferLedgerStatus === 0
                                    ? {
                                        color: '#04B4AD',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        margin: '0 5px',
                                        padding: 0,
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                    }
                                    : {
                                        color: '#ccc',
                                        cursor: 'no-drop',
                                        outline: 'none',
                                        margin: '0 5px',
                                        padding: 0,
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                    }
                            }
                            onClick={() => {
                                return record.transferLedgerStatus === 0
                                    ? formData.showModalPushAccount(record.id)
                                    : null;
                            }}
                        >
                            {text}
                            发送台账
                        </button>
                    </div>
                );
            },
        },
    ];
    return labelWrap21;
}
