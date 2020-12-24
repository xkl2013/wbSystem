import React, { Component } from 'react';
import FlexDetail from '@/components/flex-detail';
import BITable from '@/ant_components/BITable';
import { getOptionName, str2arr, arr2str, thousandSeparatorFixed } from '@/utils/utils';
import AuthButton from '@/components/AuthButton';

import { DATE_FORMAT } from '@/utils/constants';
import { PAY_STATUS } from '@/utils/enum';
import moment from 'moment';
import styles from './index.less';

let Index = props => {
    const columns = [
        {
            title: '申请日期',
            dataIndex: 'reimburseApplyTime',
            align: 'center',
            render: d => d && d && moment(d).format(DATE_FORMAT),
        },
        {
            title: '申请付款总金额',
            dataIndex: 'reimburseTotalPayFee',
            align: 'center',
            render: d => thousandSeparatorFixed(d),
        },
        {
            title: '实际报销人',
            dataIndex: 'reimburseReimbureUserName',
            align: 'center',
        },
        {
            title: '收款人银行帐户',
            dataIndex: 'reimburseChequesBankAccountNo',
            align: 'center',
            key: 'reimburseChequesBankAccountNo',
        },
        {
            title: '帐户名称',
            dataIndex: 'reimburseChequesBankAccountName',
            align: 'center',
            key: 'reimburseChequesBankAccountName',
        },
        {
            title: '开户行',
            dataIndex: 'reimburseChequesBankAddress',
            align: 'center',
            key: 'reimburseChequesBankAddress',
        },
        {
            title: '开户地',
            dataIndex: 'reimburseChequesBankCity',
            align: 'center',
            key: 'reimburseChequesBankCity',
        },
        {
            title: '实际付款金额',
            dataIndex: 'reimburseTrulyPayFee',
            align: 'center',
            key: 'reimburseTrulyPayFee',
            render: d => thousandSeparatorFixed(d),
        },
        {
            title: '付款状态',
            dataIndex: 'reimbursePayStatus',
            align: 'center',
            key: 'reimbursePayStatus',
            render: d => getOptionName(PAY_STATUS, d),
        },
        {
            title: '付款确认日期',
            dataIndex: 'reimbursePayConfirmTime',
            align: 'center',
            key: 'reimbursePayConfirmTime',
            render: d => d && moment(d).format(DATE_FORMAT),
        },
        {
            title: '操作',
            dataIndex: 'indexs',
            align: 'center',
            render: (text, item) => {
                if (item && item.reimbursePayStatus == 0 && item.reimburseApproveStatus == 3) {
                    return (
                        <AuthButton authority="/foreEnd/business/feeManage/reimbursement/detail/payment">
                            <span className={styles.btnActive} onClick={props.confirmPay}>
                                付款确认
                            </span>
                        </AuthButton>
                    );
                } else {
                    return null;
                }
            },
        },
    ];
    return (
        <FlexDetail LabelWrap={[[]]} detail={{}} title="付款单">
            <BITable
                rowKey="reimburseReId2"
                columns={columns}
                dataSource={
                    !props.formData || JSON.stringify(props.formData) == '{}'
                        ? []
                        : [props.formData]
                }
                bordered={true}
                pagination={false}
            />
        </FlexDetail>
    );
};

export default Index;
