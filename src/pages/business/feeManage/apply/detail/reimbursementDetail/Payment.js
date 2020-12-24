import React, {Component} from 'react';
import FlexDetail from '@/components/flex-detail';
import BITable from '@/ant_components/BITable';
import {
  getOptionName,
  thousandSeparatorFixed

} from '@/utils/utils';
import { DATE_FORMAT } from '@/utils/constants'
import AuthButton from "@/components/AuthButton";

import {PAY_STATUS} from '@/utils/enum'
import moment from 'moment'
import styles from './index.less'


let Index = props => {


  const columns = [
    {
      title: '申请日期',
      dataIndex: 'applicationCreateTime',
      align: 'center',
      render: d => d && d && moment(d).format(DATE_FORMAT)
    },
    {
      title: '申请总金额',
      dataIndex: 'applicationApplyTotalFee',
      align: 'center',
      render: d => thousandSeparatorFixed(d)
    },
    {
      title: '申请人姓名',
      dataIndex: 'applicationUserName',
      align: 'center',
    },
    {
      title: '收款人银行帐户',
      dataIndex: 'applicationChequesBankAccountNo',
      align: 'center',
      key: 'applicationChequesBankAccountNo'
    },
    {
      title: '帐户名称',
      dataIndex: 'applicationChequesBankAccountName',
      align: 'center',
      key: 'applicationChequesBankAccountName',
    },
    {
      title: '开户行',
      dataIndex: 'applicationChequesBankAddress',
      align: 'center',
      key: 'applicationChequesBankAddress',
    },
    {
      title: '开户地',
      dataIndex: 'applicationChequesBankCity',
      align: 'center',
      key: 'applicationChequesBankCity',
    },
    {
      title: '实际付款总金额',
      dataIndex: 'applicationTrulyPayFee',
      align: 'center',
      key: 'applicationTrulyPayFee',
      render: d => thousandSeparatorFixed(d)
    },
    {
      title: '付款状态',
      dataIndex: 'applicationPayStatus',
      align: 'center',
      key: 'applicationPayStatus',
      render: d => getOptionName(PAY_STATUS, d)
    },
    {
      title: '付款确认日期',
      dataIndex: 'applicationPayConfirmTime',
      align: 'center',
      key: 'applicationPayConfirmTime',
      render: d => d && moment(d).format(DATE_FORMAT)
    },
    {
      title: '操作',
      dataIndex: 'indexs',
      align: 'center',
      render: (text, item) => {
        if(item && item.applicationPayStatus == 0 && item.applicationApproveStatus == 3){
          return (<AuthButton authority="/foreEnd/business/feeManage/apply/detail/payment">
              <span className={styles.btnActive} onClick={props.confirmPay}>付款确认</span>
          </AuthButton>)
        }else{
          return null
        }
      }
    },
  ];
  return (
    <FlexDetail LabelWrap={[[]]} detail={{}} title="付款单">
      <BITable
        rowKey="reimburseReId2"
        columns={columns}
        dataSource={!props.formData || JSON.stringify(props.formData) == '{}' ? [] : [props.formData]}
        bordered={true}
        pagination={false}
      />
    </FlexDetail>
  )
}

export default Index
