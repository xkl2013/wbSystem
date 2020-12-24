import React from 'react';
import styles from './index.less';
import { APPROVAL_APPLY_STATUS } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import checkDetail from '@/pages/newApproval/_utils/checkDetail';
import { getOptionName } from '@/utils/utils';

// 获取table列表头
export default function columnsFn() {
    // const imgArr = [packing, packSucess, packError];
    const columns = [
        {
            title: '申请人',
            dataIndex: 'applyUserName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '申请人部门',
            dataIndex: 'applyUserDepartName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '审批分组',
            dataIndex: 'groupName',
        },
        {
            title: '审批事项',
            dataIndex: 'instanceName',
        },
        {
            title: '审批状态',
            dataIndex: 'status',
            render: (text) => {
                return getOptionName(APPROVAL_APPLY_STATUS, text);
            },
        },
        {
            title: '申请时间',
            dataIndex: 'applyDate',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                checkDetail({ instanceId: record.instanceId });
                                // return props.checkData(record);
                            }}
                        >
                            {' '}
                            查看
                        </span>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
