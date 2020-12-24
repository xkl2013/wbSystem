import React from 'react';
import styles from './index.less';
import { renderArrText, renderTxt } from '@/utils/hoverPopover';
import AuthButton from '@/components/AuthButton';
import { PROJECT_ESTABLISH_TYPE_SHOW } from '@/utils/enum';
import { getOptionName, dataMask4Number } from '@/utils/utils';

// 获取table列表头
export const columnsFn = (props) => {
    const columns = [
        {
            title: '项目名称',
            dataIndex: 'projectingName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '公司名称',
            dataIndex: 'projectingCustomerName',
            render: (text, record) => {
                return (
                    <span style={{ cursor: 'pointer' }}>
                        {!record.projectingCompanyName ? renderTxt(text) : renderTxt(record.projectingCompanyName)}
                    </span>
                );
            },
        },
        {
            title: '目标艺人/博主',
            dataIndex: 'talentsName',
            render: (text) => {
                const arr = text && text.split(',');
                return renderArrText(arr, 2);
            },
        },
        {
            title: '签单额',
            dataIndex: 'projectingBudget',
            render: (text) => {
                return text && `${dataMask4Number(text)}元`;
            },
        },
        {
            title: '立项状态',
            dataIndex: 'projectingApprovalState',
            render: (text) => {
                return getOptionName(PROJECT_ESTABLISH_TYPE_SHOW, text);
            },
        },
        {
            title: '负责人',
            dataIndex: 'projectingHeaderName',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/project/establish/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.checkData(record.projectingId);
                                }}
                            >
                                {' '}
                                查看
                            </span>
                        </AuthButton>
                    </div>
                );
            },
        },
    ];
    return columns || [];
};
export default columnsFn;
