import React from 'react';
import moment from 'moment';
import styles from '../index.less';
import { SEX_TYPE, BLOGGER_SIGN_STATE } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import { renderTxt } from '@/utils/hoverPopover';
import AuthButton from '@/components/AuthButton';
import { DATETIME_FORMAT } from '@/utils/constants';

// 获取table列表头
function columnsFn(props) {
    const columns = [
        {
            key: 0,
            title: '序列',
            dataIndex: 'index',
        },
        {
            title: '艺人姓名',
            dataIndex: 'starName',
        },
        {
            title: '性别',
            dataIndex: 'starGender',
            render: (text) => {
                return getOptionName(SEX_TYPE, text);
            },
        },
        {
            title: '经理人',
            dataIndex: 'starManagerName',
            render: (text) => {
                const name = (text || [])
                    .map((item) => {
                        return item.starParticipantName;
                    })
                    .join('、');
                return <span style={{ cursor: 'pointer' }}>{renderTxt(name)}</span>;
            },
        },
        {
            title: '更新时间',
            dataIndex: 'starUpdatedAt',
            render: (text) => {
                return text && moment(text).format(DATETIME_FORMAT);
            },
        },
        {
            title: '签约状态',
            dataIndex: 'starSignState',
            render: (text) => {
                return getOptionName(BLOGGER_SIGN_STATE, text);
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/talentManage/talent/actor/schedule">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.goSchedule(record);
                                }}
                            >
                                {' '}
                                查档期
                            </span>
                        </AuthButton>
                        <AuthButton authority="/foreEnd/business/talentManage/talent/actor/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.checkData(record.starId);
                                }}
                            >
                                {' '}
                                查看
                            </span>
                        </AuthButton>
                        <AuthButton authority="/foreEnd/business/talentManage/talent/actor/edit">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.editData(record.starId);
                                }}
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

const value = '';

export { columnsFn, value };
