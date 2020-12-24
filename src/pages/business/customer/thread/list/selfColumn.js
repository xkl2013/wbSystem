import React from 'react';
import styles from './index.less';
import { THREAD_STATUS } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import AuthButton from '@/components/AuthButton';
import { getOptionName } from '@/utils/utils';

// 获取table列表头
export function columnsFn(props) {
    const columns = [
        {
            title: '线索名称',
            dataIndex: 'trailName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '公司名称',
            dataIndex: 'trailCustomerName',
            render: (text, record) => {
                return (
                    <span style={{ cursor: 'pointer' }}>
                        {!record.trailCompanyName ? renderTxt(text) : renderTxt(record.trailCompanyName)}
                    </span>
                );
            },
        },
        {
            title: '目标艺人/博主',
            dataIndex: 'trailTalentList',
            render: (text) => {
                const newName = [];
                if (Array.isArray(text)) {
                    text.map((item) => {
                        return newName.push(item.trailTalentName);
                    });
                }
                return <span style={{ cursor: 'pointer' }}>{renderTxt(newName.join('，'), 11)}</span>;
            },
        },
        {
            title: '线索状态',
            dataIndex: 'trailStatus',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{getOptionName(THREAD_STATUS, text)}</span>;
            },
        },
        {
            title: '负责人',
            dataIndex: 'trailHeaderName',
        },
        {
            title: '更新时间',
            dataIndex: 'trailUpdatedAt',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        {Number(record.trailStatus) === 1 && (
                            <AuthButton authority="/foreEnd/business/customer/thread/edit">
                                <span
                                    className={styles.btnCls}
                                    onClick={() => {
                                        return props.editData(record.trailId);
                                    }}
                                >
                                    {' '}
                                    编辑
                                </span>
                            </AuthButton>
                        )}
                        <AuthButton authority="/foreEnd/business/customer/thread/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.checkData(record.trailId);
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
}
export default columnsFn;
