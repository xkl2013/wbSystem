/*
 * @Author: your name
 * @Date: 2020-01-02 11:01:31
 * @LastEditTime : 2020-01-08 19:22:37
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/common/dataChange/labelWrap.js
 */
import React from 'react';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import Information from '@/components/informationModel';
import { PROJECT_ESTABLISH_TYPE2, COMPANY_TYPE, BLOGGER_SIGN_STATE } from '@/utils/enum';
import { getCommerceId } from '@/services/comment';
import styles from './index.less';
import { getHandoverFromFlowMark } from '../services';

// 合同
export const columns7 = [
    {
        title: '合同名称',
        dataIndex: 'contractName',
        align: 'center',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.id,
                    name: record.contractName,
                    path: '/foreEnd/business/project/contract/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '项目名称',
        dataIndex: 'projectName',
        align: 'center',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.projectId,
                    name: record.projectName,
                    path: '/foreEnd/business/project/manage/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '客户名称',
        dataIndex: 'customerName',
        align: 'center',
        render: (d, record) => {
            return (
                Array.isArray(record.customers)
                && record.customers.map((item) => {
                    const data = [
                        {
                            id: item.id,
                            name: item.name,
                            path: '/foreEnd/business/customer/customer/detail',
                        },
                    ];
                    return <Information data={data} hoverPopover={true} />;
                })
            );
        },
    },
    {
        title: '合同金额',
        dataIndex: 'contractAmount',
        align: 'center',
        render: (text) => {
            return `${thousandSeparatorFixed(text)}元`;
        },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: (d, record) => {
            return (
                <span
                    className={styles.operateBtn}
                    onClick={() => {
                        window.open(`/foreEnd/business/project/contract/detail?id=${record.id}`);
                    }}
                >
                    查看
                </span>
            );
        },
    },
];

// 立项
export const columns5 = [
    {
        title: '项目名称',
        dataIndex: 'projectName',
        align: 'center',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.projectId,
                    name: record.projectName,
                    path: '/foreEnd/business/project/establish/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '公司名称',
        dataIndex: 'companyName',
        align: 'center',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.companyId,
                    name: record.companyName,
                    path: '/foreEnd/business/customer/customer/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '目标艺人/博主',
        dataIndex: 'talentName',
        align: 'center',
        render: (d, record) => {
            return (
                <div className={styles.moreLine}>
                    {Array.isArray(record.talents)
                        && record.talents.map((item) => {
                            const data = [
                                {
                                    id: item.id,
                                    name: item.name,
                                    path:
                                        item.type === 0
                                            ? '/foreEnd/business/talentManage/talent/actor/detail'
                                            : '/foreEnd/business/talentManage/talent/blogger/detail',
                                },
                            ];
                            return <Information data={data} hoverPopover={true} />;
                        })}
                </div>
            );
        },
    },
    {
        title: '签单额',
        dataIndex: 'orderAmount',
        align: 'center',
        render: (text) => {
            return `${thousandSeparatorFixed(text)}元`;
        },
    },
    {
        title: '立项状态',
        dataIndex: 'projectingStatus',
        align: 'center',
        render: (text) => {
            return getOptionName(PROJECT_ESTABLISH_TYPE2, text);
        },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: (d, record) => {
            return (
                <span
                    className={styles.operateBtn}
                    onClick={() => {
                        window.open(`/foreEnd/business/project/establish/detail?id=${record.id}`);
                    }}
                >
                    查看
                </span>
            );
        },
    },
];

// 项目
export const columns6 = [
    {
        title: '项目名称',
        dataIndex: 'projectName',
        align: 'center',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.id,
                    name: record.projectName,
                    path: '/foreEnd/business/project/manage/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '公司名称',
        dataIndex: 'companyName',
        align: 'center',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.companyId,
                    name: record.companyName,
                    path: '/foreEnd/business/customer/customer/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '目标艺人/博主',
        dataIndex: 'talentName',
        align: 'center',
        render: (d, record) => {
            return (
                <div className={styles.moreLine}>
                    {Array.isArray(record.talents)
                        && record.talents.map((item) => {
                            const data = [
                                {
                                    id: item.id,
                                    name: item.name,
                                    path:
                                        item.type === 0
                                            ? '/foreEnd/business/talentManage/talent/actor/detail'
                                            : '/foreEnd/business/talentManage/talent/blogger/detail',
                                },
                            ];
                            return <Information data={data} hoverPopover={true} />;
                        })}
                </div>
            );
        },
    },
    {
        title: '签单额',
        dataIndex: 'orderAmount',
        align: 'center',
        render: (text) => {
            return `${thousandSeparatorFixed(text)}元`;
        },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: (d, record) => {
            return (
                <span
                    className={styles.operateBtn}
                    onClick={() => {
                        window.open(`/foreEnd/business/project/manage/detail?id=${record.id}`);
                    }}
                >
                    查看
                </span>
            );
        },
    },
];

// 客户
export const columns1 = [
    {
        title: '公司名称',
        dataIndex: 'companyName',
        align: 'center',
        render: (d, record) => {
            const data = [
                {
                    ...d,
                    id: record.companyId,
                    name: record.companyName,
                    path: '/foreEnd/business/customer/customer/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '公司类型',
        dataIndex: 'companyType',
        align: 'center',
        render: (text) => {
            return getOptionName(COMPANY_TYPE, text);
        },
    },
    {
        title: '负责人',
        dataIndex: 'headerName',
        align: 'center',
    },
    {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: (d, record) => {
            return (
                <span
                    className={styles.operateBtn}
                    onClick={() => {
                        window.open(`/foreEnd/business/customer/customer/detail?id=${record.id}`);
                    }}
                >
                    查看
                </span>
            );
        },
    },
];

// 艺人
export const columns2 = [
    {
        title: '艺人姓名',
        dataIndex: 'talentName',
        align: 'center',
        render: (d, record) => {
            const data = [
                {
                    id: record.id,
                    name: record.talentName,
                    path: '/foreEnd/business/talentManage/talent/actor/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '性别',
        dataIndex: 'talentGender',
        align: 'center',
        render: (text) => {
            return text === 0 ? '女' : '男';
        },
    },
    {
        title: '经理人',
        dataIndex: 'talentManager',
        align: 'center',
        render: (text) => {
            const result = text.reduce((total, item) => {
                return `${total}${item.name}、`;
            }, '');
            return result.slice(0, result.length - 1);
        },
    },
    {
        title: '签约状态',
        dataIndex: 'talentSignStatus',
        align: 'center',
        render: (text) => {
            return getOptionName(BLOGGER_SIGN_STATE, text);
        },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: (d, record) => {
            return (
                <span
                    className={styles.operateBtn}
                    onClick={() => {
                        window.open(`/foreEnd/business/talentManage/talent/actor/detail?id=${record.id}`);
                    }}
                >
                    查看
                </span>
            );
        },
    },
];

// 博主
export const columns3 = [
    {
        title: '博主姓名',
        dataIndex: 'talentName',
        align: 'center',
        render: (d, record) => {
            const data = [
                {
                    id: record.id,
                    name: record.talentName,
                    path: '/foreEnd/business/talentManage/talent/blogger/detail',
                },
            ];
            return <Information data={data} hoverPopover={true} />;
        },
    },
    {
        title: '性别',
        dataIndex: 'talentGender',
        align: 'center',
        render: (text) => {
            return text === 0 ? '女' : '男';
        },
    },
    {
        title: '制作人',
        dataIndex: 'talentManager',
        align: 'center',
        render: (text) => {
            const result = text.reduce((total, item) => {
                return `${total}${item.name}、`;
            }, '');
            return result.slice(0, result.length - 1);
        },
    },
    {
        title: '签约状态',
        dataIndex: 'talentSignStatus',
        align: 'center',
        render: (text) => {
            return getOptionName(BLOGGER_SIGN_STATE, text);
        },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: (d, record) => {
            return (
                <span
                    className={styles.operateBtn}
                    onClick={() => {
                        window.open(`/foreEnd/business/talentManage/talent/blogger/detail?id=${record.id}`);
                    }}
                >
                    查看
                </span>
            );
        },
    },
];

// 待审批
export const columns8 = [
    {
        title: '申请人',
        dataIndex: 'applyUserName',
        align: 'center',
    },
    {
        title: '审批事项',
        dataIndex: 'approvalThings',
        align: 'center',
    },
    {
        title: '申请时间',
        dataIndex: 'applyDate',
        align: 'center',
    },
    {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: (d, record) => {
            let result = '';
            switch (record.flowMark) {
                case 'common':
                    result = '/foreEnd/newApproval/detail';
                    break;
                case 'ContractCommerce':
                    result = '/foreEnd/approval/approval/business/detail';
                    break;
                case 'common_ContractCommerce':
                    result = '/foreEnd/approval/approval/contract/detail';
                    break;
                case 'contract':
                    result = '/foreEnd/business/project/contract/detail';
                    break;
                case 'projecting':
                    result = '/foreEnd/business/project/establish/detail';
                    break;
                case 'reimburse':
                    result = '/foreEnd/business/feeManage/reimbursement/detail';
                    break;
                case 'application':
                    result = '/foreEnd/business/feeManage/apply/detail';
                    break;
                case 'travel':
                    result = '/foreEnd/business/travelOrder/travelOrderManage/detail';
                    break;
                case 'outwork':
                    result = '/foreEnd/newApproval/detail';
                    break;
                case 'propagate':
                    result = '/foreEnd/newApproval/detail';
                    break;
                default:
                    break;
            }
            return (
                record.flowMark !== 'travel' && (
                    <span
                        className={styles.operateBtn}
                        onClick={async () => {
                            let id = record.id;
                            if (
                                record.flowMark === 'ContractCommerce'
                                || record.flowMark === 'common_ContractCommerce'
                            ) {
                                const res = await getCommerceId(record.id);
                                if (res && res.data) {
                                    id = res.data.clauseCurrentVersionId;
                                }
                            } else if (
                                record.flowMark === 'projecting'
                                || record.flowMark === 'reimburse'
                                || record.flowMark === 'contract'
                                || record.flowMark === 'application'
                            ) {
                                const res = await getHandoverFromFlowMark(record.flowMark, record.id);
                                if (res && res.data) {
                                    id = res.data;
                                }
                            }
                            window.open(`${result}?id=${id}`);
                        }}
                    >
                        查看
                    </span>
                )
            );
        },
    },
];
export const columns19 = [
    {
        title: '项目',
        dataIndex: 'projectName',
        align: 'center',
    },
    {
        title: '费用确认进度',
        dataIndex: 'applyUserName',
        align: 'center',
        render: (d, record) => {
            const all = record.all || 0;
            const hasEnd = record.hasEnd || 0;
            return all > 0 ? `${hasEnd}/${all}` : 0;
        },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: (d, record) => {
            return (
                <span
                    className={styles.operateBtn}
                    onClick={async () => {
                        const id = record.id;
                        window.open(`/foreEnd/business/project/contract/verify/detail?id=${id}`);
                    }}
                >
                    查看
                </span>
            );
        },
    },
];
