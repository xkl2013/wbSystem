/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import React from 'react';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/constants';
import businessConfig from '@/config/business';
import Information from '@/components/informationModel';
import { thousandSeparatorFixed } from '@/utils/utils';
import { openUrl } from '@/utils/urlOp';
import styles from './index.less';

const createContract = (record, formData) => {
    if (!formData.projectingId || !record.id) {
        return false;
    }
    openUrl('/foreEnd/business/project/contract/add', { projectId: formData.projectingId, authorizedId: record.id });
};
// 获取table列表头
export function columnsFn({ formData, from }, props) {
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
            title: '授权公司主体',
            dataIndex: 'companyName',
            render: (text, item) => {
                const config = businessConfig[3];
                const path = config.pathname;
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
            title: '授权签单额（元）',
            dataIndex: 'amount',
            align: 'center',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
        },
        {
            title: '授权链接',
            dataIndex: 'url',
            align: 'center',
            width: '30%',
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
            title: '授权起止时间',
            dataIndex: 'startTime',
            align: 'center',
            render: (text, record) => {
                let str = text && moment(text).format(DATE_FORMAT);
                if (record.endTime) {
                    str += ` ~ ${moment(record.endTime).format(DATE_FORMAT)}`;
                }
                return str;
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            align: 'center',
            width: '30%',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: '10%',
            render: (text, record) => {
                return (
                    <div>
                        <span
                            className={
                                Number(formData.endStatus) === 1 ? `${styles.btnCls} ${styles.disabled}` : styles.btnCls
                            }
                            onClick={createContract.bind(this, record, formData, from)}
                        >
                            创建合同
                        </span>
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return props.editTableLine(record);
                            }}
                        >
                            编辑
                        </span>
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return props.delTableLine(record);
                            }}
                        >
                            删除
                        </span>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
export default columnsFn;
