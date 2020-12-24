/* eslint-disable max-len */
/*
 * @Author: your name
 * @Date: 2020-02-14 16:54:10
 * @LastEditTime : 2020-02-17 14:05:45
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/business/feeManage/apply/detail/reimbursementDetail/PushdownRecord.js
 */
import React from 'react';
import moment from 'moment';
import FlexDetail from '@/components/flex-detail';
import BITable from '@/ant_components/BITable';
import { DATETIME_FORMAT } from '@/utils/constants';
import { thousandSeparatorFixed, getOptionName } from '@/utils/utils';
import { FEE_APPLY_TYPE_LIST } from '@/utils/enum';

import styles from './index.less';
import Information from '@/components/informationModel';

const Index = (props) => {
    const columns = [
        {
            title: '序列',
            dataIndex: 'applicationCreateTime',
            align: 'center',
            render: (detail, item, index) => {
                return index + 1;
            },
        },
        {
            title: '下推时间',
            dataIndex: 'createTime',
            align: 'center',
            render: (d) => {
                return d && moment(d).format(DATETIME_FORMAT);
            },
        },
        {
            title: '本次下推金额',
            dataIndex: 'reimburseFeePushDown',
            align: 'center',
            render: (d) => {
                return thousandSeparatorFixed(d);
            },
        },
        {
            title: '报销单编号',
            dataIndex: 'reimburseCode',
            align: 'center',
            render: (d, record) => {
                if (record.isDeleted === 1) {
                    return d;
                }
                if (
                    record.reimburseStatus === 0
                    || (record.reimburseApproveStatus !== null
                        && record.reimburseApproveStatus !== 4
                        && record.reimburseApproveStatus !== 5
                        && record.reimburseApproveStatus !== 7)
                ) {
                    const data = [
                        {
                            ...d,
                            id: record.reimburseId,
                            name: record.reimburseCode,
                            path: '/foreEnd/business/feeManage/reimbursement/detail',
                        },
                    ];
                    return <Information data={data} />;
                }
                if (
                    record.reimburseStatus === 1
                    && (record.reimburseApproveStatus === null
                        || record.reimburseApproveStatus === 4
                        || record.reimburseApproveStatus === 5
                        || record.reimburseApproveStatus === 7)
                ) {
                    let str = '';
                    if (!record.reimburseInstanceId) {
                        str = `id=${record.reimburseId}`;
                    } else {
                        let resubmitEnum = 2;
                        if (record.reimburseApproveStatus === 7) {
                            resubmitEnum = 1;
                        }
                        str = `oldReimburseId=${record.reimburseId}&resubmitEnum=${resubmitEnum}`;
                    }
                    return (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`/foreEnd/business/feeManage/reimbursement/edit?${str}`}
                        >
                            {record.reimburseCode}
                        </a>
                    );
                }
                return d;
            },
        },
        {
            title: '操作/状态',
            dataIndex: 'reimburseApproveStatus',
            align: 'center',
            render: (text, record) => {
                if (record.isDeleted === 0 && !record.reimburseInstanceId) {
                    return (
                        <span
                            className={styles.btnActive}
                            onClick={() => {
                                return props.btnRepeal(record.reimburseId);
                            }}
                        >
                            撤销
                        </span>
                    );
                }
                if (record.isDeleted === 1) {
                    return <span className={styles.tagRepeal}>已撤销</span>;
                }
                if (record.isDeleted === 0 && record.reimburseInstanceId) {
                    return getOptionName(FEE_APPLY_TYPE_LIST, record.reimburseApproveStatus);
                }
                return null;
            },
        },
    ];
    return (
        <FlexDetail LabelWrap={[[]]} detail={{}} title="下推记录">
            <BITable
                rowKey="reimburseId"
                columns={columns}
                dataSource={!props.formData || JSON.stringify(props.formData) === '{}' ? [] : props.formData}
                bordered={true}
                pagination={false}
            />
        </FlexDetail>
    );
};

export default Index;
