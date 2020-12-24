/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 **/
import styles from './index.less';
import { DATE_FORMAT } from "@/utils/constants";
import AuthButton from "@/components/AuthButton";

import { getOptionName, thousandSeparatorFixed } from '@/utils/utils'
import { CONTRACT_INVOICE_COMPANY_TYPE, CONTRACT_INVOICE_TYPE, CONTRACT_INVOICE_TAX_RATE } from '@/utils/enum'

import moment from 'moment';

// 获取table列表头
export function columnsFn(currentIsCreater, props) {
  const columns = [
    {
      title: '序列',
      align: 'center',
      dataIndex: 'bacsskPeriods',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '开票主体类型',
      align: 'center',
      dataIndex: 'contractInvoiceCompanyType',
      render: text => getOptionName(CONTRACT_INVOICE_COMPANY_TYPE, text)
    },
    {
      title: '发票开具时间',
      align: 'center',
      dataIndex: 'contractInvoiceDate',
      render: (text) => {
        return text && moment(text).format(DATE_FORMAT);
      }
    },
    {
      title: '发票类型',
      align: 'center',
      dataIndex: 'contractInvoiceType',
      render: text => getOptionName(CONTRACT_INVOICE_TYPE, text)
    },
    {
      title: '含税金额',
      align: 'center',
      dataIndex: 'contractInvoiceMoney',
      render: text => thousandSeparatorFixed(text)
    },
    {
      title: '税率',
      align: 'center',
      dataIndex: 'contractInvoiceTaxRate',
      render: text => text && getOptionName(CONTRACT_INVOICE_TAX_RATE, text)
    },
    {
      title: '税额',
      align: 'center',
      dataIndex: 'contractInvoiceTaxMoney',
      render: text => thousandSeparatorFixed(text)
    },
    {
      title: '实际金额',
      align: 'center',
      dataIndex: 'contractInvoiceTaxMoney111',
      render: text => thousandSeparatorFixed(text)
    },
    {
      title: '费用确认时间',
      align: 'center',
      dataIndex: 'contractInvoiceDate',
      render: (text) => {
        return text && moment(text).format(DATE_FORMAT);
      }
    },
    {
      title: '费用确认金额',
      align: 'center',
      dataIndex: 'contractInvoiceDate',
      render: (text) => {
        return 1000
      }
    },
    {
      title: '费用确认状态',
      align: 'center',
      dataIndex: 'contractInvoiceTaxMoney111',
      render: text => '未确认|已确认|部分确认'
    },
    // {
    //   title: '审批状态',
    //   align: 'center',
    //   dataIndex: 'contractInvoiceTaxMoney111',
    //   render: text => '待审批|已通过|已驳回'
    // },
    // {
    //   title: '驳回原因',
    //   align: 'center',
    //   dataIndex: 'contractInvoiceTaxMoney111',
    //   render: text => '实际回款比发票金额少,不予通过'
    // },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <div>
            <span className={styles.btnCls} onClick={() => props.editTableLine(record)}> 编辑</span>
            <span className={styles.btnCls} onClick={() => props.delTableLine(record)}> 删除</span>
            <span className={styles.btnCls} onClick={() => props.props.checkVerifyModal(record)}> 发起费用确认</span>
          </div>
        );
      },
    },
  ];
  return columns || [];
}
