/*
 * @Author: your name
 * @Date: 2019-12-30 09:52:04
 * @LastEditTime: 2019-12-31 10:58:22
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/approval/contract/approval/commonList/_selfColumn.js
 */
import React from 'react';
import AuthButton from '@/components/AuthButton';
import { getOptionName } from '@/utils/utils';
import { DEAL_STATUS, APPROVAL_STATUS } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import checkDetail from '@/pages/newApproval/_utils/checkDetail';

// table列表头设定
export default function columnsFn() {
    const columns = [
        {
            title: '申请单编号',
            dataIndex: 'clauseApplyCode',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 10)}</span>;
            },
        },
        {
            title: '申请日期',
            dataIndex: 'clauseApplyTime',
            render: (text) => {
                return text.slice(0, 10);
            },
        },
        {
            title: '申请人姓名',
            dataIndex: 'clauseApplyUserName',
        },
        {
            title: '申请人所在部门',
            dataIndex: 'clauseApplyDeptName',
        },
        {
            title: '项目',
            dataIndex: 'clauseProjectName',
        },
        {
            title: '审核轮次',
            dataIndex: 'clauseCurrentVersionName',
        },
        {
            title: '处理状态',
            dataIndex: 'handleStatus',
            render: (text) => {
                return getOptionName(DEAL_STATUS, text);
            },
        },
        {
            title: '定稿状态',
            dataIndex: 'clauseFinalizedStatus',
            render: (text) => {
                return getOptionName(APPROVAL_STATUS, text);
            },
        },
        {
            title: '定稿时间',
            dataIndex: 'clauseFinalizedTime',
        },
        {
            title: '操作',
            dataIndex: 'clauseId',
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/approval/approval/contract/detail">
                            <span
                                style={{ color: '#04b4ad', cursor: 'pointer' }}
                                onClick={() => {
                                    checkDetail({
                                        instanceId: record.clauseCurrentVersionId,
                                        flowKey: 'common_ContractCommerce',
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
