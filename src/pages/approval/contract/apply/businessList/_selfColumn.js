import React from 'react';
import AuthButton from '@/components/AuthButton';
import { getOptionName } from '@/utils/utils';
import { APPROVAL_STATUS, FINALIZED_STATUS, CONTRACT_SIGN_TYPE } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import checkDetail from '@/pages/newApproval/_utils/checkDetail';

// table列表头设定
export default function columnsFn() {
    const columns = [
        // {
        //     title: '申请单编号',
        //     width: 110,
        //     fixed: 'left',
        //     align: 'left',
        //     dataIndex: 'clauseApplyCode',
        //     render: (text) => {
        //         return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 10)}</span>;
        //     },
        // },
        {
            title: '申请单名称',
            width: 160,
            fixed: 'left',
            align: 'left',
            dataIndex: 'clauseName',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 10)}</span>;
            },
        },
        {
            title: '申请日期',
            width: 160,
            dataIndex: 'clauseApplyTime',
            render: (text) => {
                return text.slice(0, 10);
            },
        },
        {
            title: '申请人姓名',
            width: 100,
            dataIndex: 'clauseApplyUserName',
        },
        {
            title: '申请人所在部门',
            width: 160,
            dataIndex: 'clauseApplyDeptName',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '项目',
            width: 200,
            dataIndex: 'clauseProjectName',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 13)}</span>;
            },
        },
        {
            title: '艺人/博主',
            width: 120,
            dataIndex: 'clauseStarName',
            render: (text) => {
                // console.log(JSON.parse(text));
                // const resultArr = JSON.parse(text) || [];
                // let result = resultArr.map(item => item.talentName);
                // return (
                //     <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                //         {renderTxt(result.join(','), 10)}
                //     </span>
                // );
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 8)}</span>;
            },
        },
        {
            title: '签约方式',
            width: 100,
            dataIndex: 'clauseSigningWay',
            render: (text) => {
                return getOptionName(CONTRACT_SIGN_TYPE, text);
            },
        },
        {
            title: '审核轮次',
            width: 100,
            dataIndex: 'clauseCurrentVersionName',
        },
        {
            title: '审核状态',
            width: 100,
            dataIndex: 'clauseApprovalStatus',
            render: (text) => {
                return getOptionName(FINALIZED_STATUS, text);
            },
        },
        {
            title: '定稿状态',
            width: 80,
            dataIndex: 'clauseFinalizedStatus',
            render: (text) => {
                return getOptionName(APPROVAL_STATUS, text);
            },
        },
        {
            title: '定稿时间',
            width: 140,
            dataIndex: 'clauseFinalizedTime',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '操作',
            width: 80,
            fixed: 'right',
            dataIndex: 'clauseId',
            render: (text, record) => {
                const localUrl = window.location.pathname;
                let authority = '';
                if (localUrl === '/foreEnd/approval/apply/business') {
                    authority = '/foreEnd/approval/apply/business/detail';
                } else {
                    authority = '/foreEnd/business/project/verify/detail';
                }
                return (
                    <div>
                        <AuthButton authority={authority}>
                            <span
                                style={{ color: '#04b4ad', cursor: 'pointer' }}
                                onClick={() => {
                                    checkDetail({
                                        instanceId: record.clauseCurrentVersionId,
                                        flowKey: 'ContractCommerce',
                                    });
                                    // return props.checkData(record.clauseId);
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
