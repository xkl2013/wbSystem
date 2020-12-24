/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import React from 'react';
import moment from 'moment';
import styles from './index.less';
import { DATETIME_FORMAT } from '@/utils/constants';
import businessConfig from '@/config/business';
import Information from '@/components/informationModel';
import { checkEditAppointAuthority } from '../../config/authority';

// 获取table列表头
export function columnsFn({ formData }, props) {
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            render: (...arg) => {
                return arg[2] + 1;
            },
        },
        {
            title: '艺人/博主',
            dataIndex: 'projectAppointmentTalentName',
            render: (text, item) => {
                const actorConfig = businessConfig[1];
                const bloggerConfig = businessConfig[2];
                let path = actorConfig.pathname;
                if (Number(item.projectAppointmentTalentType) === 1) {
                    path = bloggerConfig.pathname;
                }
                const data = {
                    id: item.projectAppointmentTalentId,
                    name: text,
                    path,
                };
                return (
                    <span style={{ textAlign: 'center' }}>
                        <Information data={[data]} />
                    </span>
                );
            },
        },
        {
            title: '上线时间',
            dataIndex: 'projectLiveTime',
            align: 'center',
            render: (text) => {
                return text && moment(text).format(DATETIME_FORMAT);
            },
        },
        {
            title: '执行链接',
            dataIndex: 'projectExecuteUrl',
            align: 'center',
            width: '50%',
            render: (text) => {
                if (text) {
                    return text.split(',').map((item, i) => {
                        return (
                            <p key={i}>
                                <a href={item} target="blank">
                                    {item}
                                </a>
                            </p>
                        );
                    });
                }
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record, i) => {
                const recordData = record;
                recordData.disabled = i < formData.projectBudgets.length;
                return (
                    checkEditAppointAuthority(formData) && (
                        <div>
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.editTableLine(recordData);
                                }}
                            >
                                编辑
                            </span>
                            {i >= formData.projectBudgets.length && (
                                <span
                                    className={styles.btnCls}
                                    onClick={() => {
                                        return props.delTableLine(recordData);
                                    }}
                                >
                                    删除
                                </span>
                            )}
                        </div>
                    )
                );
            },
        },
    ];
    return columns || [];
}
export default columnsFn;
